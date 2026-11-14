import raw from './donki-snapshot.json'
import type { DonkiEndpoint, DonkiRecord, DonkiSnapshot } from './types'

/** The game reads ONLY this local file. No network call at runtime (spec 7.2). */
export const donkiSnapshot = raw as unknown as DonkiSnapshot

export const hasDonkiData = donkiSnapshot.fetchedAt !== null

export const getDonkiRecords = (endpoint: DonkiEndpoint): DonkiRecord[] => donkiSnapshot.endpoints[endpoint] ?? []
