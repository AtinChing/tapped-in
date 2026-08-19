export type Company = {
  id: string
  name: string
  domain: string
  vertical: string
  does: string
  founded: number
  notable: string
  status: 'active' | 'faded'
  loudness: 1 | 2 | 3
  source: string
}

export type CardProgress = {
  bucket: 1 | 2 | 3
  dueSession: number
  timesCorrect: number
}

export type SessionAnswer = {
  id: string
  picked: string
  correct: boolean
}

export type CurrentSession = {
  number: number
  cardIds: string[]
  index: number
  answers: SessionAnswer[]
  revealed: boolean
  picked: string | null
  finished: boolean
  choices: string[]
}

export type Store = {
  completedSessions: number
  cards: Record<string, CardProgress>
  current: CurrentSession | null
}
