import type { CardProgress, Company, Store } from '../types'
import { shuffle } from './shuffle'

export const SESSION_SIZE = 20
export const NEW_PER_SESSION = 10

function intervalFor(bucket: 1 | 2 | 3): number {
  if (bucket === 1) return 1
  if (bucket === 2) return 3
  return 10
}

export function emptyStore(): Store {
  return { completedSessions: 0, cards: {}, current: null }
}

export function buildSession(corpus: Company[], store: Store): string[] {
  const sessionNumber = store.completedSessions + 1
  const seen = new Set(Object.keys(store.cards))

  const due = corpus
    .filter((company) => {
      const progress = store.cards[company.id]
      return progress != null && progress.dueSession <= sessionNumber
    })
    .sort((a, b) => {
      const bucketDiff = store.cards[a.id].bucket - store.cards[b.id].bucket
      if (bucketDiff !== 0) return bucketDiff
      if (a.loudness !== b.loudness) return a.loudness - b.loudness
      return a.name.localeCompare(b.name)
    })

  const fresh = corpus
    .filter((company) => !seen.has(company.id))
    .sort((a, b) => {
      if (a.loudness !== b.loudness) return a.loudness - b.loudness
      return a.name.localeCompare(b.name)
    })

  const dueTake = due.slice(0, SESSION_SIZE)
  const remaining = SESSION_SIZE - dueTake.length
  const newCap = dueTake.length === 0 ? SESSION_SIZE : NEW_PER_SESSION
  const newTake = fresh.slice(0, Math.min(remaining, newCap))

  return shuffle([...dueTake, ...newTake].map((company) => company.id))
}

export function applyAnswer(
  store: Store,
  id: string,
  correct: boolean,
): CardProgress {
  const sessionNumber = store.current?.number ?? store.completedSessions + 1
  const prev = store.cards[id]
  if (!correct) {
    return {
      bucket: 1,
      dueSession: sessionNumber + 1,
      timesCorrect: prev?.timesCorrect ?? 0,
    }
  }
  let nextBucket: 1 | 2 | 3 = 2
  if (prev?.bucket === 2 || prev?.bucket === 3) nextBucket = 3
  return {
    bucket: nextBucket,
    dueSession: sessionNumber + intervalFor(nextBucket),
    timesCorrect: (prev?.timesCorrect ?? 0) + 1,
  }
}
