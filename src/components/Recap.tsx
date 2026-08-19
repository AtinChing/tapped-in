import type { Company, SessionAnswer } from '../types'

type RecapProps = {
  companies: Company[]
  answers: SessionAnswer[]
  onAgain: () => void
}

export function Recap({ companies, answers, onAgain }: RecapProps) {
  const byId = new Map(companies.map((company) => [company.id, company]))
  const misses = answers.filter((answer) => !answer.correct)

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
        Session recap · {misses.length} missed of {answers.length}
      </div>
      {misses.length === 0 ? (
        <p className="font-display text-3xl leading-tight">Clean sheet. All twenty held.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {misses.map((answer) => {
            const company = byId.get(answer.id)
            if (!company) return null
            return (
              <li key={answer.id} className="border-b border-hairline pb-3">
                <div className="font-display text-2xl leading-tight">{company.name}</div>
                <p className="mt-1 text-sm">{company.does}</p>
                <p className="mt-1 font-mono text-[11px] text-rule">
                  {company.vertical} · {company.founded} · {company.notable}
                </p>
              </li>
            )
          })}
        </ol>
      )}
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-rule">
        Space to run another twenty
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="self-start border border-ink bg-ink px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-paper"
      >
        Again
      </button>
    </div>
  )
}
