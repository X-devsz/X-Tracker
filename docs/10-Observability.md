# Monitoring & Observability — So You Can Fix Issues Fast

**Last updated:** 2026-02-10

## 1) What to capture (MVP)
- Crash reporting (mobile)
- App lifecycle events (open, background)
- Key actions:
  - expense_created, expense_updated, export_triggered
- Performance:
  - cold start time
  - screen render durations (basic)

## 2) Logging rules
- Structured logs (event-based)
- No tokens
- No receipts
- No full notes content (if it can contain personal info)

## 3) Metrics (targets you can actually track)
- Crash-free sessions ≥ 99.5%
- Export success rate ≥ 99%
- DB write failure rate ~ 0 (track errors)

## 4) Phase 2 monitoring (cloud)
- API p95 latency
- error rate by endpoint
- auth failures
- sync conflicts rate
- job failures (if any background workers)

## 5) Runbooks
Every alert must have:
- meaning
- how to verify
- mitigations
- rollback steps
