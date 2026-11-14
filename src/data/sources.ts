export type ClaimKind = 'source-fact' | 'derived-value' | 'game-assumption' | 'needs-source'

export interface SourceEntry {
  kind: ClaimKind
  text: string
  citation?: string
}

/** Spec 7.3. No real sources yet: confirm with the mentor and the released challenge resources. */
export const sources: SourceEntry[] = [
  { kind: 'game-assumption', text: 'All resource quantities, rates, thresholds and the incident schedule are simplified game values.' },
  { kind: 'game-assumption', text: 'Dashboard numbers come from a mock scenario until it is playtested.' },
]
