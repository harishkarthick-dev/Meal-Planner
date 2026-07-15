# Plately

Plately is a collaborative meal planner for families. Plan meals by day, week, or month,
keep a shared grocery list, and pull nutrition data for any dish. Changes sync in real time
across everyone in the household, and the app installs as an offline-capable PWA.

Live: https://mealplanners.vercel.app

## Features

- Day, week, and month planning views
- Real-time sync so every family member sees updates instantly (Firestore snapshots)
- Family workspaces with an invite/join onboarding flow
- Shared grocery list derived from the week's plan
- Nutrition lookup for a meal name (USDA FoodData Central, with a Google Gemini fallback)
- Installable PWA with offline support
- Light and dark themes
- Completion tracking for planned meals

## Tech stack

- Framework: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS, Radix UI primitives, Framer Motion
- State: Zustand (with persistence)
- Auth & data: Firebase Authentication and Cloud Firestore
- Nutrition/AI: USDA FoodData Central API, Google Gemini (`@google/generative-ai`)
- PWA: `@ducanh2912/next-pwa`
- Testing: Vitest, Testing Library, jsdom
- Tooling: ESLint, Prettier, Husky, lint-staged

## How it works

The front end talks directly to Firebase. Authentication and family membership are handled by
Firebase Auth; meal plans, grocery items, and family data live in Firestore, and the UI
subscribes to Firestore snapshots so an edit from one member shows up immediately for the rest.
Nutrition enrichment queries the USDA API first and falls back to Gemini to interpret
free-text meal names.

## Getting started

Prerequisites: Node.js 20+, a Firebase project, and (optionally) USDA and Gemini API keys.

```bash
git clone https://github.com/HarishKarthickS/Plately.git
cd Plately
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

Open http://localhost:3000.

## Environment variables

Set these in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_USDA_API_KEY=      # https://fdc.nal.usda.gov
NEXT_PUBLIC_GEMINI_API_KEY=    # https://ai.google.dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` / `npm run start` — production build and serve
- `npm run test` / `npm run test:coverage` — run tests
- `npm run lint` / `npm run format` — lint and format
- `npm run verify` — lint, format check, and coverage (run before pushing)

## Testing and quality

Unit and component tests run on Vitest with Testing Library. Husky runs lint-staged on commit,
and `npm run verify` (lint, format check, coverage) is meant to run before a push. Coverage is
around 75%.

## Project structure

```
app/            App Router routes (today, week, meals, calendar, grocery, settings,
                onboarding, dashboard, login)
components/     UI, dashboard, meals, onboarding, layout, and landing components
lib/store/      Zustand stores
lib/services/   Nutrition/AI service
lib/hooks/      Data hooks (auth, meals)
types/          Shared TypeScript types
```

## Deployment

Deployed on Vercel. Set the same environment variables in the Vercel project settings; the
Firebase project handles data and auth across environments.

## License

MIT
