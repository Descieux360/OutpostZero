import { AlertTriangle, CheckCircle2, OctagonAlert } from 'lucide-react'

export type Tone = 'nominal' | 'caution' | 'critical'

const styles: Record<Tone, { cls: string; Icon: typeof CheckCircle2 }> = {
  nominal: { cls: 'text-nominal border-nominal/50', Icon: CheckCircle2 },
  caution: { cls: 'text-caution border-caution/50', Icon: AlertTriangle },
  critical: { cls: 'text-critical border-critical/60', Icon: OctagonAlert },
}

/** Always icon + text, never color alone (spec 8.3). */
export function StatusPill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const { cls, Icon } = styles[tone]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium ${cls}`}>
      <Icon size={14} aria-hidden /> {children}
    </span>
  )
}
