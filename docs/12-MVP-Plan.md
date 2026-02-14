# MVP Plan — Build Order (Fast, Correct, and Testable)

**Last updated:** 2026-02-10

## The correct build sequence (don’t improvise)
You build this in the wrong order and you’ll rewrite half of it.

## Phase 0 — Setup (1–2 days)
- Repo setup + lint/format + CI
- App skeleton + navigation
- Local secure storage wrapper
- SQLite setup + migration framework

**Exit criteria**
- CI green on every push
- App launches on device
- DB migrations run on fresh install

## Phase 1 — Core MVP (1–2 weeks)
### Step 1: Data model + repositories
- categories + expenses tables
- repository methods:
  - create/update/delete
  - query by date range + category
- unit tests for summary calculations

### Step 2: UI foundations
- design tokens + component library
- home screen with recent list + month total
- add expense screen (keypad + category picker)

### Step 3: History + filters
- history list with filters and empty states
- edit/delete flows

### Step 4: Auth
- Google Sign-In via Firebase
- bind local data to user_id
- account switch confirmation

### Step 5: Export
- CSV export with share/save flow

**Exit criteria**
- Core journeys work offline
- No known data loss bugs
- Smoke tests pass

## Phase 1.5 — Stabilization (1–2 weeks)
- Crash reporting
- Polish UX: undo delete, better error messages
- Add budgets OR recurring (pick one)
- Add basic analytics events (privacy-safe)

**Exit criteria**
- Crash-free sessions trending ≥ 99.5%
- Regression checklist passes

## Phase 2 — Cloud Sync (2–6 weeks, depends on approach)
- Choose backend approach (Firebase vs API+Postgres)
- Add sync worker + conflict handling
- Add encrypted backup
- Add receipt storage (optional)
- Add account deletion end-to-end

**Exit criteria**
- Multi-device correctness verified
- SLOs defined and monitored
- Security review complete
