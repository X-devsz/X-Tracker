# AGENTS.md — AI Agent Instructions for Expense Tracker

**Last updated:** 2026-02-21  
**Version:** 1.0  

> [!IMPORTANT]
> **Every AI conversation on this project MUST read this file first** before making any changes.  
> After reading this file, review any referenced docs relevant to your task.

---

## 1) Project Overview

**Expense Tracker** is an offline-first React Native mobile app for personal expense tracking with a clean UI and fast data entry.

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Expo (React Native) | SDK 54 |
| **Language** | TypeScript (strict) | 5.9 |
| **UI System** | Tamagui | 1.144.3 |
| **Database** | expo-sqlite + Drizzle ORM | 0.45 |
| **State** | Zustand | 5.x |
| **Auth** | Firebase + Google Sign-In | Feature-flagged |
| **Navigation** | Expo Router (file-based) | 6.x |
| **Charts** | react-native-gifted-charts | 1.4 |
| **Animations** | react-native-reanimated | 4.1 |
| **Icons** | @tamagui/lucide-icons + @expo/vector-icons | — |
| **Storage** | AsyncStorage (settings persistence) | — |
| **Export** | xlsx-js-style + expo-file-system + expo-sharing | — |

### Architecture Pattern

```
UI Layer (Screens → Templates → Organisms → Molecules → Atoms)
    ↓
Domain Layer (Use-cases + Validators)
    ↓
Data Layer (Repositories → Drizzle ORM → SQLite)
```

- **Atomic Design** for components
- **Repository Pattern** for data access
- **Zustand Stores** for UI state (with AsyncStorage persistence)
- **Offline-first** — local SQLite is source of truth

---

## 2) Source Structure

```
expense-tracker/
├── src/
│   ├── app/                    # Expo Router screens & layouts
│   │   ├── _layout.tsx         # Root (TamaguiProvider + auth guard)
│   │   ├── index.tsx           # Redirect logic
│   │   ├── (auth)/             # Welcome + Sign-In screens
│   │   ├── (tabs)/             # Home, History, Insights, Settings
│   │   ├── expense/            # Add + Edit expense (modal stack)
│   │   ├── categories.tsx      # Category management screen
│   │   └── +not-found.tsx      # 404 fallback
│   │
│   ├── components/             # Atomic Design UI components
│   │   ├── atoms/              # Button, Text, Input, Card, Icon, Badge, Chip, etc.
│   │   ├── molecules/          # AmountInput, CategoryPicker, DateSelector, etc.
│   │   ├── organisms/          # ExpenseForm, ExpenseList, MonthlySummaryCard, etc.
│   │   └── templates/          # ScreenContainer, AuthLayout, ModalLayout
│   │
│   ├── theme/                  # ★ CENTRALIZED THEME (single source of truth)
│   │   ├── colors.ts           # Palette + light/dark semantic themes
│   │   ├── tokens.ts           # Spacing, radius, shadows, sizing
│   │   ├── typography.ts       # Font families, sizes, weights
│   │   ├── tamagui.config.ts   # Tamagui unified configuration
│   │   └── animations.ts       # Spring animation presets
│   │
│   ├── db/                     # Database layer
│   │   ├── schema/             # Drizzle table definitions (categories, expenses)
│   │   ├── migrations/         # Versioned SQL migrations
│   │   ├── client.ts           # SQLite connection + Drizzle instance
│   │   └── seed.ts             # Default categories seeder
│   │
│   ├── repositories/           # Data access (Repository pattern)
│   │   ├── expenses.repo.ts    # CRUD + summaries + breakdowns
│   │   └── categories.repo.ts  # CRUD + archive + reorder
│   │
│   ├── domain/                 # Business logic
│   │   └── validators/         # Expense + category validation rules
│   │
│   ├── store/                  # Zustand state stores
│   │   ├── useExpenseStore.ts   # Expenses + summaries + CRUD actions
│   │   ├── useCategoryStore.ts  # Categories list + CRUD
│   │   ├── useFilterStore.ts    # Date range + search + sort (not persisted)
│   │   ├── useSettingsStore.ts  # Theme, currency, onboarding (persisted)
│   │   └── useAuthStore.ts      # User + auth state (persisted)
│   │
│   ├── services/               # External integrations
│   │   ├── auth/               # Firebase + Google Sign-In
│   │   ├── export/             # XLSX export logic
│   │   ├── storage/            # AsyncStorage adapter
│   │   ├── haptics.ts          # Haptic feedback helpers
│   │   └── performance.ts      # Cold start + render timing
│   │
│   ├── config/                 # App configuration constants
│   ├── utils/                  # Pure utility functions
│   └── types/                  # Shared TypeScript types
│
├── docs/                       # All project documentation (27 files)
├── assets/                     # Fonts, icons, images
├── tamagui.config.ts           # Root Tamagui config (imports src/theme)
├── drizzle.config.ts           # Drizzle Kit configuration
├── babel.config.js             # Tamagui + Reanimated plugins
└── package.json
```

