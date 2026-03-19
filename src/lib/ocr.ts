
export async function extractTextFromImage(file: File): Promise<string> {
  // Simple, robust API path: use Tesseract.recognize directly
  const t = await import('tesseract.js')
  const Tesseract = (t.default ?? t) as any
  const recognize = Tesseract.recognize || Tesseract.default?.recognize
  if (typeof recognize !== 'function') throw new Error('Unable to load Tesseract recognize')

  const response = await recognize(file, 'eng', { logger: () => {} })
  return response?.data?.text ?? response?.text ?? ''
}

