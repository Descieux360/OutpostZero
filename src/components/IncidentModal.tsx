import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ClipboardList, Scale, Satellite, Siren } from 'lucide-react'
import type { DynamicIncident } from '../data/eventsData'

interface IncidentModalProps {
  incident: DynamicIncident
  onResolveChoice: (choiceId: string) => void
}

export function IncidentModal({ incident, onResolveChoice }: IncidentModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <section
        aria-labelledby="incident-title"
        aria-modal="true"
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl border-2 border-[var(--color-line)] bg-[var(--color-deck)] p-5 text-[var(--color-regolith)] shadow-2xl sm:p-6"
        role="dialog"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-action)] px-3 py-1 text-xs font-black uppercase text-white">
            {incident.isScripted ? (
              <>
                <Siren className="h-3.5 w-3.5" aria-hidden /> Mission alert
              </>
            ) : (
              <>
                <ClipboardList className="h-3.5 w-3.5" aria-hidden /> Event
              </>
            )}
          </span>
          <span className="text-xs font-bold text-[var(--color-dust)]">Day {incident.day} of 30</span>
        </div>

        <h2 id="incident-title" className="break-words text-2xl font-black text-white">
          {incident.title}
        </h2>
        <p className="mb-4 mt-1 break-words text-sm font-bold text-[var(--color-dust)]">{incident.subtitle}</p>

        <p className="mb-4 break-words rounded-2xl border-2 border-[var(--color-line)] bg-[var(--color-deck-raised)] p-4 text-base font-semibold leading-relaxed text-slate-200">
          {incident.description}
        </p>

        {incident.nasaContext && (
          <aside className="mb-5 break-words rounded-2xl border-2 border-blue-500/40 bg-blue-950/80 p-4 text-xs text-blue-100">
            <h3 className="flex items-center gap-1.5 font-black text-blue-300">
              <Satellite className="h-4 w-4 text-blue-400" aria-hidden />
              NASA DONKI satellite record
            </h3>
            <dl className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              <div>
                <dt className="inline font-bold">Date: </dt>
                <dd className="inline">{incident.nasaContext.eventTime}</dd>
              </div>
              <div>
                <dt className="inline font-bold">Instruments: </dt>
                <dd className="inline">{incident.nasaContext.instruments.length} recorded</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="inline font-bold">Linked events: </dt>
                <dd className="inline">
                  {incident.nasaContext.linkedFlares} flares · {incident.nasaContext.linkedCmes} CMEs
                </dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-blue-500/30 pt-3 text-[11px] italic leading-relaxed text-blue-200/80">
              {incident.nasaContext.disclaimer}
            </p>
          </aside>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-black text-white">Choose your response</h3>
          {incident.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onResolveChoice(choice.id)}
              className="btn-chunky w-full break-words rounded-2xl border-2 border-[var(--color-line)] bg-slate-800 p-4 text-left text-white transition hover:border-[var(--color-action)] hover:bg-slate-700"
            >
              <span className="block font-black text-base text-white">{choice.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-relaxed text-slate-300">{choice.kidDescription}</span>
              <span className="mt-2 flex items-start gap-1 text-xs font-bold leading-relaxed text-amber-400">
                <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>Trade-off: {choice.tradeoffExplanation}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>,
    document.body,
  )
}
