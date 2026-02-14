# Feature Tracker - Expense Tracker (End-to-End Development Checklist)

**Last updated:** 2026-02-14  
**Purpose:** Comprehensive, trackable feature list extracted from all project docs. Designed to be given to an AI agent or developer so they understand exactly what each feature requires.

> **Legend:** `[ ]` = Not started | `[/]` = In Progress | `[x]` = Completed | `[~]` = Deferred

---

## Phase 0 - Project Foundation

### F-000: Project Setup & Configuration

| #       | Feature                                     | Status | Details                                                               |
| ------- | ------------------------------------------- | ------ | --------------------------------------------------------------------- |
| F-000.1 | Expo project created with TypeScript        | [x]    | SDK 54, `expo-router` entry point                                     |
| F-000.2 | All packages installed                      | [x]    | Tamagui, Drizzle, Zustand, Firebase, Charts, AsyncStorage, Reanimated |
| F-000.3 | Path aliases configured (`@/*`)             | [x]    | `tsconfig.json` + metro resolver                                      |
| F-000.4 | Babel config (Tamagui + Reanimated plugins) | [x]    | `babel.config.js`                                                     |
| F-000.5 | Tamagui root config                         | [x]    | `tamagui.config.ts` imports from `src/theme/`                         |
| F-000.6 | EAS build config                            | [x]    | `eas.json` with dev/preview/prod profiles                             |
| F-000.7 | ESLint + Prettier config                    | [x]    | `.eslintrc.cjs` + `.prettierrc.cjs` + lint/format scripts              |
| F-000.8 | Atomic folder structure created             | [x]    | `src/components` (atoms, molecules, organisms, templates) + exports   |
| F-000.9 | Custom dev client path                      | [x]    | Google Sign-In plugin enabled + prebuild script added                 |

### F-001: Theme & Design System

| #       | Feature                            | Status | Details                                                                        |
| ------- | ---------------------------------- | ------ | ------------------------------------------------------------------------------ |
| F-001.1 | Color palette defined (light mode) | [x]    | Semantic tokens: background, surface, text, primary, danger, success           |
| F-001.2 | Color palette defined (dark mode)  | [x]    | Full dark semantic tokens matching light structure                             |
| F-001.3 | Category colors defined            | [x]    | 8 distinct colors for expense categories                                       |
| F-001.4 | Spacing scale (4px base)           | [x]    | 0, xs(4), sm(8), md(12), lg(16), xl(20), 2xl(24), 3xl(32)                      |
| F-001.5 | Typography system (Inter font)     | [x]    | h1-h4, body, bodySm, label, caption, amount, button variants                   |
| F-001.6 | Border radius scale                | [x]    | xs(4), sm(8), md(12), lg(16), xl(24), full(9999)                               |
| F-001.7 | Shadow presets (sm, md, lg)        | [x]    | Tokenized presets applied to cards, FAB, hero                                  |
| F-001.8 | Animation presets                  | [x]    | fast, medium, slow, bouncy configs used for section entrances + press feedback |
| F-001.9 | Theme toggle (light/dark/system)   | [x]    | Persisted in AsyncStorage, reads system preference as default                  |

### F-002: Navigation & Routing

| #       | Feature                                           | Status | Details                                                           |
| ------- | ------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| F-002.1 | Root layout with TamaguiProvider                  | [x]    | Wraps entire app in theme + font provider                         |
| F-002.2 | Tab navigator (Home, History, Insights, Settings) | [x]    | Bottom tab bar with icons, themed colors                          |
| F-002.3 | Auth stack (Welcome, Sign-In)                     | [x]    | Welcome, Login, Signup screens wired + routes linked from Welcome |
| F-002.4 | Auth guard (redirect logic)                       | [x]    | Root layout checks auth state + index redirect to Welcome         |
| F-002.5 | Expense modal stack (Add, Edit)                   | [x]    | Modal presentation, themed header                                 |
| F-002.6 | Deep linking scheme                               | [x]    | `expensetracker://` scheme configured in app.json                 |
| F-002.7 | 404/Not Found screen                              | [x]    | Graceful fallback for unknown routes                              |