---

## 3) Tamagui & Styling Rules

> [!CAUTION]
> **NEVER hardcode colors, spacing, font sizes, or border radius values.** Always use Tamagui tokens.

### ✅ Correct — Use theme tokens

```typescript
import { styled, YStack, Text } from 'tamagui';

const StyledCard = styled(YStack, {
  backgroundColor: '$cardBackground',
  borderColor: '$border',
  borderWidth: 1,
  borderRadius: '$md',
  padding: '$lg',
  gap: '$sm',
});
```

### ❌ Wrong — Never hardcode

```typescript
// DON'T DO THIS
const BadCard = styled(YStack, {
  backgroundColor: '#FFFFFF',  // ❌ Hardcoded color
  borderRadius: 12,            // ❌ Magic number
  padding: 16,                 // ❌ Not from tokens
});
```

### Theme Token Reference

| What to use | Token prefix | Examples |
|---|---|---|
| **Colors** | `$` prefix | `$primary`, `$textPrimary`, `$cardBackground`, `$border`, `$danger` |
| **Spacing** | `$` prefix | `$xs`(4), `$sm`(8), `$md`(12), `$lg`(16), `$xl`(20), `$2xl`(24) |
| **Border radius** | `$` prefix | `$xs`(4), `$sm`(8), `$md`(12), `$lg`(16), `$xl`(24), `$full`(9999) |
| **Font sizes** | `$` prefix | `$xs`(11), `$sm`(13), `$md`(15), `$lg`(17), `$xl`(20), `$2xl`(24) |
| **Font weights** | `$` prefix | `$regular`(400), `$medium`(500), `$semibold`(600), `$bold`(700) |

### Where to change things

| What | File |
|---|---|
| Brand / primary color | `src/theme/colors.ts` → `palette.primary*` |
| Dark mode colors | `src/theme/colors.ts` → `darkTheme` |
| Spacing / sizing | `src/theme/tokens.ts` |
| Font family / sizes | `src/theme/typography.ts` |
| Category colors | `src/theme/colors.ts` → `palette.category*` |
| Animations | `src/theme/animations.ts` |

### Key Tamagui Imports

```typescript
// Layout
import { YStack, XStack, ScrollView } from 'tamagui';

// Theme access in JS
import { useTheme } from 'tamagui';
const theme = useTheme();
const bgColor = theme.background.val;

// Styled components
import { styled, GetProps } from 'tamagui';

// App components (always use barrel exports)
import { AppButton, AppText, AppCard } from '@/components/atoms';
```

---

## 4) Atomic Design Rules

| Layer | Can Use | Logic Allowed | Examples |
|---|---|---|---|
| **Atoms** | Tamagui primitives only | NO hooks, NO API calls | AppButton, AppText, AppInput, AppCard, AppIcon |
| **Molecules** | Atoms | Simple local state only | AmountInput, CategoryPicker, ExpenseListItem |
| **Organisms** | Atoms + Molecules | YES — hooks, use-cases, form state | ExpenseForm, ExpenseList, MonthlySummaryCard |
| **Templates** | Any component | NO — layout wrappers only | ScreenContainer, AuthLayout, ModalLayout |
| **Screens** | Organisms + Templates | Navigation params only | `(tabs)/index.tsx`, `expense/add.tsx` |

### Component File Template

```typescript
// src/components/atoms/MyComponent/MyComponent.tsx

// 1. Imports
import { styled, GetProps } from 'tamagui';

// 2. Types
interface MyComponentProps extends GetProps<typeof StyledMyComponent> {
  customProp?: string;
}

// 3. Styled component
const StyledMyComponent = styled(/* Tamagui base */, {
  // Use $tokens only
});

// 4. Component
export const MyComponent: React.FC<MyComponentProps> = (props) => {
  return <StyledMyComponent {...props} />;
};

// 5. Display name
MyComponent.displayName = 'MyComponent';
```

