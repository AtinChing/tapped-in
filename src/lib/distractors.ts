import type { Company } from '../types'
import { shuffle } from './shuffle'

function uniqueDoes(pool: Company[], excludeDoes: string): Company[] {
  const seen = new Set<string>([excludeDoes])
  const out: Company[] = []
  for (const company of pool) {
    if (seen.has(company.does)) continue
    seen.add(company.does)
    out.push(company)
  }
  return out
}

export function pickChoices(
  company: Company,
  corpus: Company[],
  gottenRightBefore: boolean,
): string[] {
  const others = corpus.filter((row) => row.id !== company.id)
  const same = uniqueDoes(
    others.filter((row) => row.vertical === company.vertical),
    company.does,
  )
  const different = uniqueDoes(
    others.filter((row) => row.vertical !== company.vertical),
    company.does,
  )

  const primary = gottenRightBefore ? same : different
  const fallback = gottenRightBefore ? different : same
  const rest = uniqueDoes(others, company.does)

  const picked: Company[] = []
  const take = (pool: Company[]) => {
    for (const row of shuffle(pool)) {
      if (picked.length >= 3) return
      if (picked.some((p) => p.id === row.id || p.does === row.does)) continue
      picked.push(row)
    }
  }

  take(primary)
  take(fallback)
  take(rest)

  const options = shuffle([company.does, ...picked.map((row) => row.does)])
  if (!options.includes(company.does)) {
    options[0] = company.does
  }
  return options.slice(0, 4)
}