---

## Phase 1 - Core MVP

### F-010: Atom Components

| #        | Feature                                               | Status | Details                                                                         |
| -------- | ----------------------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| F-010.1  | `Button` - primary, secondary, danger, ghost variants | [x]    | AppButton with primary/secondary/danger/ghost tones + animated CTA/press feedback |
| F-010.2  | `Text` - all typography variants                      | [x]    | AppText variants added (h1-h4, body, label, caption, amount)                    |
| F-010.3  | `Input` - text input with label + error               | [x]    | AppInput + InputField with label/error; AuthField for auth                      |
| F-010.4  | `Card` - elevated, pressable variants                 | [x]    | AppCard atom added with elevated + pressable variants                           |
| F-010.5  | `Icon` - vector icon wrapper                          | [x]    | AppIcon atom added alongside AppIconButton                                      |
| F-010.6  | `Badge` - success, danger, warning variants           | [x]    | AppBadge atom with tone variants                                                |
| F-010.7  | `Chip` - selectable filter chips                      | [x]    | AppChip atom with active/inactive states                                        |
| F-010.8  | `Divider` - horizontal/vertical separator             | [x]    | AppDivider atom added + OrDivider remains for auth screens                      |
| F-010.9  | `Spinner` - loading indicator                         | [x]    | AppSpinner atom with themed color default                                       |
| F-010.10 | `Avatar` - user profile image                         | [x]    | AppAvatar atom with fallback initials                                           |

### F-011: Molecule Components

| #        | Feature                                                    | Status | Details                                                 |
| -------- | ---------------------------------------------------------- | ------ | ------------------------------------------------------- |
| F-011.1  | `AmountInput` - currency symbol + large number input       | [x]    | AmountInput molecule with decimal keypad + formatted display |
| F-011.2  | `CategoryPicker` - grid/list of category options           | [x]    | CategoryPicker grid with icons, colors, favorites ordering |
| F-011.3  | `DateSelector` - quick presets (Today, Yesterday) + picker | [x]    | DateSelector with presets and picker trigger            |
| F-011.4  | `ExpenseListItem` - single expense row                     | [x]    | ExpenseListItem molecule with icon, category, amount, date, note |
| F-011.5  | `SearchBar` - debounced text search                        | [x]    | SearchBar with debounce + clear action                  |
| F-011.6  | `FilterChip` - category/date filter chips                  | [x]    | FilterChip molecule with active/inactive states         |
| F-011.7  | `EmptyState` - icon + title + description + CTA            | [x]    | EmptyState molecule with CTA support                    |
| F-011.8  | `ErrorCard` - error message + retry button                 | [x]    | ErrorCard molecule with retry action                    |
| F-011.9  | `SnackBar` - temporary toast notification                  | [x]    | SnackBar molecule with action + dismiss                 |
| F-011.10 | Auth molecules                                             | [x]    | AuthField, SectionHeader, SocialButtonRow, AuthFooter   |

### F-012: Organism Components

| #       | Feature                                           | Status | Details                                                     |
| ------- | ------------------------------------------------- | ------ | ----------------------------------------------------------- |
| F-012.1 | `MonthlySummaryCard` - total spent + change %     | [x]    | MonthlySummaryCard organism with amount + trend badge       |
| F-012.2 | `ExpenseList` - virtualized list of expense items | [x]    | ExpenseList with FlatList + loading/empty/error handling    |
| F-012.3 | `ExpenseForm` - full add/edit expense form        | [x]    | ExpenseForm with amount, category, date, note, merchant, payment |
| F-012.4 | `CategoryBreakdown` - pie/donut chart             | [x]    | CategoryBreakdown using gifted-charts PieChart              |
| F-012.5 | `SpendingTrendChart` - line/bar chart             | [x]    | SpendingTrendChart using gifted-charts LineChart            |
| F-012.6 | `QuickAddFAB` - floating action button            | [x]    | QuickAddFAB with floating variant                           |
| F-012.7 | `FilterBar` - combined date + category filter row | [x]    | FilterBar with DateSelector + FilterChip row                |
| F-012.8 | `SettingsGroup` - grouped settings rows           | [x]    | SettingsGroup with toggle/navigation rows                   |
| F-012.9 | Auth landing components                           | [x]    | LandingHero + AuthForm built with atomic components         |

