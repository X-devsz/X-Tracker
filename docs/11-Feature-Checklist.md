# Feature Checklist — MVP → Stable → Cloud

**Last updated:** 2026-02-10

Use this as your Definition of Done. If you can’t tick the box, it’s not done.

## 1) Authentication
### Google Sign-In (Firebase)
- [ ] Works on fresh install
- [ ] Handles cancellation gracefully
- [ ] Handles no-internet gracefully
- [ ] Token stored only in secure storage
- [ ] Sign-out clears session
- [ ] Account switch requires explicit confirmation

### Guest mode (optional)
- [ ] User can start without sign-in
- [ ] Clear upgrade path to account

## 2) Expense CRUD
- [ ] Add expense < 10 seconds typical entry
- [ ] Edit expense updates summaries instantly
- [ ] Delete has undo (recommended)
- [ ] Validation: amount > 0, category required
- [ ] Stores amounts as minor units (no floats)

## 3) Categories
- [ ] Default categories exist on first run
- [ ] Create/rename/archive works
- [ ] Archived categories not shown in picker by default
- [ ] Renaming category updates history + summaries

## 4) Views
### Home
- [ ] Month total correct
- [ ] Recent list correct and fast
- [ ] Quick add reachable in one tap

### History
- [ ] Filter by month/date range
- [ ] Filter by category
- [ ] Search by note/merchant (if supported)
- [ ] Empty state shown correctly

### Insights
- [ ] Category breakdown accurate
- [ ] Trend (month over month) correct

## 5) Export
- [ ] CSV export includes stable columns
- [ ] Export matches totals shown in app
- [ ] Export handles empty dataset gracefully

## 6) Settings
- [ ] Theme toggle stable
- [ ] Currency set (single currency MVP)
- [ ] Privacy controls present (analytics opt-out if used)

## 7) Quality gates
- [ ] Unit tests for domain rules
- [ ] Integration tests for SQLite + migrations
- [ ] E2E smoke tests for core flow
- [ ] Crash reporting configured
- [ ] Release checklist completed

## 8) Cloud sync (Phase 2)
- [ ] Sync metadata present in local model
- [ ] Conflict strategy defined and implemented
- [ ] Multi-device consistency verified
- [ ] Data deletion propagates correctly
- [ ] Security rules reviewed and tested
