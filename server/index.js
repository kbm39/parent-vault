import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { config as loadEnv } from 'dotenv'

// Load shared env first, then allow machine-local overrides.
loadEnv({ quiet: true })
loadEnv({ path: '.env.local', override: true, quiet: true })

const app = express()
const port = process.env.PORT || 4001

function createRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function logEvent(level, event, meta = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...meta,
  }
  const line = JSON.stringify(payload)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || ''
function normalizeOrigin(value) {
  if (!value) return ''
  const trimmed = value.trim().replace(/\/$/, '')
  try {
    return new URL(trimmed).origin
  } catch {
    return trimmed
  }
}

const allowedFrontendOrigins = FRONTEND_ORIGIN
  .split(',')
  .map((v) => normalizeOrigin(v))
  .filter(Boolean)
const isDev = process.env.NODE_ENV !== 'production'

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedFrontendOrigins.length > 0) return allowedFrontendOrigins.includes(normalizeOrigin(origin))
  if (isDev) return /^https?:\/\/localhost:\d+$/.test(origin)
  return false
}

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['POST', 'OPTIONS'],
}))
app.use(bodyParser.json({ limit: '25mb' }))
app.use((req, _res, next) => {
  req.requestId = createRequestId()
  next()
})

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

if (!ANTHROPIC_KEY) {
  console.warn('Warning: ANTHROPIC_API_KEY not set. /api/parse will return an error.')
} else {
  console.log(`Anthropic key loaded (first 8 chars): ${ANTHROPIC_KEY.slice(0, 8)}...`)
}

if (!supabaseAdmin) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. /api/parse auth checks will fail.')
}

const requestBuckets = new Map()
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20

function rateLimit(req, res, next) {
  const key = req.ip || 'unknown'
  const now = Date.now()
  const current = requestBuckets.get(key)

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    logEvent('warn', 'rate_limit_exceeded', { requestId: req.requestId, ip: key })
    return res.status(429).json({ error: 'Too many parse requests. Please try again shortly.' })
  }

  current.count += 1
  requestBuckets.set(key, current)
  return next()
}

async function requireAuth(req, res, next) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Server missing Supabase admin config' })
  }

  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    logEvent('warn', 'missing_bearer_token', { requestId: req.requestId, ip: req.ip })
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  const token = authHeader.slice('Bearer '.length)
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) {
    logEvent('warn', 'invalid_bearer_token', { requestId: req.requestId, ip: req.ip })
    return res.status(401).json({ error: 'Invalid or expired auth token' })
  }

  req.user = data.user
  logEvent('info', 'parse_auth_ok', { requestId: req.requestId, userId: data.user.id })
  return next()
}

function validateParseBody(body) {
  if (!body || typeof body !== 'object') return 'Missing request body'

  const { type, content, fields, sectionName, mediaType } = body

  if (type !== 'base64' && type !== 'text' && type !== 'image') return 'Invalid type'
  if (typeof content !== 'string' || !content.trim()) return 'Missing or invalid content'
  if (!Array.isArray(fields) || fields.length === 0) return 'Missing or invalid fields'
  if (fields.length > 50) return 'Too many fields requested'
  if (type === 'image') {
    if (typeof mediaType !== 'string' || !/^image\/[a-zA-Z0-9.+-]+$/.test(mediaType)) {
      return 'Invalid or missing mediaType for image content'
    }
  }
  if (sectionName != null && (typeof sectionName !== 'string' || sectionName.length > 80)) {
    return 'Invalid sectionName'
  }

  for (const f of fields) {
    if (!f || typeof f !== 'object') return 'Invalid field definition'
    if (typeof f.key !== 'string' || typeof f.label !== 'string') return 'Invalid field definition'
    if (!/^[a-zA-Z0-9_\-]{1,64}$/.test(f.key)) return 'Invalid field key format'
    if (!f.label.trim() || f.label.length > 120) return 'Invalid field label'
  }

  // Reasonable body caps by content type to reduce abuse and accidental huge payloads.
  if (type === 'text' && content.length > 300_000) return 'Text content too large'
  if (type === 'base64' && content.length > 14_000_000) return 'Base64 content too large'
  if (type === 'image' && content.length > 14_000_000) return 'Image base64 content too large'

  return null
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'parse-proxy',
    anthropicConfigured: Boolean(ANTHROPIC_KEY),
    supabaseAdminConfigured: Boolean(supabaseAdmin),
    frontendOriginLocked: allowedFrontendOrigins.length > 0,
    allowedFrontendOrigins,
  })
})

app.post('/api/parse', rateLimit, requireAuth, async (req, res) => {
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' })
  }

  if (typeof ANTHROPIC_KEY !== 'string' || ANTHROPIC_KEY.length < 10) {
    return res.status(500).json({ error: 'Server has invalid ANTHROPIC_API_KEY format' })
  }

  const validationError = validateParseBody(req.body)
  if (validationError) {
    logEvent('warn', 'parse_validation_failed', {
      requestId: req.requestId,
      userId: req.user?.id,
      reason: validationError,
    })
    return res.status(400).json({ error: validationError })
  }

  const { type, content, fields, sectionName, mediaType } = req.body

  try {
    logEvent('info', 'parse_request_received', {
      requestId: req.requestId,
      userId: req.user?.id,
      type,
      fieldCount: fields.length,
      contentLength: content.length,
      sectionName: sectionName || null,
    })

    const fieldList = fields.map(f => `"${f.key}": "${f.label}"`).join(', ')

    const userMessageParts = []
    if (type === 'base64') {
      userMessageParts.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: content
        }
      })
    } else if (type === 'image') {
      userMessageParts.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: content
        }
      })
    } else if (type === 'text') {
      userMessageParts.push({
        type: 'text',
        text: content
      })
    } else {
      return res.status(400).json({ error: 'Invalid type' })
    }

    userMessageParts.push({
      type: 'text',
      text: `Extract information from this ${sectionName} document. Return ONLY a valid JSON object with these fields: { ${fieldList} }. Only include fields you can find in the document — omit fields you cannot find. No explanation, just JSON.`
    })

    const payload = {
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessageParts }]
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    })

    if (!r.ok) {
      const text = await r.text()
      logEvent('warn', 'anthropic_non_200', {
        requestId: req.requestId,
        userId: req.user?.id,
        status: r.status,
      })
      return res.status(502).json({ error: `Anthropic error: ${text}` })
    }

    const data = await r.json()
    const contentText = data.content?.[0]?.text || JSON.stringify(data)
    const match = contentText.match(/\{[\s\S]*\}/)
    if (!match) return res.status(200).json({ parsed: {} })
    const parsed = JSON.parse(match[0])

    // Filter out empty values and stringify
    const result = Object.fromEntries(
      Object.entries(parsed)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )

    logEvent('info', 'parse_request_succeeded', {
      requestId: req.requestId,
      userId: req.user?.id,
      parsedKeys: Object.keys(result),
    })

    return res.json({ parsed: result })
  } catch (err) {
    logEvent('error', 'parse_request_failed', {
      requestId: req.requestId,
      userId: req.user?.id,
      message: String(err),
    })
    return res.status(500).json({ error: String(err) })
  }
})

const server = app.listen(port, () => {
  console.log(`AI parse proxy listening on http://localhost:${port}`)
})

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the existing process or start with a different PORT.`)
    console.error(`Example: kill $(lsof -t -i :${port})`)
    process.exit(1)
  }

  console.error('Server failed to start:', err)
  process.exit(1)
})
