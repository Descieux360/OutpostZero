import { useRef, type Dispatch } from 'react'
import type { DynamicIncident } from '../domain/events'
import type { MissionAction } from '../features/mission/missionReducer'

interface Props {
  incident: DynamicIncident
  dispatch: Dispatch<MissionAction>
}

export function IncidentModal({ incident, dispatch }: Props) {
  const choiceSubmitted = useRef(false)

  const chooseOption = (choiceId: string) => {
    if (choiceSubmitted.current) return
    choiceSubmitted.current = true
    dispatch({ type: 'RESOLVE_EVENT', choiceId })
    dispatch({ type: 'ADVANCE_DAY' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-vacuum/80 p-4">
      <section
        aria-labelledby="incident-title"
        aria-modal="true"
        className="my-auto w-full max-w-2xl rounded-xl border border-line border-t-4 border-t-critical bg-deck p-5 shadow-2xl sm:p-7"
        role="dialog"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-critical">
          Incident response · Day {incident.day}
        </p>
        <h2 id="incident-title" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {incident.title}
        </h2>
        <p className="mt-1 text-sm font-semibold text-regolith">{incident.subtitle}</p>
        <p className="mt-4 leading-relaxed text-regolith">{incident.description}</p>

        {incident.nasaContext && (
          <aside className="mt-5 rounded-lg border border-caution/50 bg-vacuum p-4">
            <p className="inline-flex rounded-full border border-caution/60 px-3 py-1 text-xs font-bold text-caution">
              Real NASA DONKI satellite record
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-regolith sm:grid-cols-2">
              <div>
                <dt className="text-xs text-regolith/70">Event time</dt>
                <dd><time dateTime={incident.nasaContext.eventTime}>{incident.nasaContext.eventTime}</time></dd>
              </div>
              <div>
                <dt className="text-xs text-regolith/70">Instruments</dt>
                <dd>{incident.nasaContext.instruments.length} recorded</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-regolith/70">Linked events</dt>
                <dd>
                  {incident.nasaContext.linkedFlares} flares · {incident.nasaContext.linkedCmes} CMEs
                </dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-regolith/70">
              {incident.nasaContext.disclaimer}
            </p>
          </aside>
        )}

        <div className="mt-6">
          <h3 className="font-semibold text-white">Choose your response</h3>
          <div className="mt-3 grid gap-3">
            {incident.choices.map((choice) => (
              <button
                key={choice.id}
                className="rounded-lg border border-line bg-vacuum p-4 text-left transition-colors hover:border-nominal focus-visible:border-nominal"
                onClick={() => chooseOption(choice.id)}
                type="button"
              >
                <span className="block font-semibold text-nominal">{choice.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-regolith">{choice.kidDescription}</span>
                <span className="mt-3 block text-sm leading-relaxed text-caution">
                  Trade-off: {choice.tradeoffExplanation}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
