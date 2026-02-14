# Data Model — SQLite (MVP) + Migration Strategy

**Last updated:** 2026-02-10

## 1) Why SQLite for MVP
- Fast
- Offline
- Minimal operational complexity
- Predictable performance for personal-scale data

## 2) Tables (recommended)

### 2.1 categories
- `id` TEXT (UUID, PK)
- `name` TEXT NOT NULL
- `icon` TEXT NULL
- `color_token` TEXT NULL
- `is_archived` INTEGER NOT NULL DEFAULT 0
- `created_at` INTEGER NOT NULL  (epoch ms)
- `updated_at` INTEGER NOT NULL
- `deleted_at` INTEGER NULL

**Constraints**
- unique index on (name) where deleted_at is null (optional)

### 2.2 expenses
- `id` TEXT (UUID, PK)
- `amount_minor` INTEGER NOT NULL   (store cents to avoid float bugs)
- `currency` TEXT NOT NULL          (single currency MVP but store it anyway)
- `category_id` TEXT NOT NULL       (FK categories.id)
- `occurred_at` INTEGER NOT NULL    (epoch ms; user selected date)
- `note` TEXT NULL
- `merchant` TEXT NULL
- `payment_method` TEXT NULL
- `created_at` INTEGER NOT NULL
- `updated_at` INTEGER NOT NULL
- `deleted_at` INTEGER NULL

**Indexes**
- idx_expenses_occurred_at
- idx_expenses_category_id
- idx_expenses_deleted_at (optional)

### 2.3 accounts (optional MVP)
- `id` TEXT (UUID, PK)
- `name` TEXT NOT NULL
- `type` TEXT NULL (cash/bank/card)
- `created_at`, `updated_at`, `deleted_at`

### 2.4 receipts (post-MVP)
- `id` TEXT (UUID, PK)
- `expense_id` TEXT NOT NULL (FK)
- `local_uri` TEXT NOT NULL
- `mime_type` TEXT NOT NULL
- `size_bytes` INTEGER NOT NULL
- `created_at` INTEGER NOT NULL
- `deleted_at` INTEGER NULL

## 3) Migration strategy (don’t wing it)
- Use versioned migrations:
  - `v1__init.sql`
  - `v2__add_accounts.sql`
  - `v3__add_receipts.sql`
- Every migration:
  - is reversible if possible
  - is tested on a seeded DB
- Never change schema manually in production builds.

## 4) Data integrity rules
- Amount stored as integer minor units (cents).
- Soft delete for anything user-generated (audit + undo potential).
- `updated_at` always updated on edit.

## 5) Rollups (optional)
If you add monthly summaries:
- Either compute on the fly (simpler, OK for small data)
- Or store rollups in a table (faster, more complexity)
MVP recommendation: compute on the fly with indexed queries.
