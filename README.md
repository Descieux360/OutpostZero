# Outpost Zero

Browser-based lunar outpost simulator (NASA Space Apps Challenge 2026, Yaoundé).
Educational prototype. All game quantities are mock game units, not NASA values.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## NASA DONKI snapshot (optional)
```bash
cp .env.example .env     # add your NASA_API_KEY and date range
npm run fetch:donki      # saves src/data/donki/donki-snapshot.json
```
The game reads only the saved file and never calls an API at runtime.

## Deploy
`vercel.json` rewrites all routes to `index.html`. On Netlify add `public/_redirects`: `/*  /index.html  200`.
