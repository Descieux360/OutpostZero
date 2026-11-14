// Run: npm run fetch:donki   (needs Node 20.6+). Saves a snapshot the game reads offline.
import { writeFile } from 'node:fs/promises'

const base = (process.env.DONKI_BASE_URL ?? 'https://api.nasa.gov/DONKI').replace(/\/$/, '')
const key = process.env.NASA_API_KEY
const startDate = process.env.DONKI_START_DATE
const endDate = process.env.DONKI_END_DATE
if (!startDate || !endDate) throw new Error('Set DONKI_START_DATE and DONKI_END_DATE (yyyy-MM-dd) in .env')

const endpoints = ['SEP', 'CME'] // solar energetic particles, coronal mass ejections // solar energetic particles, solar flares, coronal mass ejections
const snapshot = { source: 'NASA DONKI', baseUrl: base, startDate, endDate, fetchedAt: new Date().toISOString(), endpoints: {}, errors: {} }

for (const ep of endpoints) {
  const params = new URLSearchParams({ startDate, endDate })
  if (base.includes('api.nasa.gov') && key) params.set('api_key', key)
  const shownUrl = `${base}/${ep}?startDate=${startDate}&endDate=${endDate}` // key hidden on purpose
  try {
    const res = await fetch(`${base}/${ep}?${params}`)
    if (!res.ok) {
      const body = (await res.text()).slice(0, 200)
      throw new Error(`HTTP ${res.status} ${res.statusText}. ${body}`)
    }
    const data = await res.json()
    snapshot.endpoints[ep] = Array.isArray(data) ? data : []
    console.log(`${ep}: ${snapshot.endpoints[ep].length} records  (${shownUrl})`)
  } catch (err) {
    snapshot.endpoints[ep] = []
    snapshot.errors[ep] = String(err.message)
    console.warn(`${ep}: FAILED  (${shownUrl})\n   ${err.message}`)
  }
  await new Promise((r) => setTimeout(r, 1000)) // be gentle with rate limits
}

await writeFile('src/data/donki/donki-snapshot.json', JSON.stringify(snapshot, null, 2))
console.log('Saved src/data/donki/donki-snapshot.json. Open it and read a real record before citing any field.')