### Rules

1. One component per file
2. Colocated tests: `MyComponent.test.tsx` next to `MyComponent.tsx`
3. Every folder has `index.ts` barrel export
4. No business logic in components — delegate to hooks or use-cases
5. No raw SQL in UI/domain — only via repositories
6. Handle all states: default, loading, empty, error, disabled

---

## 5) Database & Data Layer

### Schema Location

- Table definitions: `src/db/schema/` (Drizzle ORM)
- Migrations: `src/db/migrations/` (generated via `npx drizzle-kit generate`)
- DB client: `src/db/client.ts`

### Data Flow

```
Screen → Zustand Store → Repository → Drizzle ORM → SQLite
```

### Rules

- **Amount stored as integer cents** (`amountMinor`) — never use floats
- **Soft delete** via `deletedAt` — queries always filter `WHERE deletedAt IS NULL`
- **`updatedAt`** always refreshed on every edit
- **UUID primary keys** — generated via `uuid()` at creation
- **Never modify existing migration files** — always generate new ones

---

## 6) State Management

### Stores

| Store | Persisted | Purpose |
|---|---|---|
| `useSettingsStore` | ✅ AsyncStorage | Theme, currency, onboarding, last-used category |
| `useAuthStore` | ✅ AsyncStorage | User profile, auth state |
| `useExpenseStore` | ❌ (reads from SQLite) | Recent expenses, monthly summary, CRUD actions |
| `useCategoryStore` | ❌ (reads from SQLite) | Categories list, CRUD |
| `useFilterStore` | ❌ | Date range, search query, sort, category filter |

### Rules

- Always use **selectors** — never `const store = useExpenseStore()`
- Use `useShallow` for multi-field selectors
- No API calls directly in stores — stores call use-cases → use-cases call repos

---

## 7) ★ CHANGE TRACKING PROTOCOL (MANDATORY)

> [!IMPORTANT]
> **Every AI conversation MUST update the relevant tracker file(s) after making changes.**

### 7.1 Bug Fixes & Code Corrections

**File:** [`docs/Bug-Fix-Tracker.md`](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/Bug-Fix-Tracker.md)

When fixing a bug, add an entry with:
- Date, Bug ID (auto-increment `BUG-NNN`), description, root cause, fix applied, files changed, related Feature ID

### 7.2 UI Changes & Improvements

**File:** [`docs/UI-Changes-Tracker.md`](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/UI-Changes-Tracker.md)

When making any visual/UI change, add an entry under the current date with:
- Category (Layout / Component / Theme / Navigation / Animation)
- Description of change
- Component(s) affected
- Related Feature ID

### 7.3 Feature Changes & Improvements

**File:** [`docs/21-Feature-Tracker.md`](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/21-Feature-Tracker.md)

> [!WARNING]
> **Do NOT modify the existing feature status row.** Instead, add a `> **Change Log:**` note block **below** the relevant feature's table row or section to track changes/improvements made to that feature.

**Format for feature change notes:**

```markdown
> **Change Log:**
> - `2026-02-21` — [Description of change or improvement made]
> - `2026-02-21` — [Another change to this feature]
```

**Example:**

```markdown
| F-012.3 | `ExpenseForm` - full add/edit expense form | [x] | ExpenseForm with amount, category, date, note, merchant, payment |

> **Change Log:**
> - `2026-02-21` — Added payment method dropdown with Cash/Card/UPI options
> - `2026-02-21` — Fixed date picker not defaulting to today on new expense
```

This way, the original feature status and description stays intact, while all subsequent changes are tracked chronologically below it.

---

## 8) Navigation & Routing

### Route Map

| Route | Screen | Auth Required |
|---|---|---|
| `/` | Redirect → `/(tabs)` or `/welcome` | No |
| `/welcome` | Onboarding | No |
| `/sign-in` | Google Sign-In | No |
| `/(tabs)` | Home Dashboard | Flagged |
| `/(tabs)/history` | Expense History | Flagged |
| `/(tabs)/insights` | Charts & Analytics | Flagged |
| `/(tabs)/settings` | Settings | Flagged |
| `/expense/add` | Add Expense (Modal) | Flagged |
| `/expense/[id]` | Edit Expense (Modal) | Flagged |
| `/categories` | Category Management | Flagged |

