# Testing & QA — Release Gates for a Serious App

**Last updated:** 2026-02-10

## 1) Testing pyramid
- Unit tests: domain rules (amount, categories, summaries)
- Integration tests: SQLite repositories, migrations
- E2E tests: critical flows (sign-in, add expense, summary, export)

## 2) MVP minimum test set
### Unit (must-have)
- Amount parsing/formatting
- Summary computation correctness
- Category CRUD behavior
- Soft delete behavior

### Integration (must-have)
- DB migration from v1 → v2 (sample)
- Insert/update/delete expense
- Query expenses by date range/category

### E2E smoke (must-have)
- Google sign-in success path (mockable)
- Add expense → appears in history and summary
- Export CSV produces correct file

## 3) QA process
- Staging build distribution (TestFlight/Internal testing)
- Defect severity:
  - S1 crash/data loss
  - S2 security/privacy issue
  - S3 functional bug
  - S4 UI polish
- Release criteria:
  - 0 open S1/S2
  - S3 allowed only with explicit waiver

## 4) Quality metrics to track
- Crash-free sessions
- ANR rate (Android)
- Defect leakage (prod bugs / total)
- Time to resolution by severity
- p95 screen load time (if measured)

## 5) Regression checklist (MVP)
- Sign-in / sign-out
- Add/edit/delete expense
- Category rename/archive
- Month summary totals correct
- Filters/search correct
- Export works
- Theme toggle stable