### F-013: Template Components

| #       | Feature                                            | Status | Details                                   |
| ------- | -------------------------------------------------- | ------ | ----------------------------------------- |
| F-013.1 | `ScreenContainer` - safe area + scrollable wrapper | [x]    | ScreenContainer template used across tab screens        |
| F-013.2 | `AuthLayout` - centered auth screen layout         | [x]    | AuthTemplate used across auth screens     |
| F-013.3 | `ModalLayout` - modal screen layout                | [x]    | ModalLayout with header actions used in add expense modal |

---

### F-020: Database & Data Layer

| #       | Feature                                    | Status | Details                                                                                                        |
| ------- | ------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------- |
| F-020.1 | SQLite database connection (`expo-sqlite`) | [x]    | `src/db/client.ts` Drizzle instance + runtime migrations                                                      |
| F-020.2 | Categories schema (Drizzle)                | [x]    | `src/db/schema/categories.ts` with timestamps + soft delete                                                   |
| F-020.3 | Expenses schema (Drizzle)                  | [x]    | `src/db/schema/expenses.ts` with FK + timestamps + soft delete                                                |
| F-020.4 | Accounts schema (optional)                 | [~]    | Deferred to post-MVP                                                                                           |
| F-020.5 | Migration framework                        | [x]    | `drizzle.config.ts` + `src/db/migrations` with `0001_init.sql`                                                 |
| F-020.6 | Seed default categories                    | [x]    | `src/db/seed.ts` seeds 8 default categories                                                                    |
| F-020.7 | Database initialization on app start       | [x]    | `src/app/_layout.tsx` runs migrations + seed                                                                   |
| F-020.8 | Indexes for query performance              | [x]    | Indexes on `occurredAt`, `categoryId`, `deletedAt`                                                             |

### F-021: Repository Layer

| #       | Feature                               | Status | Details                                                        |
| ------- | ------------------------------------- | ------ | -------------------------------------------------------------- |
| F-021.1 | `expensesRepo.create()`               | [x]    | `src/repositories/expenses.repo.ts` with UUID + timestamps + amount validation |
| F-021.2 | `expensesRepo.update()`               | [x]    | Partial update with `updatedAt` refresh                         |
| F-021.3 | `expensesRepo.softDelete()`           | [x]    | Sets `deletedAt` + updates timestamp                            |
| F-021.4 | `expensesRepo.restore()`              | [x]    | Clears `deletedAt` for undo                                     |
| F-021.5 | `expensesRepo.getById()`              | [x]    | Joins category + excludes soft-deleted                          |
| F-021.6 | `expensesRepo.listByDateRange()`      | [x]    | Date range + optional category, ordered by date DESC            |
| F-021.7 | `expensesRepo.getMonthlySummary()`    | [x]    | SUM(amountMinor) + COUNT for a month                            |
| F-021.8 | `expensesRepo.getCategoryBreakdown()` | [x]    | GROUP BY category + SUM + COUNT + percentage                    |
| F-021.9 | `categoriesRepo` (full CRUD)          | [x]    | `src/repositories/categories.repo.ts` create/update/archive/list |

### F-022: State Management (Zustand Stores)

