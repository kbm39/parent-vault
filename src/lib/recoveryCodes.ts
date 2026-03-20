const RECOVERY_MARKER_KEY = 'pv_mfa_recovery_ok'

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomChunk(length: number) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

export function generateRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () => `${randomChunk(4)}-${randomChunk(4)}`)
}

export function normalizeRecoveryCode(input: string) {
  return input.replace(/[^a-z0-9]/gi, '').toUpperCase()
}

export async function hashRecoveryCode(code: string) {
  const normalized = normalizeRecoveryCode(code)
  const encoded = new TextEncoder().encode(normalized)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function markRecoveryMfaSatisfied(userId: string) {
  sessionStorage.setItem(RECOVERY_MARKER_KEY, userId)
}

export function clearRecoveryMfaMarker() {
  sessionStorage.removeItem(RECOVERY_MARKER_KEY)
}

export function hasRecoveryMfaMarker(userId: string) {
  return sessionStorage.getItem(RECOVERY_MARKER_KEY) === userId
}