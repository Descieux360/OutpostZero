export type DonkiEndpoint = 'SEP' | 'FLR' | 'CME'

/** Raw DONKI record. Fields are intentionally untyped until we have read real responses. */
export type DonkiRecord = Record<string, unknown>

export interface DonkiSnapshot {
  source: string
  baseUrl?: string
  startDate?: string
  endDate?: string
  fetchedAt: string | null
  endpoints: Record<DonkiEndpoint, DonkiRecord[]>
}
