# Architecture

**Path Alias:** `@/*` maps to `./src/*`

**State Management:** `deepsignal`-based. See `state-management.md`.

**API Layer:** All HTTP via `FetchApi` (`api/FetchApi.ts`):
- Base URL from `VITE_API_URL`; auto-attaches `x-access-token` from sessionStorage (`potasio`)
- No encryption — plain JSON. JWT token refreshed on each response via `auth.token`
- Endpoints with `form` in path return Blob (PDF). Response: `{ success, data, auth, status, dataCount? }`
- Pattern: `const r = await FetchApi('v1/endpoint','POST',data); if(r.success) await this.entityGetData(); else throw r;`

**Organization:**
- `view/` — Page components by feature (calendar, client, employee, reservation, etc.)
- `components/` — Reusable components
- `ezMantine/` — Custom Mantine wrappers
