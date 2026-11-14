import type { DonkiRecord, SepEvent } from './types'

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.length > 0 ? v : undefined)
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const field = (o: unknown, key: string): unknown => (o && typeof o === 'object' ? (o as Record<string, unknown>)[key] : undefined)

/** Returns null when required fields are missing, so a malformed record never reaches the UI. */
export function normalizeSep(rec: DonkiRecord): SepEvent | null {
  const id = str(rec.sepID)
  const eventTime = str(rec.eventTime)
  if (!id || !eventTime) return null

  const linkedEventIds = arr(rec.linkedEvents).map((e) => str(field(e, 'activityID'))).filter((x): x is string => !!x)

  return {
    id,
    eventTime,
    instruments: arr(rec.instruments).map((i) => str(field(i, 'displayName'))).filter((x): x is string => !!x),
    link: str(rec.link),
    linkedEventIds,
    // Derived: IDs observed in the form "<time>-FLR-001" / "<time>-CME-001".
    linkedFlares: linkedEventIds.filter((x) => x.includes('-FLR-')).length,
    linkedCmes: linkedEventIds.filter((x) => x.includes('-CME-')).length,
    alertUrl: str(field(arr(rec.sentNotifications)[0], 'messageURL')),
  }
}