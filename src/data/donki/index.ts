import raw from './donki-snapshot.json'
import { normalizeSep } from './normalize'
import type { DonkiEndpoint, DonkiRecord, DonkiSnapshot, SepEvent } from './types'

/** The game reads ONLY this local file. No network call at runtime (spec 7.2). */
export const donkiSnapshot = raw as unknown as DonkiSnapshot

export const hasDonkiData = donkiSnapshot.fetchedAt !== null

export const getDonkiRecords = (endpoint: DonkiEndpoint): DonkiRecord[] => donkiSnapshot.endpoints[endpoint] ?? []

export const getSepEvents = (): SepEvent[] =>
  getDonkiRecords('SEP')
    .map(normalizeSep)
    .filter((e): e is SepEvent => e !== null)
    .sort((a, b) => a.eventTime.localeCompare(b.eventTime))