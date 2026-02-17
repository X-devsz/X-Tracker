# Ship-Ready APK Plan (Expense Tracker) — Industry-Level Playbook

> Goal: ship a **publicly downloadable APK** that installs on Android devices and behaves like a real product (stable, secure, testable, updateable).

---

## 0) Brutal reality check (read this once)
If you ship an APK without:
- release signing discipline,
- crash reporting,
- a regression test set,
- and a clean update strategy,

you’ll “ship” once… then spend weeks firefighting, losing your signing key, and breaking user data.

---

## 1) Define your release target (so you don’t build the wrong thing)

### 1.1 Distribution choice
You said: “anyone can download and install from an Android device”.

That means **sideload distribution**, not Play Store.

**Recommended simple channels**
- **GitHub Releases** (versioned files, checksums, release notes)
- A **static HTTPS page** (Cloudflare Pages / Netlify / Vercel)
- Optional: **Firebase App Distribution** (great for testers, not “anyone”)

### 1.2 Artifact types (don’t confuse them)
- **APK**: directly installable (your requirement)
- **AAB**: Play Store optimized, not directly installable (use later if you publish to Play)

---

## 2) “Shippable” quality bar (your non-negotiables)

### 2.1 Stability
- Crash reporting configured (must exist before public release)
- No known data-loss bugs
- Handles: no internet, low storage, app killed mid-save

### 2.2 Security & privacy
- Tokens/secrets stored only in OS secure storage
- No sensitive info in logs
- Clear privacy policy (even if simple)

### 2.3 Data integrity
- Amounts stored in minor units (cents) to avoid float bugs
- SQLite migrations tested (fresh install + upgrade path)
- Soft delete (recommended) for undo/recovery

### 2.4 Updateability
- You can release v1.0.1 without breaking v1.0.0 user data
- Same signing key across all releases (mandatory)

---

## 3) Release build pipeline (Expo EAS recommended)

### 3.1 Build profile for APK
In `eas.json`, add a profile that builds an APK:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

Build command:
```bash
eas build -p android --profile preview
```

### 3.2 Signing keys (this is where people ruin their project)
Rules:
- Never ship a debug-signed APK.
- Never lose your keystore (if you do, you can’t ship updates that install over the old app).
- Back up the keystore offline (encrypted) + store in a secure vault.

If you use EAS:
- EAS can generate and manage Android keystores OR you can bring your own.

### 3.3 Sign with modern schemes
For compatibility + integrity:
- sign with v1 + v2 + v3 (max compatibility; v2/v3 protect whole APK, v3 supports key rotation).

---

## 4) Environment discipline (avoid “it works on my phone” releases)

### 4.1 Three environments (minimum)
- `dev`: local
- `staging`: release-like testing
- `prod`: public build

### 4.2 Config rules
- No hard-coded API keys in code.
- Separate Firebase config per environment if you use remote services later.
- Feature flags for risky features.

---

## 5) Testing plan that makes your APK credible

### 5.1 Minimum automated tests (MVP)
**Unit**
- amount parsing/formatting
- monthly totals calculation
- category rename/archival rules

**Integration**
- SQLite repository tests
- migration upgrade test (v1 → v2)

**E2E smoke (device)**
- sign-in success/cancel
- add expense → appears in history + summary
- export CSV works

### 5.2 Manual regression checklist (every release)
- sign-in/sign-out
- add/edit/delete expense
- category rename affects summaries
- filters/search
- export
- theme toggle
- app killed mid-save doesn’t corrupt data

---

## 6) Packaging & distribution (so “anyone can install” safely)

### 6.1 What you publish
For each release, publish:
- `YourApp-vX.Y.Z.apk`
- `SHA-256` checksum file
- Release notes (what changed, known issues)
- Install instructions (short, clear)

### 6.2 Integrity verification (basic but real)
Provide:
- SHA-256 checksum users can verify (power users, auditors)
- Your signing certificate fingerprint (for trust)

### 6.3 User installation steps (sideload)
Your installer will fail unless the user allows installs from that source.

Provide a simple guide:
- Download APK
- Tap file
- If blocked: enable “Install unknown apps” for the browser/file manager used
- Install
- Open

(Keep screenshots in your repo later; people don’t read text.)

---

## 7) Update strategy (how your users get v1.0.1)

Sideload apps do not auto-update like Play Store apps.

Choose one:
1) **In-app update prompt**
   - App checks your “latest version” endpoint
   - If outdated: show update screen → opens download page
2) **No in-app updates** (bad UX)
   - Users discover updates manually
3) **Play Store later**
   - Switch to AAB + store distribution for real updates

Recommendation:
- For public APK distribution: implement (1) with a minimal JSON endpoint:
```json
{
  "latest": "1.0.3",
  "min_supported": "1.0.0",
  "apk_url": "https://example.com/releases/YourApp-1.0.3.apk",
  "notes": "Bug fixes and performance improvements"
}
```

---

## 8) Observability (don’t fly blind)

Minimum:
- Crash reporting (release builds only)
- “app_open”, “expense_created”, “export_triggered”
- Performance: cold start time (basic)

Rules:
- No PII in analytics.
- Allow opt-out if you add analytics.

---

## 9) Release process (repeatable)

### 9.1 Release checklist
- [ ] Version bumped (versionName + versionCode)
- [ ] Release notes written
- [ ] CI green (lint + tests)
- [ ] Migration upgrade tested
- [ ] Crash reporting enabled in release build
- [ ] Manual regression checklist passed
- [ ] APK signed with release key
- [ ] SHA-256 checksum generated
- [ ] APK uploaded to distribution channel (HTTPS)
- [ ] “Latest version” JSON updated
- [ ] Rollback plan: previous APK still available

### 9.2 Post-release monitoring (first 48 hours matters)
- watch crash rate
- watch startup failures
- watch export failures
- fix and cut patch release fast (1.0.1, 1.0.2)

---

## 10) Practical milestone plan (build order)

### Milestone A — Foundation
- SQLite schema + migrations
- Core UI (Home/Add/History)
- Basic summaries
- CI + lint + unit tests

### Milestone B — Release hardening
- Crash reporting
- Regression checklist
- Performance checks
- Security review (storage, logs)

### Milestone C — Public APK shipping
- EAS APK build profile
- Release signing + backups
- Hosted APK + checksums + install guide
- In-app update prompt (recommended)

### Milestone D — Stable release
- Budgets OR recurring expenses (pick one)
- Better insights
- Cleanup tech debt

### Milestone E — Cloud (only after stability)
- Sync metadata
- Conflict strategy
- Multi-device sync

---

## 11) Common failure points (avoid these)
- Shipping debug build by accident
- Losing keystore → cannot update
- Float amounts → totals drift and users lose trust
- No migration tests → upgrades break
- No crash reporting → you don’t know what’s failing
- No update plan → users get stuck on buggy builds

---

## 12) What you should do next (no excuses)
1) Create `eas.json` with an APK profile.
2) Set up signing key strategy (EAS-managed or your own + backups).
3) Add crash reporting before public release.
4) Build and test on:
   - low-end Android
   - older Android versions
   - multiple screen sizes
5) Ship a **v0.1 public APK** with a minimal feature set and fix real bugs.

---

### Appendix: Files to include in your repo
- `/docs/release/RELEASE_CHECKLIST.md`
- `/docs/release/INSTALL_GUIDE.md`
- `/docs/release/SECURITY_NOTES.md`
- `/docs/release/CHANGELOG.md`
