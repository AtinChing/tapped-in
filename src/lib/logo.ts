/** Google's missing-favicon globe is tiny; real icons at sz=128 are larger. */
export const LOGO_MIN_PX = 32

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
}

export function shouldShowLetterFallback(naturalWidth: number): boolean {
  return naturalWidth < LOGO_MIN_PX
}
