# AssetFlow integration handoff (2026-11-10)

This is an improved **frontend-only** integration package, not a fully integrated production release.

## Improvements in this package
- Removed the Header demo-persona switcher, which previously allowed selecting another user's identity in the UI.
- Header sign-out now POSTs `/logout` and clears frontend session state only after server success.
- Added a 15-second timeout to API requests so indefinitely pending issue requests fail visibly instead of hanging forever.
- Preventive checklist and priority weight settings no longer claim server persistence when no backend endpoint exists.
- Removed a stale preselected issue ID.

## Verified by static inspection
- Laravel `routes/api.php` provides auth-protected assets, sites, services, users, issues, AI analysis and severity endpoints.
- It does not expose Work Order CRUD, Preventive Maintenance, Dashboard metrics, priority-weight persistence, or audit-log APIs.
- Frontend TypeScript/TSX syntax was transpiled/checked; see accompanying notes.

## Not verified
- Full `npm run build`: dependencies not present and npm offline cache is incomplete.
- Browser, Laravel, DB, Gemini, and end-to-end tests: require running servers and credentials on your machine.

## Run locally
1. Backend: `composer install`, configure `.env` and database, `php artisan serve --host=localhost --port=8000`.
2. Frontend: `npm ci`, `npm run dev`; open `http://localhost:3000`.
3. Confirm Network requests for `me`, `assets`, `sites`, `services`, `users`, `issues`; test create/update, permissions, and logout.
4. If issues timeout, inspect Laravel `storage/logs/laravel.log`, server terminal, and Network response; timeout is a symptom guard, not a backend fix.

## Backend team blockers
Implement and document routes for work orders, preventive plans/checklists, dashboard aggregate stats, priority settings and audit logs. Add proper authorization policies and tests. Frontend cannot persist these without a server contract. Keep demo-only modules clearly labeled until connected.

## Follow-up hardening (same day)
- Fixed request timeout when a caller supplies an AbortSignal (both cancellation and 15-second timeout now work).
- Manual issue severity now changes the UI only after Laravel PATCH succeeds and the issue is re-fetched; removed the misleading optimistic success notification.
- Removed the preselected demo asset and seeded audit trail from the initial authenticated state.
- These changes were reviewed statically; **not** browser-tested against the running Laravel instance.

## Local acceptance checklist (test with your running backend)
- [ ] Login, refresh, logout and refresh again.
- [ ] Assets list loads; create asset; update status; reload to verify persistence.
- [ ] Sites list loads; create site; reload to verify persistence.
- [ ] Services and users lists load without mocked entries.
- [ ] Issues list finishes or shows a timeout error; create issue; reload to verify persistence.
- [ ] Analyze issue; verify response/error and refreshed issue state.
- [ ] Update issue severity; verify saved value after reload; simulate failure to confirm no false success.
- [ ] Confirm technician permissions are enforced by Laravel, not only hidden UI buttons.
- [ ] Check mobile layouts, loading/empty/error states, and browser console.
