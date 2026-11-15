/**
 * Seeded Mulberry32 Pseudo-Random Number Generator.
 * Pure function: takes a 32-bit state integer and returns [nextRandomFloat, nextRngState].
 */
export function nextRandom(rngState: number): [number, number] {
  let z = (rngState + 0x6d2b79f5) | 0;
  z = Math.imul(z ^ (z >>> 15), z | 1);
  z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
  const randomFloat = ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  return [randomFloat, (rngState + 1) | 0];
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 1000000) + 1;
}