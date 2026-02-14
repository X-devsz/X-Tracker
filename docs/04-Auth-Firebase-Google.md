# Authentication — Firebase Google Sign-In (Best Practice Plan)

**Last updated:** 2026-02-10

## 1) Goals
- Fast sign-in with minimal friction
- Secure session handling
- Safe token storage
- A clean path to multi-device sync later

## 2) Recommended auth modes
### MVP
- Google Sign-In via Firebase Auth (primary)
- Optional: Guest mode (local-only profile)
- Optional: App lock (PIN/biometric) for privacy

### Post-MVP
- Add email/password or magic link only if users demand it.
- Add account deletion / data export flow.

## 3) Implementation guidelines
- Use the official Firebase Auth SDK for the platform.
- Store tokens in **OS secure storage** (Keychain/Keystore).
- Don’t store tokens in SQLite.
- Implement sign-out as:
  - revoke session locally
  - clear caches / local user binding (not expense data unless user requests)

## 4) Session and identity model
- `user_id` from Firebase is the canonical identity.
- In MVP (offline):
  - data belongs to the signed-in user locally
  - switching user requires explicit confirmation

## 5) Threats and controls (minimum)
- Token theft → secure storage + jailbreak/root detection (optional)
- Replay/abuse → rate limit sensitive endpoints (Phase 2) and apply OTP controls only if you add OTP
- Account takeover → Google provider security + optional 2FA in Google

## 6) If you later add OTP login
OTP is unreliable. If you ever add phone OTP:
- enforce cooldown + max attempts
- add provider fallback
- log events without OTP codes
- strict rate limiting

## 7) Account deletion (required by good practice)
- Provide “Delete account” that:
  - removes cloud data (Phase 2+)
  - clears local data after confirmation
  - logs deletion event (no PII)

## 8) Auth test cases
- First sign-in successful
- Sign-in cancelled gracefully
- Token refresh after app restart
- Sign-out clears session and protects data visibility
