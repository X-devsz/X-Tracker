# Build, Release & Ship — Expense Tracker APK Guide

**Last updated:** 2026-02-22
**Build system:** Expo SDK 54 + EAS Build
**Package:** `com.ifham.expensetracker`
**EAS Project ID:** `78e952fc-6b81-4273-9e59-0bb7720124dc`

---

## 1) Project Identity & Configuration

### 1.1 App Metadata (`app.json`)

| Field | Value |
|---|---|
| **App Name** | `expense-tracker` |
| **Slug** | `expense-tracker` |
| **Version** | `1.0.0` |
| **Orientation** | Portrait |
| **Scheme** | `expensetracker` (deep linking) |
| **New Architecture** | Enabled |
| **Android Package** | `com.ifham.expensetracker` |
| **iOS Bundle ID** | `com.ifham.expensetracker` |

### 1.2 Android-Specific Config

```json
"android": {
  "package": "com.ifham.expensetracker",
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#ffffff"
  },
  "googleServicesFile": "./google-services.json",
  "edgeToEdgeEnabled": true,
  "permissions": ["android.permission.INTERNET"]
}
```

### 1.3 Required Assets

| File | Purpose | Location |
|---|---|---|
| `icon.png` | App icon (1024×1024) | `./assets/icon.png` |
| `adaptive-icon.png` | Android adaptive icon foreground | `./assets/adaptive-icon.png` |
| `splash-icon.png` | Splash screen logo | `./assets/splash-icon.png` |
| `favicon.png` | Web favicon | `./assets/favicon.png` |
| `google-services.json` | Firebase Android config | `./google-services.json` |

> [!CAUTION]
> `google-services.json` must exist in the project root for Firebase to work. This file is **gitignored** and must be downloaded from the Firebase Console for each environment.

### 1.4 Expo Plugins

```json
"plugins": [
  ["expo-router", { "root": "src/app" }],
  "@react-native-google-signin/google-signin",
  "expo-sqlite",
  "expo-web-browser",
  "expo-secure-store"
]
```

---

## 2) Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Expo SDK | 54.0.33 |
| **Runtime** | React Native | 0.81.5 |
| **Language** | TypeScript | 5.9.2 |
| **UI System** | Tamagui | 1.144.3 |
| **Navigation** | Expo Router | 6.0.23 |
| **Database** | expo-sqlite + Drizzle ORM | 16.0.10 / 0.45.1 |
| **State** | Zustand | 5.0.11 |
| **Auth** | Firebase + Google Sign-In | 12.9.0 |
| **Charts** | react-native-gifted-charts | 1.4.74 |
| **Animations** | react-native-reanimated | 4.1.1 |
| **Haptics** | expo-haptics | 15.0.8 |
| **Export** | xlsx-js-style + expo-sharing | — |

### Key Libraries Count
- **27** `@tamagui/*` packages (core + UI components)
- **19** `expo-*` packages
- **7** `react-native-*` packages
- **84** total dependencies

---

## 3) EAS Build Profiles (`eas.json`)

### Current Configuration

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Profile Purposes

| Profile | Output | Use For |
|---|---|---|
| `development` | `.apk` (debug) | Day-to-day dev testing on device |
| `preview` | `.aab` (internal) | QA / staging / team testing |
| `production` | `.aab` (signed) | Play Store submission |

> [!IMPORTANT]
> The `development` profile already produces an **APK** (`"buildType": "apk"`). For a **shippable public APK**, add a dedicated `preview-apk` profile (Section 4).

---

## 4) Building a Shippable APK

### 4.1 Prerequisites

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to Expo account
eas login

# 3. Verify project link
eas whoami
eas project:info
```

### 4.2 Add APK Release Profile to `eas.json`

Add this profile for a **release-signed APK** (not debug):

```json
{
  "build": {
    "preview-apk": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_AUTH_ENABLED": "false"
      }
    }
  }
}
```

### 4.3 Build the APK

```bash
# Build release APK
eas build --profile preview-apk --platform android

# Or use the existing development profile (includes dev client)
eas build --profile development --platform android
```

### 4.4 Download the APK

After the build completes:

```bash
# Option 1: Download from the EAS dashboard URL shown in terminal
# Option 2: Use CLI
eas build:list --platform android --limit 1
```

The APK URL will be printed. Download it directly or share the link.

### 4.5 Version Bumping

Before each release, update `app.json`:

```json
{
  "expo": {
    "version": "1.1.0"  // ← Bump this
  }
}
```

For the `production` profile, `versionCode` auto-increments via `"autoIncrement": true`.

---

## 5) Signing Strategy

### 5.1 EAS-Managed Signing (Recommended)

EAS Build automatically manages Android keystores:
- First build → EAS generates a keystore and stores it securely
- Subsequent builds → same keystore is reused
- **You never lose the key** (EAS backs it up)

### 5.2 Download Your Keystore (Backup)

```bash
# Download the keystore EAS created for your project
eas credentials --platform android