### Auth Feature Flag

Auth is controlled by `EXPO_PUBLIC_AUTH_ENABLED` in `.env`. When `false`, the app skips auth guards and runs in guest mode.

---

## 9) Documentation Reference Index

| # | File | Purpose |
|---|---|---|
| 00 | [README.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/00-README.md) | Doc pack overview |
| 01 | [PRD.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/01-PRD.md) | Product requirements (MVP → Cloud) |
| 02 | [Architecture.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/02-Architecture.md) | Architecture blueprint |
| 03 | [DataModel-SQLite.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/03-DataModel-SQLite.md) | SQLite data model spec |
| 04 | [Auth-Firebase-Google.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/04-Auth-Firebase-Google.md) | Firebase auth plan |
| 05 | [UI-UX-Guidelines.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/05-UI-UX-Guidelines.md) | UI/UX patterns & accessibility |
| 06 | [Cloud-Roadmap-API.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/06-Cloud-Roadmap-API.md) | Cloud sync roadmap |
| 07 | [Testing-QA.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/07-Testing-QA.md) | Testing strategy |
| 08 | [Security-Privacy.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/08-Security-Privacy.md) | Security baseline |
| 09 | [DevOps-CICD.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/09-DevOps-CICD.md) | CI/CD pipeline |
| 10 | [Observability.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/10-Observability.md) | Logging & crash reporting |
| 11 | [Feature-Checklist.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/11-Feature-Checklist.md) | Definition of Done checklist |
| 12 | [MVP-Plan.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/12-MVP-Plan.md) | Build order sequence |
| 13 | [Project-Structure.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/13-Project-Structure.md) | Folder architecture |
| 14 | [Tech-Stack-Setup.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/14-Tech-Stack-Setup.md) | Package install guide |
| 15 | [Theme-Design-System.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/15-Theme-Design-System.md) | Tamagui theme config |
| 16 | [Component-Architecture.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/16-Component-Architecture.md) | Atomic Design component catalog |
| 17 | [Database-Schema-Drizzle.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/17-Database-Schema-Drizzle.md) | Drizzle ORM schema guide |
| 18 | [State-Management.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/18-State-Management.md) | Zustand store patterns |
| 19 | [Navigation-Routes.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/19-Navigation-Routes.md) | Expo Router screen map |
| 20 | [Development-Workflow.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/20-Development-Workflow.md) | Commands, builds, CI/CD |
| 21 | [Feature-Tracker.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/21-Feature-Tracker.md) | 151-feature progress tracker |
| 22 | [Google-Auth-Setup.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/22-Google-Auth-Setup.md) | Google Sign-In configuration |
| — | [UI-Changes-Tracker.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/UI-Changes-Tracker.md) | UI change log |
| — | [Bug-Fix-Tracker.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/Bug-Fix-Tracker.md) | Bug fix log |
| — | [ExpenseTracker_Shippable_APK_Plan.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/ExpenseTracker_Shippable_APK_Plan.md) | APK build plan |
| — | [ReactNative_ExpenseTracker_Stack_and_Libraries.md](file:///c:/Projects/Expense-Tracker/expense-tracker/docs/ReactNative_ExpenseTracker_Stack_and_Libraries.md) | Full stack/library reference |

---

## 10) Code Quality Rules

1. **No `any` types** — strict TypeScript always
2. **No hardcoded colors/sizes** — use Tamagui `$tokens`
3. **No raw SQL in UI** — only through repositories
4. **No business logic in components** — delegate to hooks/use-cases
5. **One component per file** — no multi-component files
6. **Barrel exports** — every folder has `index.ts`
7. **Colocated tests** — `*.test.tsx` next to source
8. **Conventional Commits** — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
9. **Clean imports** — always use `@/` path aliases
10. **Handle all states** — loading, empty, error, disabled for every screen/component

---

## 11) Quick Start for New Conversations

```bash
# 1. Read this file (AGENTS.md)
# 2. Read the relevant doc(s) for your task
# 3. Make your changes following the rules above
# 4. Update the tracker file(s):
#    - UI changes   → docs/UI-Changes-Tracker.md
#    - Bug fixes    → docs/Bug-Fix-Tracker.md
#    - Feature work → docs/21-Feature-Tracker.md (add Change Log notes)
# 5. Follow Tamagui patterns and Atomic Design
```
