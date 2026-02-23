# 💰 Expense Tracker

A modern, offline-first personal expense tracker built with **React Native** and **Expo**. Features a beautiful design system powered by **Tamagui**, local-first storage with **SQLite + Drizzle ORM**, and a full suite of analytics, category management, and export capabilities.

> **Status:** MVP Complete · 124/151 features shipped · v1.0.0

---

## ✨ Features

### Core
- **Expense CRUD** — Add, edit, and delete expenses with category, date, merchant, notes, and payment method
- **Category Management** — Create, rename, archive, restore, and reorder custom categories with icons and colors
- **Monthly Dashboard** — At-a-glance summary of total spending, transaction count, and recent expenses
- **Expense History** — Full history with date range filters, category filters, search, and sort order
- **Insights & Analytics** — Category breakdown (pie chart) and spending trend (line chart) powered by `react-native-gifted-charts`
- **Excel Export** — Styled `.xlsx` export with share sheet integration via `expo-sharing`

### UX Polish
- **Swipe Actions** — Swipe left to delete, swipe right to edit in History
- **Undo Delete** — 5-second snackbar with restore action after soft delete
- **Pull-to-Refresh** — Home and History screens
- **Haptic Feedback** — On add, delete, category select, and navigation
- **Loading Skeletons** — On all data-driven screens
- **Empty States** — Meaningful messages with CTAs across all screens
- **Error States** — Retry-enabled error cards on data failures
- **Themed Toasts** — Success, error, info, and warning toast notifications
- **Themed AlertDialogs** — Tamagui-powered confirmation dialogs replacing all native alerts

### Design
- **Dark/Light/System Theme** — Full dual-theme support with system preference detection
- **Atomic Design System** — 10 atoms, 10 molecules, 9 organisms, 3 templates (54 components total)
- **Design Tokens** — Consistent spacing (4px base), typography (Inter font), border radius, and shadow scales
- **27 Tamagui Packages** — Switch, AlertDialog, Toast, Separator, Avatar, Card, Label, and more

### Authentication
- **Google Sign-In** via Firebase Auth (feature-flagged, currently disabled for guest mode)
- **Secure Token Storage** — Firebase persistence backed by `expo-secure-store`
- **Account Switch & Sign-Out** — Confirmation dialogs with themed UI

### Data Integrity
- **Integer Cents** — All amounts stored as `amountMinor` (integer) to prevent floating-point drift
- **UUID Primary Keys** — Universal unique identifiers across all tables
- **Soft Deletes** — `deletedAt` timestamp pattern enables undo and data recovery
- **Schema Migrations** — Drizzle-managed SQL migrations with versioned files

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Expo SDK | 54 |
| **Runtime** | React Native | 0.81 |
| **Language** | TypeScript | 5.9 |
| **UI System** | Tamagui (27 packages) | 1.144 |
| **Navigation** | Expo Router (file-based) | 6.0 |
| **Database** | expo-sqlite + Drizzle ORM | 16.0 / 0.45 |
| **State** | Zustand (5 stores) | 5.0 |
| **Auth** | Firebase + Google Sign-In | 12.9 |
| **Charts** | react-native-gifted-charts | 1.4 |
| **Animations** | react-native-reanimated | 4.1 |
| **Haptics** | expo-haptics | 15.0 |
| **Export** | xlsx-js-style + expo-sharing | — |
| **Settings** | AsyncStorage (MMKV adapter) | — |
| **Build** | EAS Build | — |

---

## 📁 Project Structure

