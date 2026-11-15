import { BookOpenCheck, FlaskConical, HelpCircle } from 'lucide-react'
import type { ClaimKind } from '../data/sources'

const map: Record<ClaimKind, { label: string; cls: string; Icon: typeof BookOpenCheck }> = {
  'source-fact': { label: 'Source fact', cls: 'border-nominal/50 text-nominal', Icon: BookOpenCheck },
  'derived-value': { label: 'Derived value', cls: 'border-nominal/50 text-nominal', Icon: BookOpenCheck },
  'game-assumption': { label: 'Game assumption', cls: 'border-caution/60 text-caution', Icon: FlaskConical },
  'needs-source': { label: 'Needs source', cls: 'border-critical/60 text-critical', Icon: HelpCircle },
}

/** Icon + text label so the claim type never depends on color (spec 8.3). */
export function ClaimBadge({ kind }: { kind: ClaimKind }) {
  const { label, cls, Icon } = map[kind]
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium ${cls}`}>
      <Icon size={12} aria-hidden /> {label}
    </span>
  )
}