import { useState } from 'react'
import { faviconUrl, shouldShowLetterFallback } from '../lib/logo'

type LogoProps = {
  domain: string
  name: string
}

export function Logo({ domain, name }: LogoProps) {
  const [showImage, setShowImage] = useState(false)
  const letter = (name.trim()[0] || '?').toUpperCase()

  return (
    <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden border border-ink bg-paper text-2xl font-semibold leading-none text-ink">
      <span aria-hidden={showImage} className={showImage ? 'sr-only' : undefined}>
        {letter}
      </span>
      <img
        src={faviconUrl(domain)}
        alt=""
        width={56}
        height={56}
        className={
          showImage
            ? 'absolute inset-0 h-full w-full bg-paper object-contain p-1'
            : 'pointer-events-none absolute h-0 w-0 opacity-0'
        }
        onLoad={(event) => {
          if (!shouldShowLetterFallback(event.currentTarget.naturalWidth)) {
            setShowImage(true)
          }
        }}
        onError={() => setShowImage(false)}
      />
    </div>
  )
}