```
expense-tracker/
├── app.json                    # Expo app config (package name, icons, plugins)
├── eas.json                    # EAS Build profiles (dev/preview/production)
├── babel.config.js             # Babel: expo + tamagui + reanimated plugins
├── metro.config.js             # Metro bundler config
├── drizzle.config.ts           # Drizzle ORM migration config
├── entry.js                    # App entry point (registerRootComponent)
├── tsconfig.json               # TypeScript config + path aliases (@/*)
├── google-services.json        # Firebase Android config (gitignored)
├── assets/                     # App icons, splash screen, favicon
│
├── docs/                       # 29 documentation files (see Documentation section)
│
└── src/
    ├── app/                    # Expo Router file-based screens
    │   ├── _layout.tsx         # Root layout (providers: Tamagui, Toast, Paper)
    │   ├── index.tsx           # Entry redirect
    │   ├── +not-found.tsx      # 404 fallback
    │   ├── categories.tsx      # Category management screen
    │   ├── (auth)/             # Auth stack (welcome, login, signup)
    │   ├── (tabs)/             # Bottom tab navigator
    │   │   ├── _layout.tsx     # Tab config (Home, History, Insights, Settings)
    │   │   ├── index.tsx       # Home/Dashboard screen
    │   │   ├── history.tsx     # Expense history + filters
    │   │   ├── insights.tsx    # Charts & analytics
    │   │   └── settings.tsx    # App settings
    │   └── expense/
    │       ├── add.tsx         # Add expense modal
    │       └── [id].tsx        # Edit expense modal
    │
    ├── components/             # Atomic Design component library (54 files)
    │   ├── atoms/              # 16 foundational components (Button, Card, Input, etc.)
    │   ├── molecules/          # 18 composite components (SearchBar, DateSelector, etc.)
    │   ├── organisms/          # 14 complex components (ExpenseForm, SettingsGroup, etc.)
    │   └── templates/          # 5 layout wrappers (ScreenLayout, ModalLayout, etc.)
    │
    ├── config/                 # Feature flags (AUTH_ENABLED)
    │
    ├── db/                     # Database layer
    │   ├── client.ts           # SQLite connection + Drizzle instance
    │   ├── seed.ts             # Default category seeder (8 categories)
    │   ├── schema/             # Drizzle table definitions (categories, expenses)
    │   └── migrations/         # Versioned SQL migration files
    │
    ├── domain/                 # Business rules
    │   └── validators/         # expense.validator.ts, category.validator.ts
    │
    ├── repositories/           # Data access layer (expensesRepo, categoriesRepo)
    │
    ├── services/               # Application services
    │   ├── auth/               # Firebase Auth + Google Sign-In
    │   ├── export/             # XLSX generation + sharing
    │   ├── storage/            # MMKV/AsyncStorage settings adapter
    │   ├── haptics.ts          # Haptic feedback triggers
    │   └── performance.ts      # Render timing + cold start budgets
    │
    ├── store/                  # Zustand state management
    │   ├── useAuthStore.ts     # User session state
    │   ├── useExpenseStore.ts  # Expense CRUD + summaries
    │   ├── useCategoryStore.ts # Category CRUD
    │   ├── useFilterStore.ts   # Filters, search, sort
    │   └── useSettingsStore.ts # Theme, currency, preferences
    │
    ├── theme/                  # Tamagui design system
    │   ├── colors.ts           # Semantic color tokens (light + dark)
    │   ├── tokens.ts           # Spacing, radius scales
    │   ├── typography.ts       # Font sizes, weights, line heights
    │   └── tamagui.config.ts   # Tamagui config (themes, animations, fonts)
    │
    ├── types/                  # Shared TypeScript interfaces
    └── utils/                  # Pure utility functions (formatters, categories)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+
- **Expo CLI** — installed via `npx`
- **EAS CLI** — `npm install -g eas-cli` (for builds)
- **Android device or emulator** — for testing
- **Expo Go app** or a **custom dev client** (required for native modules like Google Sign-In)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Switch to the `dev` Branch & Create Your Feature Branch

All development work starts from the `dev` branch — **never commit directly to `main`**.

```bash
# Switch to the dev branch
git checkout dev
git pull origin dev

# Create your feature branch from dev
git checkout -b feature/your-feature-name
```

**Branching strategy:**

```
main              ← Production releases only (protected)
  └── dev         ← Integration branch (all development starts here)
       ├── feature/add-receipt-upload
       ├── feature/pos-printer-support
       ├── fix/amount-rounding-bug
       └── chore/update-dependencies
