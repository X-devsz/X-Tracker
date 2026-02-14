# Cloud Roadmap & API Plan — From Local SQLite to Multi-Device Sync

**Last updated:** 2026-02-10

## 1) When to add cloud (don’t rush)
Add cloud only after:
- MVP is stable (crash-free ≥ 99.5%)
- Core flows have automated tests
- Data model includes sync metadata (see Architecture)

## 2) Cloud goals
- Multi-device access
- Backup/restore
- Optional sharing (later)
- Safe conflict handling
- Strong privacy guarantees

## 3) Cloud architecture options
### Option A: Firebase-first
- Firebase Auth + Firestore
- Pros: fast to ship, lower ops
- Cons: vendor lock, query constraints, costs can spike

### Option B: Backend API + Postgres
- Firebase Auth for identity (verify tokens server-side)
- REST API + Postgres
- Pros: control, portable, stronger analytics
- Cons: more ops and engineering effort

Recommendation:
- If you’re solo and speed matters → **Option A**
- If you expect scale + complex features → **Option B**

## 4) API design principles
- Contract-first (OpenAPI)
- Versioned (`/v1`)
- Consistent error shape with request_id
- Cursor pagination for history
- Idempotency keys for create operations

## 5) Sync approach (practical)
- Client writes locally → marks records PENDING
- Background sync pushes PENDING to server
- Server returns authoritative server_updated_at + version
- Client resolves conflicts by rule and logs it

## 6) Data ownership & access
- Every record must include `owner_user_id`
- Access is deny-by-default:
  - only owner can read/write
  - sharing is explicit and scoped

## 7) Cloud storage for receipts (if used)
- Private bucket by default
- Presigned URLs
- File validation:
  - size, mime type
  - malware scanning if risk warrants
- Retention policy defined

## 8) Rollout plan (safe)
- Phase 2.0: backup/restore only
- Phase 2.1: read-only sync to secondary device
- Phase 2.2: full read/write sync with conflicts