# Select: Android Keystore → Download
```

> [!WARNING]
> **Always back up your keystore.** If you lose it and leave EAS, you cannot push updates to existing installations. Store the backup in an encrypted vault (e.g., 1Password, Bitwarden, or an offline USB).

### 5.3 Custom Keystore (Advanced)

If you want to use your own keystore:

```bash
# Generate a keystore
keytool -genkeypair -v \
  -keystore expense-tracker.jks \
  -alias expense-tracker \
  -keyalg RSA -keysize 2048 \
  -validity 10000

# Upload to EAS
eas credentials --platform android
# Select: Android Keystore → Upload your own
```

---

## 6) Pre-Release Checklist

### 6.1 Code Quality

```bash
# Type checking
npx tsc --noEmit

# Linting
npx eslint . --ext .ts,.tsx

# Format check
npx prettier --check "src/**/*.{ts,tsx}"

# Security audit
npm audit --production --audit-level=high
```

### 6.2 Functionality Testing

- [ ] **Expense CRUD** — Add, edit, delete expense works end-to-end
- [ ] **Categories** — Create, rename, archive, restore, reorder
- [ ] **Home screen** — Monthly summary displays correct totals
- [ ] **History** — Filters (date range, categories, search, sort) work
- [ ] **Insights** — Charts render with correct data
- [ ] **Settings** — Theme toggle (light ↔ dark ↔ system), currency switch
- [ ] **Export** — XLSX export generates and shares correctly
- [ ] **Auth flow** — Sign in / sign out / switch account (if enabled)
- [ ] **Empty states** — All screens show proper empty state UI
- [ ] **Error states** — Network/DB errors handled gracefully
- [ ] **Toast notifications** — Success/error toasts appear and dismiss
- [ ] **AlertDialogs** — Confirmation dialogs render with theme

### 6.3 Device Testing

- [ ] Tested on Android 10+ (API 29+)
- [ ] Tested on mid-range device (not just emulator)
- [ ] Tested on small screen (5") and large screen (6.7"+)
- [ ] Dark mode renders correctly
- [ ] Light mode renders correctly
- [ ] App survives being killed and reopened (data persists)
- [ ] App handles low storage gracefully

### 6.4 Performance

- [ ] Cold start < 3 seconds on mid-range device
- [ ] List scrolling smooth (no jank on 100+ expenses)
- [ ] No memory leaks (check with Flipper or Perf Monitor)

---

## 7) Database & Migration Safety

### 7.1 Schema Location

```
src/db/schema.ts     — Drizzle ORM table definitions
src/db/client.ts     — SQLite client + migration runner
src/db/seed.ts       — Default category seeder
drizzle/             — Generated migration SQL files
```

### 7.2 Migration Commands

```bash
# After schema changes, generate migration
npx drizzle-kit generate

# Verify generated SQL
npx drizzle-kit up

# Inspect DB in browser
npx drizzle-kit studio
```

### 7.3 Critical Rules

- **Never** modify an existing migration file after it has shipped
- **Always** test migration on a fresh install AND an upgrade from the previous version
- Amounts stored as **integer cents** (`amountMinor`) — no floating point
- All records use **UUID** primary keys
- Soft deletes via `deletedAt` timestamp (not hard deletes)

---

## 8) Environment Configuration

### 8.1 Environment Files

```
.env.example          ← Template (committed to git)
.env.local            ← Local dev (gitignored)
```

### 8.2 Feature Flags

```bash
# In .env.local
EXPO_PUBLIC_AUTH_ENABLED=false    # Toggle Firebase auth screens
```

### 8.3 Firebase Setup

1. Download `google-services.json` from [Firebase Console](https://console.firebase.google.com/)
2. Place in project root: `./google-services.json`
3. For iOS: download `GoogleService-Info.plist` → `./GoogleService-Info.plist`
4. Both files are **gitignored** — never commit them

### 8.4 EAS Secrets (for CI builds)

```bash
eas secret:create --name FIREBASE_API_KEY --value "your-key"
eas secret:create --name FIREBASE_PROJECT_ID --value "your-project"
eas secret:list
```

---

## 9) Distribution Strategy

### 9.1 Sideload Distribution (Current)

For direct APK distribution:

1. Build APK → `eas build --profile preview-apk --platform android`
2. Download the `.apk` from the EAS dashboard
3. Rename to `ExpenseTracker-v1.0.0.apk`
4. Generate checksum: `certutil -hashfile ExpenseTracker-v1.0.0.apk SHA256`
5. Distribute via:
   - **GitHub Releases** (recommended) — versioned artifacts + release notes
   - **Direct HTTPS link** — hosted on Cloudflare Pages / Vercel
   - **Firebase App Distribution** — for internal testers

### 9.2 Installation Guide (for Users)

```
1. Download ExpenseTracker-v{X.Y.Z}.apk
2. Tap the downloaded file
3. If prompted, enable "Install from unknown sources" for your browser
4. Tap Install
5. Open the app
```

### 9.3 Play Store Distribution (Future)

```bash
# Build AAB (Play Store format)
eas build --profile production --platform android