```

**Branch naming conventions:**
- `feature/...` — New features (e.g., `feature/org-expense-groups`)
- `fix/...` — Bug fixes (e.g., `fix/category-archive-crash`)
- `chore/...` — Maintenance tasks (e.g., `chore/update-tamagui`)
- `docs/...` — Documentation updates

When your work is complete, open a **Pull Request** from your branch → `dev`. After review and merge, `dev` is periodically merged into `main` for production releases.

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is required due to ESLint peer dependency conflicts with some Tamagui packages.

### 4. Firebase Setup (Optional — Auth is Feature-Flagged Off)

If you want to enable Google Sign-In:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Sign-In** in Authentication → Sign-in methods
3. Download `google-services.json` → place in project root
4. Download `GoogleService-Info.plist` → place in project root
5. Set `EXPO_PUBLIC_AUTH_ENABLED=true` in `.env`

> For development without auth, skip this step entirely — the app works in guest mode by default.

### 5. Environment Configuration

Create a `.env` file in the project root:

```bash
# Feature flags
EXPO_PUBLIC_AUTH_ENABLED=false

# Firebase (only needed if auth is enabled)
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### 6. Start Development Server

```bash
# Standard start
npx expo start

# Start with cache cleared
npx expo start --clear
```

### 7. Run on Device

**With Expo Go** (limited — some native modules won't work):
```bash
npx expo start
# Scan QR code with Expo Go app
```

**With Custom Dev Client** (full native support):
```bash
# Build dev client APK
eas build --profile development --platform android

# Install the APK on your device, then:
npx expo start --dev-client
```

---

## 🧪 Development Commands

| Command | Purpose |
|---|---|
| `npx expo start` | Start Expo dev server |
| `npx expo start --clear` | Start with cache cleared |
| `npx tsc --noEmit` | TypeScript type checking |
| `npx eslint .` | Run ESLint |
| `npx prettier --check .` | Check formatting |
| `npx prettier --write .` | Fix formatting |
| `npx drizzle-kit generate` | Generate DB migration after schema change |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB browser) |
| `eas build --profile development --platform android` | Build dev APK |
| `eas build --profile preview-apk --platform android` | Build release APK |

---

## 📱 Building APK

### Quick Build (Development APK)

```bash
eas build --profile development --platform android
```

### Release Build (Shippable APK)

```bash
eas build --profile preview-apk --platform android
```

### Production Build (Play Store AAB)

```bash
eas build --profile production --platform android
```

> See [22-Build-Release.md](docs/22-Build-Release.md) for the complete build, signing, and distribution guide.

---

## 🧬 Architecture

### Data Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Screens    │───▶│    Zustand    │───▶│ Repositories │───▶│   SQLite     │
│  (Expo       │    │   Stores     │    │  (Drizzle)   │    │  (expo-      │
│   Router)    │◀───│ (5 stores)   │◀───│              │◀───│   sqlite)    │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                                       │
       ▼                                       ▼
┌──────────────┐                    ┌──────────────┐
│   Services   │                    │   Domain     │
│ (auth, export│                    │ (validators) │
│  haptics)    │                    └──────────────┘
└──────────────┘
```

### Component Architecture (Atomic Design)

```
Atoms (16)         → Button, Card, Input, Spinner, Avatar, Divider, Badge, Chip ...
  └─ Molecules (18) → SearchBar, DateSelector, AmountInput, CategoryPicker, EmptyState ...
      └─ Organisms (14) → ExpenseForm, ExpenseList, SettingsGroup, AlertDialog, Toast ...
          └─ Templates (5) → ScreenLayout, ModalLayout, AuthTemplate ...
              └─ Screens (8) → Home, History, Insights, Settings, Add, Edit, Login, Signup
