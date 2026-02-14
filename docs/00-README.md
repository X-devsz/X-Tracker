# Expense Tracker — Project Docs (Reusable, Best-Practice Aligned)

**Doc pack version:** 2026-02-10  
**Goal:** A clean, modern expense tracker with a fast MVP (offline-first) and a clear upgrade path to cloud sync.

## What you get in this doc pack
- Product requirements (MVP + post-MVP)
- Architecture blueprint (offline-first → cloud-ready)
- Firebase Google Auth plan (secure, minimal friction)
- SQLite data model + migrations strategy
- UI/UX system guidance (modern, accessible, consistent)
- Security & privacy baseline (PII, receipts, analytics, storage)
- Testing strategy + release gates
- CI/CD and deployment guidance
- Observability (logs/metrics/crash reporting)
- Feature checklist (Definition of Done + acceptance criteria)

## Recommended repo structure
```text
/docs
  00-README.md
  01-PRD.md
  02-Architecture.md
  03-DataModel-SQLite.md
  04-Auth-Firebase-Google.md
  05-UI-UX-Guidelines.md
  06-Cloud-Roadmap-API.md
  07-Testing-QA.md
  08-Security-Privacy.md
  09-DevOps-CICD.md
  10-Observability.md
  11-Feature-Checklist.md
  12-MVP-Plan.md
```

## Brutal truth (so you don’t waste months)
If you try to ship “cloud + fancy analytics + budgets + multi-currency + receipts OCR + sharing” on day one, you’ll stall.
The correct move is:
1) **Offline-first MVP** with SQLite and a tight scope.
2) Stabilize with tests + crash reporting.
3) Add cloud sync with a deliberate data model and conflict rules.

## Key decisions (defaults you can override)
- **MVP storage:** SQLite (local) + encrypted secrets store
- **Auth:** Firebase Google Sign-In (plus email/password optional later)
- **Phase 2:** Cloud sync + multi-device + backup/restore
- **Non-negotiables:** input validation, sane error handling, privacy-by-design, test gates, release checklist

Next: read **01-PRD.md** and **12-MVP-Plan.md** first.
