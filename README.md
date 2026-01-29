# World Cup 2026 Predictor

A mobile-first prediction app for the FIFA World Cup 2026. Make ante-post selections across the full tournament—group stage through to the final—view fixtures and standings, and track your points.

Built with [Expo](https://expo.dev), [React Native](https://reactnative.dev), and [Supabase](https://supabase.com).

---

## Features

- **Ante Post predictions**  
  Predict outcomes before the tournament starts:
  - **Group stage** — Group standings and match results  
  - **Round of 32** — Knockout matches from third-place qualifiers  
  - **Round of 16, Quarter-finals, Semi-finals** — Standard knockout progression  
  - **Bronze Final** (3rd-place play-off) and **Final**  
  Follows the [FIFA 2026 structure](https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026).

- **Ante Post navigation**  
  Central hub to move between stages. Locked stages are view-only; in-progress stages show completion counts. Once the final is submitted, all ante-post selections are locked and stored in the database.

- **Home dashboard**  
  - **Your Predictions** — Ante Post tab with compact group tables (W, D, L, Pts) and a Live tab (coming soon)  
  - **Points** — Ante, Live, and Total in separate containers  
  - **Upcoming games** — Next fixtures in card format (home vs away, date, venue)  
  - **Current standings** — Group standings from played fixtures  

- **Fixtures & results**  
  Browse tournament fixtures and results.

- **Authentication**  
  Sign up and log in. User profiles and predictions are stored in Supabase; ante-post lock status is synced and cached locally (AsyncStorage).

- **Responsive layout**  
  Scaling and layout adjustments for smaller devices (e.g. ~5.1" screens).

---

## Tech stack

- **Expo** (SDK 54) — development, build, and tooling  
- **Expo Router** — file-based routing  
- **React Native** — UI  
- **Supabase** — auth, Postgres database, and API  
- **AsyncStorage** — local caching of predictions and lock status  

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/go) on your device, or an iOS simulator / Android emulator

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Supabase** (if you use your own project)

   The app reads `expo.extra.supabaseUrl` and `expo.extra.supabaseKey` from `app.json`. Update these to your Supabase project URL and anon key, or use the existing config for the default backend.

3. **Start the app**

   ```bash
   npx expo start
   ```

   Then:

   - Scan the QR code with Expo Go (Android) or the Camera app (iOS), or  
   - Press `i` for iOS simulator or `a` for Android emulator  

---

## Project structure

```
app/
  (tabs)/           # Tab screens: Home, Fixtures, Predictions, etc.
  ante-post-*.tsx   # Ante-post navigation, selections, stage screens
  round-of-*.tsx    # R32/R16 results & predictions
  quarter-finals-*  # QF results & predictions
  semi-finals-*     # SF results & predictions
  bronze-final-*    # Bronze final predictions
  final-predictions # Final & publish flow
  login, signup     # Auth
components/         # Shared UI (e.g. AppHeader, CountryFlag)
services/           # Fixtures, predictions, knockout bracket, etc.
database/           # SQL schema, seeds, migrations
```

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Start with Android |
| `npm run ios` | Start with iOS |
| `npm run web` | Start for web |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Move starter code to `app-example` and create a blank `app` (Expo default) |

---

## License

Private. All rights reserved.
