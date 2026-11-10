# AssetFlow frontend — Laravel integration status

This package is an **integration work-in-progress**, NOT a fully completed production application. It is based on the backend ZIP supplied in this conversation.

## Connected to Laravel routes
- Sanctum session login, `/api/me`, logout (existing implementation; retained).
- GET lists for assets, sites, critical services, users and issues. Assets/issues use backend data rather than localStorage/demo seeds.
- POST assets and sites; PATCH asset status (backend status enum is mapped).
- POST issues; POST issue AI analysis (actual Laravel endpoint, not simulated); PATCH issue manual severity (low/medium/high only).
- Basic error messages for the above actions.

## Not supported by supplied backend routes
- Work order CRUD/assignment/status: no work-order routes in `routes/api.php` in this ZIP, despite sprint foundation files. Frontend creation/status now refuses to fake server success.
- Preventive maintenance endpoints, dashboard statistics, priority settings, audit log endpoints.
- Critical service runtime status: backend stores `criticality`, not `stable/at_risk/down`.
- Team invitation: backend POST `/api/users` requires a password, and does not send invitation emails. UI blocks its old fake success.
- OAuth, password reset and signup workflows: do not treat demo screens as real backend flows.
- UI fields not represented by backend schema (e.g. asset warranty, spare parts, service operational metrics) are placeholders until endpoints exist.

## Running locally
1. Backend: configure your own `.env`, database, migrations and seeding; start Laravel at `http://localhost:8000`.
2. Frontend: `npm ci` then `npm run dev`.
3. Optional: copy `.env.example` to `.env.local` and change `VITE_API_BASE_URL`.
4. Use **localhost** on both ports to allow Sanctum cookies and ensure Laravel's `SANCTUM_STATEFUL_DOMAINS` and CORS allow the Vite port.
5. Login with a real seeded backend user; do not use the legacy demo flows.

## Verification limits
- TypeScript/TSX transpilation syntax checked for edited files.
- Full `npm run build` and browser/Laravel integration tests **not run**: dependencies could not be installed from offline npm cache in this environment.
- Live API calls were not tested against your database or Gemini key.
- Backend was **not changed**.
