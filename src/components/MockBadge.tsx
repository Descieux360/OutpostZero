import { FlaskConical } from 'lucide-react'

/** Marks any value that is mock data or a placeholder (spec 7.3). */
export function MockBadge({ label = 'Mock data' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-dashed border-caution/60 px-1.5 py-0.5 text-xs text-caution">
      <FlaskConical size={12} aria-hidden /> {label}
    </span>
  )
}
