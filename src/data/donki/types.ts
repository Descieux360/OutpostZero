export type DonkiEndpoint = 'SEP' | 'CME'

/** Raw DONKI record. Fields are untyped here; normalizers read only fields seen in real responses. */
export type DonkiRecord = Record<string, unknown>

export interface DonkiSnapshot {
  source: string
  baseUrl?: string
  startDate?: string
  endDate?: string
  fetchedAt: string | null
  endpoints: Record<DonkiEndpoint, DonkiRecord[]>
  errors?: Partial<Record<DonkiEndpoint, string>>
}

/** A Solar Energetic Particle event, reduced to fields confirmed in a real DONKI SEP record. */
export interface SepEvent {
  id: string
  /** As given by DONKI, e.g. "2025-01-04T21:46Z" (UTC). */
  eventTime: string
  /** Instrument names exactly as DONKI lists them. */
  instruments: string[]
  /** DONKI page for this event. */
  link?: string
  /** IDs of linked events, e.g. "2025-01-04T14:24:00-FLR-001". */
  linkedEventIds: string[]
  /** Derived from the ID text: how many linked IDs are flares and how many are CMEs. */
  linkedFlares: number
  linkedCmes: number
  alertUrl?: string
}