| #       | Feature                                                     | Status | Details                                                |
| ------- | ----------------------------------------------------------- | ------ | ------------------------------------------------------ |
| F-022.1 | `useSettingsStore` - theme, currency, onboarding            | [x]    | Persisted to AsyncStorage                              |
| F-022.2 | `useAuthStore` - user, isAuthenticated, isLoading           | [x]    | Persisted to AsyncStorage                              |
| F-022.3 | `useExpenseStore` - recentExpenses, summary, CRUD actions   | [x]    | `src/store/useExpenseStore.ts` uses repositories       |
| F-022.4 | `useCategoryStore` - categories list, CRUD actions          | [x]    | `src/store/useCategoryStore.ts` uses repositories      |
| F-022.5 | `useFilterStore` - dateRange, category filter, search, sort | [x]    | `src/store/useFilterStore.ts` (not persisted)          |
| F-022.6 | MMKV persist middleware for Zustand                         | [/]    | AsyncStorage adapter in `src/services/storage/mmkv.ts` |

### F-023: MMKV Settings Storage

| #       | Feature                  | Status | Details                                                  |
| ------- | ------------------------ | ------ | -------------------------------------------------------- |
| F-023.1 | MMKV instance created    | [x]    | AsyncStorage adapter in `src/services/storage/mmkv.ts`   |
| F-023.2 | Typed storage keys       | [x]    | `StorageKeys` for theme, currency, onboarded, category   |
| F-023.3 | Settings getters/setters | [x]    | `settingsStorage` type-safe wrappers                     |

---

### F-030: Screens (MVP)

| #       | Feature                                                         | Status | Details                                                                                   |
| ------- | --------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| F-030.1 | **Home Screen** - monthly total, recent expenses, quick add FAB | [x]    | `(tabs)/index.tsx` - dashboard uses stores for summary, recent list, quick stats, FAB      |
| F-030.2 | **Add Expense Screen** - full expense form (modal)              | [x]    | `expense/add.tsx` - ExpenseForm wired to categories + create action                        |
| F-030.3 | **Edit Expense Screen** - pre-filled form (modal)               | [x]    | `expense/[id].tsx` - loads expense, pre-fills form, updates on save                        |
| F-030.4 | **History Screen** - filtered expense list                      | [x]    | `(tabs)/history.tsx` - filters + search + swipe edit/delete + refresh                       |
| F-030.5 | **Insights Screen** - charts and analytics                      | [x]    | `(tabs)/insights.tsx` - breakdown + trend data from DB                                     |
| F-030.6 | **Settings Screen** - app configuration                         | [x]    | Theme toggle, currency picker, account info, sign-out                                      |
| F-030.7 | **Welcome Screen** - onboarding                                 | [x]    | `(auth)/welcome.tsx` - Landing hero + CTA                                                 |
| F-030.8 | **Sign-In Screen** - Google auth                                | [x]    | `(auth)/login.tsx` + `(auth)/signup.tsx` - styled for light/dark themes                   |

---

### F-040: Core Business Logic

| #       | Feature                                            | Status | Details                                                |
| ------- | -------------------------------------------------- | ------ | ------------------------------------------------------ |
| F-040.1 | Amount stored as integer minor units (cents)       | [x]    | Forms parse to `amountMinor` and repos enforce integers |
| F-040.2 | Amount display formatting (locale-aware)           | [x]    | `formatCurrency(amountMinor, currencyCode)` helper added |
| F-040.3 | Date formatting helpers                            | [x]    | Relative dates + `formatDateRange` utilities           |
| F-040.4 | Expense validation (amount > 0, category required) | [x]    | `src/domain/validators/expense.validator.ts`           |
| F-040.5 | Category validation (name required, unique)        | [x]    | `src/domain/validators/category.validator.ts` + repo checks |
| F-040.6 | Soft delete with undo (snackbar for 5-10s)         | [x]    | History swipe delete shows undo snackbar               |
| F-040.7 | Default last-used category pre-selection           | [x]    | Stored in settings + used for add expense default      |

---

### F-050: Export

