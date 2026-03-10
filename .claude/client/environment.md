# Environment Variables

## Base `.env` (shared across all modes)
- `VITE_REACT_APP_FIREBASE_*` — Firebase config (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID)

## Per-mode `.env.{mode}` files
Modes: `dev_stripe_test`, `dev_stripe_live`, `prod_stripe_test`, `prod_stripe_live`
- `VITE_API_URL` — API base URL
- `VITE_IO_SERVER` — Socket.io server URL
- `VITE_REACT_APP_STRIPE_PUBLIC_KEY` — Stripe publishable key

## Code Style
No Prettier; single quotes; ESLint 9 with TypeScript-ESLint (`no-explicit-any` OFF, `react-hooks/recommended` ON).

## Session Storage Keys
- `potasio` — JWT auth token
- `theme` — User's theme preference
- `user_type` — EMPLOYER, EMPLOYEE, or admin flag
