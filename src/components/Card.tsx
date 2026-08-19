import type { Company } from '../types'
import { Logo } from './Logo'

type CardProps = {
  company: Company
  index: number
  total: number
  choices: string[]
  picked: string | null
  revealed: boolean
  onPick: (choice: string) => void
}

export function Card({
  company,
  index,
  total,
  choices,
  picked,
  revealed,
  onPick,
}: CardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4 border-b border-ink pb-2 font-mono text-[11px] uppercase tracking-[0.18em]">
        <span>Card {index + 1} / {total}</span>
        <span className="text-rule">1–4 answer · space next</span>
      </div>

      <div className="flex items-center gap-3">
        <Logo domain={company.domain} name={company.name} />
        <h1 className="font-display text-[clamp(2rem,6vw,3.4rem)] leading-[0.95] tracking-[-0.03em]">
          {company.name}
        </h1>
      </div>

      <ol className="flex flex-col gap-1.5">
        {choices.map((choice, i) => {
          const key = String(i + 1)
          const isPicked = picked === choice
          const isRight = choice === company.does
          let mark = 'border-ink bg-paper'
          if (revealed && isRight) mark = 'border-ink bg-ink text-paper'
          if (revealed && isPicked && !isRight) mark = 'border-red bg-red text-paper'
          return (
            <li key={`${key}-${choice}`}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => onPick(choice)}
                className={`flex w-full items-start gap-3 border px-2.5 py-2 text-left text-[15px] leading-snug ${mark} ${revealed ? 'cursor-default' : 'hover:bg-wash'}`}
              >
                <span className="font-mono text-xs leading-6">{key}</span>
                <span>{choice}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {revealed ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-ink pt-3 font-mono text-sm">
          <dt className="text-rule">Vertical</dt>
          <dd>{company.vertical}</dd>
          <dt className="text-rule">Founded</dt>
          <dd>{company.founded}</dd>
          <dt className="text-rule">Notable</dt>
          <dd>{company.notable}</dd>
          <dt className="text-rule">Status</dt>
          <dd className={company.status === 'faded' ? 'text-red' : undefined}>{company.status}</dd>
        </dl>
      ) : null}
    </div>
  )
}