```

### State Management

| Store | Persisted | Purpose |
|---|---|---|
| `useSettingsStore` | ✅ AsyncStorage | Theme mode, currency, onboarding |
| `useAuthStore` | ✅ AsyncStorage | User session, auth state |
| `useExpenseStore` | ❌ | Expense list, summaries, CRUD |
| `useCategoryStore` | ❌ | Category list, CRUD |
| `useFilterStore` | ❌ | Date range, search, sort, category filter |

---

## 🗺️ Future Roadmap

### Phase 2 — POS System Integration
Transform the mobile app into a portable Point of Sale system:
- **Bluetooth Printer Support** — Connect thermal receipt printers directly to the phone
- **Receipt Printing** — Generate and print formatted receipts for transactions
- **POS Mode** — Dedicated interface optimized for quick transaction entry at the counter
- **Barcode/QR Scanning** — Scan product codes for rapid expense/sale entry
- **Transaction Queue** — Offline queue for print jobs when printer connection drops

### Phase 3 — Organization Expense Tracker
Enable team-based expense management for businesses and groups:
- **Create Organizations** — Set up company or group accounts
- **Member Management** — Invite members via link/code, assign roles (Admin, Manager, Member)
- **Shared Expense Submission** — Members submit expenses to their organization
- **Approval Workflow** — Managers review and approve/reject submitted expenses
- **Receipt Photo Attachment** — Capture receipt photos from camera or gallery and attach to expense submissions
- **Expense Verification** — Multi-step verification: submit → review → approve/reject with comments
- **Organization Dashboard** — Aggregated spending analytics across all members
- **Member Reports** — Per-member spending breakdowns and audit trails
- **Role-Based Access** — Admins manage settings, Managers approve, Members submit

### Phase 4 — Cloud Sync & Advanced Features
- **Multi-Device Sync** — Real-time data synchronization across devices via Firestore
- **Cloud Backup & Restore** — Encrypted backup to Firebase Storage
- **Monthly Budgets** — Set spending limits per category with progress tracking
- **Recurring Expenses** — Auto-log repeating bills and subscriptions
- **Reminders & Notifications** — Push notifications for budget warnings and recurring entries
- **Account Deletion (GDPR)** — Full data wipe (local + cloud) on user request

---

## 📚 Documentation

The `docs/` directory contains 29 comprehensive documentation files:

| Doc | Purpose |
|---|---|
| [00-README](docs/00-README.md) | Docs index and project overview |
| [01-PRD](docs/01-PRD.md) | Product requirements document |
| [02-Architecture](docs/02-Architecture.md) | System architecture overview |
| [03-DataModel-SQLite](docs/03-DataModel-SQLite.md) | Database schema design |
| [04-Auth-Firebase-Google](docs/04-Auth-Firebase-Google.md) | Firebase authentication setup |
| [05-UI-UX-Guidelines](docs/05-UI-UX-Guidelines.md) | Design principles and guidelines |
| [13-Project-Structure](docs/13-Project-Structure.md) | Detailed folder structure guide |
| [14-Tech-Stack-Setup](docs/14-Tech-Stack-Setup.md) | Stack installation and configuration |
| [15-Theme-Design-System](docs/15-Theme-Design-System.md) | Tamagui design tokens and theming |
| [16-Component-Architecture](docs/16-Component-Architecture.md) | Atomic Design component guide |
| [17-Database-Schema-Drizzle](docs/17-Database-Schema-Drizzle.md) | Drizzle ORM schema and migrations |
| [18-State-Management](docs/18-State-Management.md) | Zustand store architecture |
| [19-Navigation-Routes](docs/19-Navigation-Routes.md) | Expo Router routing guide |
| [20-Development-Workflow](docs/20-Development-Workflow.md) | Dev commands, CI/CD, Git workflow |
| [21-Feature-Tracker](docs/21-Feature-Tracker.md) | 151-feature development checklist |
| [22-Build-Release](docs/22-Build-Release.md) | APK build, signing, and release guide |
| [AGENTS](docs/AGENTS.md) | AI agent coding conventions |
| [Bug-Fix-Tracker](docs/Bug-Fix-Tracker.md) | Bug tracking and fix history |
| [UI-Changes-Tracker](docs/UI-Changes-Tracker.md) | UI change log |

---

## 🤝 Contributing

1. Read the [AGENTS.md](docs/AGENTS.md) conventions before coding
2. Follow **Atomic Design** — atoms → molecules → organisms → templates → screens
3. Use **Tamagui tokens** for all styling — no hardcoded colors, spacing, or fonts
4. Store amounts as **integer cents** (`amountMinor`) — never floating point
5. Use **soft deletes** (`deletedAt`) — never hard delete user data
6. Run quality checks before committing:

```bash
npx tsc --noEmit && npx eslint . && npx prettier --check .
```

---

## 📄 License

This project is private and not licensed for redistribution.

---

<p align="center">
  Built with ❤️ using Expo · React Native · Tamagui · Drizzle ORM · Zustand
</p>
