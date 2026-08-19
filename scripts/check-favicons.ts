import { faviconUrl, shouldShowLetterFallback } from '../src/lib/logo.ts'

const samples = [
  'this-domain-does-not-exist-tapped-in-xyz.test',
  'openai.com',
  'ssi.inc',
]

async function sizeOf(domain: string): Promise<number> {
  const response = await fetch(faviconUrl(domain))
  if (!response.ok) return 0
  const bytes = new Uint8Array(await response.arrayBuffer())
  // PNG IHDR width lives at bytes 16-19 when the payload is PNG.
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    return (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19]
  }
  // ICO/other: treat tiny payloads as missing.
  return bytes.length < 200 ? 8 : 128
}

for (const domain of samples) {
  const width = await sizeOf(domain)
  const fallback = shouldShowLetterFallback(width) || width === 0
  console.log(domain, { width, fallback })
}
