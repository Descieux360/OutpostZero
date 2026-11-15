import { ExternalLink, Satellite } from 'lucide-react'
import { donkiSnapshot, getSepEvents, hasDonkiData } from '../data/donki'
import { ClaimBadge } from './ClaimBadge'

const fmt = (t: string) => t.replace('T', ' ').replace('Z', ' UTC')

/** Real past events from the saved DONKI snapshot. Shows no magnitude: the record has none. */
export function RealSpaceWeather() {
  const events = getSepEvents()

  return (
    <section className="mt-10" aria-labelledby="real-weather">
      <h2 id="real-weather" className="flex items-center gap-2 text-2xl font-semibold text-white"><Satellite size={22} aria-hidden /> Real solar particle events</h2>

      {!hasDonkiData || events.length === 0 ? (
        <p className="mt-3 rounded border border-dashed border-line p-3 text-sm text-dust">No saved space-weather events. Run <code>npm run fetch:donki</code> with a date range that contains events.</p>
      ) : (
        <>
          <p className="mt-2 max-w-prose text-sm">
            <ClaimBadge kind="source-fact" /> {events.length} Solar Energetic Particle events recorded in NASA’s DONKI database between {donkiSnapshot.startDate} and {donkiSnapshot.endDate}. Saved on {donkiSnapshot.fetchedAt?.slice(0, 10)}.
          </p>
          <ul className="mt-4 space-y-3">
            {events.map((e) => (
              <li key={e.id} className="rounded-lg border border-line bg-deck p-4 text-sm">
                <p className="font-semibold text-white">{fmt(e.eventTime)}</p>
                <p className="mt-1 text-dust">Detected by: {e.instruments.join('; ') || 'not listed'}</p>
                <p className="mt-1 text-dust">
                  DONKI links this event to {e.linkedFlares} solar flare{e.linkedFlares === 1 ? '' : 's'} and {e.linkedCmes} coronal mass ejection{e.linkedCmes === 1 ? '' : 's'}.
                </p>
                {e.link && (
                  <a href={e.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-nominal underline">
                    View record {e.id} on DONKI <ExternalLink size={12} aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-prose text-xs text-dust">
            DONKI records here have no dose or intensity value, so none is shown. DONKI says its real-time information is prototyping quality, for research context. These are real Earth-region observations, not measurements on the lunar surface.
          </p>
        </>
      )}
    </section>
  )
}