| #       | Feature                         | Status | Details                                                                |
| ------- | ------------------------------- | ------ | ---------------------------------------------------------------------- |
| F-050.1 | Excel generation (xlsx-js-style) | [x]    | `src/services/export/expenses.ts` builds styled XLSX export            |
| F-050.2 | File write (expo-file-system)    | [x]    | Writes to app document/cache directory                                 |
| F-050.3 | Share sheet (expo-sharing)       | [x]    | System share dialog for XLSX file                                      |
| F-050.4 | Export handles empty dataset    | [x]    | Alert shown when no expenses match filters                             |
| F-050.5 | Export matches displayed totals | [x]    | Uses filter store range/category/search before export                  |

---

### F-060: Authentication

| #       | Feature                                  | Status | Details                                                       |
| ------- | ---------------------------------------- | ------ | ------------------------------------------------------------- |
| F-060.1 | Google Sign-In via Firebase              | [x]    | Native Google Sign-In + Firebase Auth                         |
| F-060.2 | Token stored in SecureStore              | [x]    | SecureStore-backed Firebase persistence + ID token stored     |
| F-060.3 | Sign-in success -> redirect to Home      | [x]    | Auth guard routes to `(tabs)`                                 |
| F-060.4 | Sign-in cancelled -> stay on auth screen | [x]    | Google sign-in cancellation handled without alerts            |
| F-060.5 | Sign-out -> clear session, stay on auth  | [x]    | Sign-out wired in Settings                                    |
| F-060.6 | Auth state persistence across restarts   | [x]    | Firebase Auth persistence via SecureStore                     |
| F-060.7 | Account switch confirmation              | [x]    | Settings action prompts before switching accounts             |
| F-060.8 | Guest mode (optional)                    | [~]    | Deferred - skippable for MVP                                  |

---

## Phase 1.5 - Stabilization

### F-070: UX Polish

| #       | Feature                               | Status | Details                                                       |
| ------- | ------------------------------------- | ------ | ------------------------------------------------------------- |
| F-070.1 | Loading skeletons on all data screens | [x]    | Skeleton cards for Home, History, Insights                    |
| F-070.2 | Empty states on all screens           | [x]    | Meaningful message + CTA                                      |
| F-070.3 | Error states with retry               | [x]    | ErrorCard component on data failure                           |
| F-070.4 | Undo delete snackbar                  | [x]    | 5-second timer, restore on tap                                |
| F-070.5 | Pull-to-refresh on lists              | [x]    | Home + History                                                |
| F-070.6 | Swipe-to-delete on expense items      | [x]    | Swipe actions wired for edit/delete with undo prompt          |
| F-070.7 | Haptic feedback on key actions        | [x]    | Add expense, delete, category select                          |

### F-071: Performance

| #       | Feature                     | Status | Details                                              |
| ------- | --------------------------- | ------ | ---------------------------------------------------- |
| F-071.1 | Virtualized expense lists   | [x]    | FlatList tuning: key extraction + batching/window configs |
| F-071.2 | Cold start < 2.5s           | [/]    | Budgeted cold-start logs with OK/SLOW warning        |
| F-071.3 | Screen render < 300ms       | [/]    | Budgeted render timing logs with OK/SLOW warning     |
| F-071.4 | Cached summary computations | [x]    | Summary + breakdown cached with invalidation on writes |

### F-072: Categories Management

| #       | Feature                | Status | Details                                  |
| ------- | ---------------------- | ------ | ---------------------------------------- |
| F-072.1 | Create custom category | [x]    | Categories screen form with name/icon/color picker |
| F-072.2 | Rename category        | [x]    | Edit flow updates all related views                |
| F-072.3 | Archive category       | [x]    | Archive action hides from picker, preserves history |
| F-072.4 | Reorder categories     | [x]    | Manual reorder via up/down controls                |

### F-073: Budgets (Optional Post-MVP)

