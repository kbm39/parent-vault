import { extractTextFromPdf } from './extractPdf'
import { supabase } from './supabase'

interface FieldDef {
  key: string
  label: string
}

async function getParseHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function parseDocumentWithAI(
  file: File,
  fields: FieldDef[],
  sectionName: string
): Promise<Record<string, string>> {
  // Send the document to a server-side parse proxy which keeps the API key secret.
  // Default to localhost:4001 for development when VITE_PARSE_PROXY_URL is not set.
  const proxyBase = import.meta.env.VITE_PARSE_PROXY_URL || 'http://localhost:4001'

  // Prefer sending a text fallback for large PDFs to avoid huge base64 payloads.
  const MAX_BASE64_BYTES = 2 * 1024 * 1024 // 2 MB
  if (file.size > MAX_BASE64_BYTES) {
    const text = await extractTextFromPdf(file as File)
    const headers = await getParseHeaders()
    const resp = await fetch(`${proxyBase}/api/parse`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ type: 'text', content: text, fields, sectionName })
    })

    if (!resp.ok) {
      const textErr = (await resp.text()) || '[empty]'
      throw new Error(`Parse proxy failed: ${resp.status} ${resp.statusText}: ${textErr}`)
    }

    const data = await resp.json()
    return data.parsed ?? {}
  }

  // Convert file to base64
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  const headers = await getParseHeaders()

  const resp = await fetch(`${proxyBase}/api/parse`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: 'base64', content: base64, fields, sectionName })
  })

  if (!resp.ok) {
    const text = (await resp.text()) || '[empty]'
    throw new Error(`Parse proxy failed: ${resp.status} ${resp.statusText}: ${text}`)
  }

  const data = await resp.json()
  return data.parsed ?? {}
}

export async function parseTextWithAI(
  text: string,
  fields: FieldDef[],
  sectionName: string
): Promise<Record<string, string>> {
  const proxyBase = import.meta.env.VITE_PARSE_PROXY_URL || 'http://localhost:4001'
  const headers = await getParseHeaders()
  const resp = await fetch(`${proxyBase}/api/parse`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: 'text', content: text, fields, sectionName })
  })

  if (!resp.ok) {
    const txt = (await resp.text()) || '[empty]'
    throw new Error(`Parse proxy failed: ${resp.status} ${resp.statusText}: ${txt}`)
  }

  const data = await resp.json()
  return data.parsed ?? {}
}
