# Security & Privacy — Baseline Controls (Don’t Create a Data Liability)

**Last updated:** 2026-02-10

## 1) Data classification
- Restricted: user identity, email, receipts, any personal notes
- Confidential: spending history (often sensitive)
- Internal: diagnostics logs
- Public: none by default

## 2) Core security controls
- TLS for all network calls (Phase 2+)
- Secrets in OS secure storage (not SQLite)
- Least privilege access to cloud resources
- Strict input validation (mobile + server)
- Secure dependency management (vuln scanning)
- No PII in logs

## 3) Local data protection (MVP)
- SQLite encryption:
  - optional but recommended if storing sensitive notes/receipts
  - if not encrypting DB, at least protect app via device lock + app lock
- App lock (PIN/biometric) recommended for privacy

## 4) Receipt security (if implemented)
- Validate file types + size
- Strip metadata where possible
- Store privately; don’t expose public URLs
- Clear retention policy

## 5) Privacy policy essentials
- What data is stored locally
- What data is uploaded (Phase 2)
- Analytics usage (opt-out recommended)
- Deletion and export process

## 6) Threat model (mini)
### Assets
- Expense history, receipts, account identity
### Threats
- Device theft → local exposure
- Token theft → account compromise
- Malicious upload payloads (Phase 2)
- Data exfiltration via logs/analytics
### Controls
- secure storage, app lock, redaction, least privilege

## 7) Security test cases
- Token not visible in logs
- SQL injection not possible (parameterized queries)
- Export does not leak other user data
- Account switch does not show previous user’s data without confirmation