| #       | Feature                         | Status | Details  |
| ------- | ------------------------------- | ------ | -------- |
| F-073.1 | Set monthly budget per category | [~]    | Deferred |
| F-073.2 | Budget progress bar on Insights | [~]    | Deferred |
| F-073.3 | Budget exceeded notification    | [~]    | Deferred |

---

## Phase 2 - Cloud Sync

### F-080: Sync Infrastructure

| #       | Feature                               | Status | Details                                               |
| ------- | ------------------------------------- | ------ | ----------------------------------------------------- |
| F-080.1 | Sync metadata columns in schema       | [~]    | `clientId`, `version`, `syncState`, `serverUpdatedAt` |
| F-080.2 | Sync worker (background push)         | [~]    | Mark records PENDING -> push -> SYNCED                |
| F-080.3 | Conflict resolution (last-write-wins) | [~]    | Define before implementation                          |
| F-080.4 | Multi-device read/write               | [~]    | Verify correctness with 2 devices                     |

### F-081: Cloud Features

| #       | Feature                       | Status | Details                                |
| ------- | ----------------------------- | ------ | -------------------------------------- |
| F-081.1 | Encrypted backup to cloud     | [~]    | Firebase Storage or custom API         |
| F-081.2 | Restore from backup           | [~]    | Download + apply + conflict resolution |
| F-081.3 | Account deletion (GDPR-ready) | [~]    | Delete cloud + local data              |
| F-081.4 | Receipt image storage         | [~]    | Private bucket + presigned URLs        |

---

## Quality Gates

### F-090: Testing

| #       | Feature                                                | Status | Details                                |
| ------- | ------------------------------------------------------ | ------ | -------------------------------------- |
| F-090.1 | Unit tests: amount parsing/formatting                  | [ ]    | Domain level                           |
| F-090.2 | Unit tests: summary computation                        | [ ]    | Correct totals, empty data, edge cases |
| F-090.3 | Unit tests: category CRUD behavior                     | [ ]    | Create, rename, archive, soft delete   |
| F-090.4 | Integration tests: SQLite repositories                 | [ ]    | Insert/update/delete/query             |
| F-090.5 | Integration tests: DB migrations                       | [ ]    | Fresh DB -> latest version             |
| F-090.6 | E2E smoke: add expense -> appears in history + summary | [ ]    | End-to-end flow                        |
| F-090.7 | E2E smoke: export CSV produces correct file            | [ ]    | Columns, totals, encoding              |

### F-091: Security & Privacy

| #       | Feature                                  | Status | Details                        |
| ------- | ---------------------------------------- | ------ | ------------------------------ |
| F-091.1 | Tokens only in SecureStore               | [ ]    | Verified not in SQLite or logs |
| F-091.2 | No PII in structured logs                | [ ]    | Redact notes, merchant names   |
| F-091.3 | Parameterized SQL queries (no injection) | [ ]    | Drizzle ORM handles this       |
| F-091.4 | npm audit clean (no high/critical)       | [ ]    | CI pipeline check              |

### F-092: Observability

| #       | Feature                         | Status | Details                                    |
| ------- | ------------------------------- | ------ | ------------------------------------------ |
| F-092.1 | Crash reporting configured      | [ ]    | Sentry or Firebase Crashlytics             |
| F-092.2 | Structured logs for key actions | [ ]    | expense_created, export_done, db_migration |
| F-092.3 | Cold start time measurement     | [ ]    | Track and optimize                         |

---

## Summary Counts

| Phase                     | Total Features | Completed | In Progress | Deferred |
| ------------------------- | -------------- | --------- | ----------- | -------- |
| Phase 0 - Foundation      | 25             | 25        | 0           | 0        |
| Phase 1 - Core MVP        | 86             | 83        | 1           | 2        |
| Phase 1.5 - Stabilization | 18             | 13        | 2           | 3        |
| Phase 2 - Cloud Sync      | 8              | 0         | 0           | 8        |
| Quality Gates             | 14             | 0         | 0           | 0        |
| **Total**                 | **151**        | **121**   | **3**       | **13**   |
