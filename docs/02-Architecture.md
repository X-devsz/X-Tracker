# Architecture — Offline-First MVP → Cloud-Ready Design

**Last updated:** 2026-02-10

## 1) Principles (stop future pain)
- Offline-first: local is source of truth in MVP.
- Cloud-ready: add sync later without rewriting everything.
- Clear boundaries: UI ↔ Domain ↔ Data.
- Observability: every critical action emits logs + metrics events.
- Security-by-default: secrets protected, least privilege.

## 2) High-level components

### 2.1 Mobile app layers
- **UI layer**
  - Screens, components, navigation
  - Form validation and user feedback
- **Domain layer**
  - Use-cases: AddExpense, UpdateExpense, GetMonthlySummary, ExportCSV
  - Business rules: category required, amount > 0, rounding rules
- **Data layer**
  - Repositories: ExpensesRepo, CategoriesRepo
  - Local DB (SQLite)
  - Optional: SyncAdapter (Phase 2)

### 2.2 External services (Phase 2+)
- Firebase Auth (already in MVP)
- Cloud DB (Firestore/Postgres via API) — choose later
- Object storage for receipt images (optional)
- Analytics / crash reporting (privacy-aware)

## 3) Data flow (MVP)
UI → Use-case → Repository → SQLite  
Use-case returns domain models → UI updates state.

**Rule:** UI never writes SQL. Repository owns persistence.

## 4) Cloud sync strategy (Phase 2)
### 4.1 Local-first with sync metadata
Add these fields early to avoid painful migrations:
- `client_id` (device identifier)
- `version` (increment per change)
- `updated_at` (client timestamp)
- `server_updated_at` (null in MVP)
- `sync_state` (LOCAL_ONLY / PENDING / SYNCED / CONFLICT)
- `deleted_at` (soft delete)

### 4.2 Conflict resolution (define before you build sync)
Pick one:
- Last write wins (simple, but can lose intent)
- Field-level merge (harder, better)
- “Ask user” conflict UI (best UX, more work)

Default recommendation for this app:
- **Last write wins** for edits,
- but for deletes vs edits: **delete wins** unless user restores.

## 5) Background jobs (mobile + cloud)
- Monthly rollups (optional)
- Reminders for budgets (post-MVP)
- Sync worker (Phase 2)
All background tasks must be:
- idempotent
- logged
- safely cancellable

## 6) Decision records (ADRs)
Store in `/docs/adr/`:
- ADR: Google Auth only vs add email/password
- ADR: SQLite schema strategy and migrations
- ADR: Sync conflict strategy
- ADR: Receipt storage and encryption

## 7) Security boundaries
- Tokens stored in OS secure storage
- SQLite optionally encrypted (see Security doc)
- Sensitive logs redacted
