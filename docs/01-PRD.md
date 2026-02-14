# PRD — Expense Tracker (MVP → Stable Release → Cloud)

**Last updated:** 2026-02-10

## 1) Problem statement
People lose track of spending because logging is tedious, categories are inconsistent, and insights arrive too late.
This app makes expense capture **fast**, **reliable**, and **useful** without becoming a finance spreadsheet.

## 2) Target users
- Individual users tracking personal spending
- Users who want quick insights (not accounting-grade complexity)
- Users who prefer a clean UI and offline reliability

## 3) MVP objectives (what “success” means)
- User can sign in and start tracking in under **60 seconds**
- Expense entry takes **< 10 seconds** for a typical entry
- Offline works fully; no data loss
- Weekly/monthly summary is accurate and useful
- Crash-free sessions ≥ **99.5%** (target; measured)

## 4) Scope

### 4.1 MVP scope (Phase 1: Offline-first)
**Auth**
- Google Sign-In via Firebase (primary)
- Guest mode (optional, recommended for faster onboarding)
- Local app lock (PIN/biometric) optional but recommended

**Core expenses**
- Add/edit/delete expense
- Fields:
  - amount (required)
  - date/time (default now)
  - category (required)
  - account/wallet (optional for MVP)
  - note (optional)
  - merchant/payee (optional)
  - payment method (cash/card/etc.) (optional)
- Recurring expenses (optional for MVP; can defer)

**Categories**
- Default categories provided
- User can create/rename/archive categories
- Prevent category explosion: enforce simple naming rules

**Views**
- Home: recent expenses + quick add
- Summary: this month total + category breakdown + trend (basic)
- History: filter by date range/category/search

**Data**
- SQLite local database
- Export:
  - CSV export (MVP)
  - PDF export (post-MVP)

**Settings**
- Currency selection (single currency MVP)
- Theme (light/dark)
- Backup/restore locally (optional, post-MVP)

### 4.2 Post-MVP (Phase 1.5: Stabilization)
- Budgets (monthly per category)
- Recurring expenses (if not included)
- Receipt image attach (stored locally first)
- Improved insights (top categories, anomalies, month-over-month)

### 4.3 Cloud & multi-device (Phase 2)
- Cloud sync + multi-device support
- Conflict resolution rules
- Encrypted backup
- Optional web dashboard
- Shared budgets/household (Phase 3)

## 5) Non-functional requirements (NFRs)
- **Reliability:** no silent data loss; durable writes; safe migrations
- **Performance:**
  - app cold start < 2.5s mid-range device
  - home screen render < 300ms after data load
- **Security:** secure auth, secure token storage, least privilege, minimal PII
- **Privacy:** data minimization, clear analytics policy, deletion support
- **Accessibility:** readable typography, contrast, voiceover labels, large text

## 6) Core user journeys (MVP)
1) **First run → Google Sign-In → Create first expense → See summary**
2) **Add expense quickly from home**
3) **Filter history by month and category**
4) **Export data to CSV**
5) **Edit category name → history and summaries update consistently**

## 7) Data definitions (high-level)
- Expense: amount, date, category_id, note, merchant, payment_method, created_at, updated_at, deleted_at (soft delete)
- Category: name, icon, color_token, archived
- Account (optional MVP): name, type, currency (single currency default)

## 8) Acceptance criteria (MVP examples)
- Adding an expense with amount+category saves successfully offline and appears immediately in history and summary.
- Changing a category name updates all related views without breaking past data.
- Export produces a CSV with stable columns and correct totals.
- If the app is killed during save, the expense is either fully saved or not saved (no partial/ghost state).

## 9) Out of scope (explicitly)
- Bank integrations
- OCR receipt scanning (Phase 3+)
- Full double-entry accounting
- Complex tax reports

## 10) Open decisions (keep minimal)
- Guest mode: include or not (recommended: yes)
- Recurring expenses: MVP vs 1.5