# Submit to Play Store
eas submit --profile production --platform android
```

Requires:
- Google Play Developer account ($25 one-time)
- App store listing (screenshots, description, privacy policy)
- Content rating questionnaire

---

## 10) CI/CD Pipeline

### 10.1 Pull Request Checks

```yaml
# .github/workflows/pr-check.yml
name: PR Quality Checks
on:
  pull_request:
    branches: [main, develop]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint . --ext .ts,.tsx
      - run: npx prettier --check "src/**/*.{ts,tsx}"
      - run: npm audit --production --audit-level=high
```

### 10.2 Build on Merge

```yaml
# .github/workflows/build.yml
name: Build & Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npm ci
      - run: eas build --profile preview-apk --platform android --non-interactive
```

---

## 11) Release Process (Step-by-Step)

### 11.1 Prepare Release

```bash
# 1. Ensure clean working tree
git status

# 2. Run all quality checks
npx tsc --noEmit && npx eslint . --ext .ts,.tsx && npx prettier --check "src/**/*.{ts,tsx}"

# 3. Bump version in app.json
# Edit: "version": "1.1.0"

# 4. Commit version bump
git add app.json
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main --tags
```

### 11.2 Build APK

```bash
# Build the release APK
eas build --profile preview-apk --platform android

# Wait for build to complete (typically 10-20 minutes)
# EAS will display a download URL when done
```

### 11.3 Test the APK

```bash
# Install on physical device via ADB
adb install ExpenseTracker-v1.1.0.apk

# Or transfer the APK to device and install manually
```

### 11.4 Publish Release

1. Create GitHub Release with tag `v1.1.0`
2. Upload `ExpenseTracker-v1.1.0.apk`
3. Add SHA-256 checksum
4. Write release notes (features, fixes, known issues)

### 11.5 Post-Release

- Monitor crash reports (first 48 hours)
- Check user feedback
- Prepare hotfix if critical issues found

---

## 12) Appendix: Build Commands Quick Reference

| Action | Command |
|---|---|
| **Start dev server** | `npx expo start` |
| **Dev build (APK)** | `eas build --profile development --platform android` |
| **Release APK** | `eas build --profile preview-apk --platform android` |
| **Production AAB** | `eas build --profile production --platform android` |
| **Submit to Play Store** | `eas submit --profile production --platform android` |
| **Type check** | `npx tsc --noEmit` |
| **Lint** | `npx eslint . --ext .ts,.tsx` |
| **Format** | `npx prettier --write "src/**/*.{ts,tsx}"` |
| **Generate migration** | `npx drizzle-kit generate` |
| **View credentials** | `eas credentials --platform android` |
| **List builds** | `eas build:list --platform android` |
| **Prebuild native** | `npx expo prebuild --clean` |
| **Run on device** | `npx expo run:android` |

---

## 13) Related Documentation

| Doc | Purpose |
|---|---|
| [00-README.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/00-README.md) | Project overview |
| [01-PRD.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/01-PRD.md) | Product requirements |
| [14-Tech-Stack-Setup.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/14-Tech-Stack-Setup.md) | Stack installation guide |
| [20-Development-Workflow.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/20-Development-Workflow.md) | Dev commands, CI/CD, Git workflow |
| [ExpenseTracker_Shippable_APK_Plan.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/ExpenseTracker_Shippable_APK_Plan.md) | Strategic shipping playbook |
| [ReactNative_ExpenseTracker_Stack_and_Libraries.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/ReactNative_ExpenseTracker_Stack_and_Libraries.md) | Full stack & library guide |
| [AGENTS.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/AGENTS.md) | AI agent conventions |
