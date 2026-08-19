import { useEffect, useMemo, useState } from 'react'
import companiesJson from '../companies.json'
import { Card } from './components/Card'
import { Recap } from './components/Recap'
import { pickChoices } from './lib/distractors'
import { applyAnswer, buildSession } from './lib/schedule'
import { loadStore, saveStore } from './lib/storage'
import type { Company, Store } from './types'

const corpus = companiesJson as Company[]

function withChoices(store: Store, cardId: string): string[] {
  const company = corpus.find((row) => row.id === cardId)
  if (!company) return []
  const gottenRightBefore = (store.cards[company.id]?.timesCorrect ?? 0) > 0
  return pickChoices(company, corpus, gottenRightBefore)
}

function startSession(store: Store): Store {
  const cardIds = buildSession(corpus, store)
  const next: Store = {
    ...store,
    current: {
      number: store.completedSessions + 1,
      cardIds,
      index: 0,
      answers: [],
      revealed: false,
      picked: null,
      finished: false,
      choices: cardIds[0] ? withChoices(store, cardIds[0]) : [],
    },
  }
  saveStore(next)
  return next
}

export default function App() {
  const [store, setStore] = useState<Store>(() => loadStore())

  const current = store.current
  const company = useMemo(() => {
    if (!current) return null
    const id = current.cardIds[current.index]
    return corpus.find((row) => row.id === id) ?? null
  }, [current])

  const choices = current?.choices ?? []

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const session = store.current

      if (!session) {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setStore((prev) => startSession(prev))
        }
        return
      }

      if (session.finished) {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          setStore((prev) => startSession({ ...prev, current: null }))
        }
        return
      }

      if (!session.revealed && /^[1-4]$/.test(event.key)) {
        event.preventDefault()
        const choice = session.choices[Number(event.key) - 1]
        if (choice) pick(choice)
        return
      }

      if (session.revealed && event.key === ' ') {
        event.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function commit(next: Store) {
    saveStore(next)
    setStore(next)
  }

  function pick(choice: string) {
    if (!store.current || !company || store.current.revealed) return
    const correct = choice === company.does
    const progress = applyAnswer(store, company.id, correct)
    commit({
      ...store,
      cards: { ...store.cards, [company.id]: progress },
      current: {
        ...store.current,
        revealed: true,
        picked: choice,
        answers: [
          ...store.current.answers,
          { id: company.id, picked: choice, correct },
        ],
      },
    })
  }

  function advance() {
    if (!store.current || !store.current.revealed) return
    const last = store.current.index >= store.current.cardIds.length - 1
    if (last) {
      commit({
        ...store,
        completedSessions: store.completedSessions + 1,
        current: { ...store.current, finished: true },
      })
      return
    }
    const nextIndex = store.current.index + 1
    const nextId = store.current.cardIds[nextIndex]
    commit({
      ...store,
      current: {
        ...store.current,
        index: nextIndex,
        revealed: false,
        picked: null,
        choices: withChoices(store, nextId),
      },
    })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-[42rem] flex-col px-4 py-5">
      <header className="mb-6 flex items-baseline justify-between border-b-2 border-ink pb-2">
        <p className="font-display text-xl leading-none tracking-tight">Tapped In</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-rule">
          Name drill · {corpus.length} companies
        </p>
      </header>

      {!current ? (
        <div className="flex flex-1 flex-col gap-6">
          <p className="font-display text-4xl leading-[0.95] tracking-[-0.03em]">
            Twenty names. What they sell.
          </p>
          <p className="max-w-sm text-sm leading-snug text-rule">
            Logo and name first. Four lines from the corpus, never invented.
            Keys 1 to 4 pick. Space advances.
          </p>
          <button
            type="button"
            onClick={() => setStore((prev) => startSession(prev))}
            className="self-start border border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-paper"
          >
            Start · space
          </button>
        </div>
      ) : null}

      {current && !current.finished && company && choices.length === 4 ? (
        <Card
          company={company}
          index={current.index}
          total={current.cardIds.length}
          choices={choices}
          picked={current.picked}
          revealed={current.revealed}
          onPick={pick}
        />
      ) : null}

      {current?.finished ? (
        <Recap
          companies={corpus}
          answers={current.answers}
          onAgain={() => setStore((prev) => startSession({ ...prev, current: null }))}
        />
      ) : null}

      {current && current.revealed && !current.finished ? (
        <button
          type="button"
          onClick={advance}
          className="mt-5 self-start border border-ink px-3 py-2 font-mono text-xs uppercase tracking-[0.18em]"
        >
          Next · space
        </button>
      ) : null}
    </div>
  )
}
