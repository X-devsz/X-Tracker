# Project Structure — Atomic Folder Architecture (Industry Best Practices)

**Last updated:** 2026-02-11  
**Stack:** Expo + TypeScript + Tamagui + Drizzle ORM + Zustand + Expo Router

---

## 1) Design Principles

- **Atomic Design** — Atoms → Molecules → Organisms → Templates → Screens
- **Feature-first** for business logic; **layer-first** for shared primitives
- **Single responsibility** — each file does one thing
- **Barrel exports** — `index.ts` in every folder for clean imports
- **Colocation** — tests, types, and stories live next to their source
- **Centralized theme** — one place to configure all colors, fonts, spacing

---

## 2) Root Directory Layout

```text
expense-tracker/
├── app/                          # Expo Router — file-based screens & layouts
│   ├── _layout.tsx               # Root layout (providers, theme, fonts)
│   ├── index.tsx                 # Redirect → (tabs)
│   ├── (auth)/                   # Auth group (unauthenticated)
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   └── welcome.tsx
│   ├── (tabs)/                   # Main tab navigator (authenticated)
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Home / Dashboard
│   │   ├── history.tsx           # Expense history
│   │   ├── insights.tsx          # Charts / analytics
│   │   └── settings.tsx          # Settings screen
│   ├── expense/
│   │   ├── add.tsx               # Add expense
│   │   ├── [id].tsx              # Edit expense (dynamic route)
│   │   └── _layout.tsx
│   └── +not-found.tsx            # 404 fallback
│
├── src/                          # All application source code
│   ├── components/               # UI components (Atomic Design)
│   │   ├── atoms/                # Smallest building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Text/
│   │   │   │   ├── Text.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Icon/
│   │   │   ├── Input/
│   │   │   ├── Badge/
│   │   │   ├── Card/
│   │   │   ├── Chip/
│   │   │   ├── Divider/
│   │   │   ├── Spinner/
│   │   │   ├── Avatar/
│   │   │   └── index.ts          # Barrel export all atoms
│   │   │
│   │   ├── molecules/            # Combinations of atoms
│   │   │   ├── ExpenseListItem/
│   │   │   │   ├── ExpenseListItem.tsx
│   │   │   │   ├── ExpenseListItem.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── CategoryPicker/
│   │   │   ├── AmountInput/
│   │   │   ├── DateSelector/
│   │   │   ├── SearchBar/
│   │   │   ├── FilterChip/
│   │   │   ├── EmptyState/
│   │   │   ├── ErrorCard/
│   │   │   ├── SnackBar/
│   │   │   └── index.ts
│   │   │
│   │   ├── organisms/            # Complex composites
│   │   │   ├── ExpenseForm/
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   ├── ExpenseForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ExpenseList/
│   │   │   ├── MonthlySummaryCard/
│   │   │   ├── CategoryBreakdown/
│   │   │   ├── SpendingTrendChart/
│   │   │   ├── QuickAddFAB/
│   │   │   ├── FilterBar/
│   │   │   ├── SettingsGroup/
│   │   │   └── index.ts
│   │   │
│   │   ├── templates/            # Screen-level layouts
│   │   │   ├── ScreenContainer/
│   │   │   │   ├── ScreenContainer.tsx
│   │   │   │   └── index.ts
│   │   │   ├── AuthLayout/
│   │   │   ├── TabLayout/
│   │   │   ├── ModalLayout/
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts              # Master barrel export
│   │
│   ├── theme/                    # ★ CENTRALIZED THEME — single source of truth
│   │   ├── colors.ts             # All color palettes (light + dark)
│   │   ├── tokens.ts             # Spacing, radius, shadows, sizing
│   │   ├── typography.ts         # Font families, sizes, weights
│   │   ├── tamagui.config.ts     # Tamagui theme configuration
│   │   ├── animations.ts         # Reanimated animation presets
│   │   └── index.ts              # Barrel export
│   │
│   ├── db/                       # Database layer (Drizzle ORM + SQLite)
│   │   ├── schema/               # Drizzle table definitions
│   │   │   ├── expenses.ts
│   │   │   ├── categories.ts
│   │   │   ├── accounts.ts
│   │   │   └── index.ts
│   │   ├── migrations/           # Versioned SQL migrations
│   │   │   ├── 0001_init.sql
│   │   │   ├── 0002_add_accounts.sql
│   │   │   └── meta/
│   │   ├── client.ts             # SQLite connection + Drizzle instance
│   │   ├── seed.ts               # Default categories + sample data
│   │   └── index.ts
│   │
│   ├── repositories/             # Data access layer (Repository pattern)
│   │   ├── expenses.repo.ts
│   │   ├── categories.repo.ts
│   │   ├── accounts.repo.ts
│   │   └── index.ts
│   │
│   ├── domain/                   # Business logic / use cases
│   │   ├── use-cases/
│   │   │   ├── addExpense.ts
│   │   │   ├── updateExpense.ts
│   │   │   ├── deleteExpense.ts
│   │   │   ├── getMonthlySummary.ts
│   │   │   ├── getCategoryBreakdown.ts
│   │   │   ├── exportCSV.ts
│   │   │   └── index.ts
│   │   ├── validators/
│   │   │   ├── expense.validator.ts
│   │   │   ├── category.validator.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── store/                    # State management (Zustand)
│   │   ├── useExpenseStore.ts
│   │   ├── useCategoryStore.ts
│   │   ├── useFilterStore.ts
│   │   ├── useSettingsStore.ts
│   │   ├── useAuthStore.ts
│   │   └── index.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useExpenses.ts
│   │   ├── useCategories.ts
│   │   ├── useSummary.ts
│   │   ├── useExport.ts
│   │   ├── useAuth.ts
│   │   ├── useThemeMode.ts
│   │   └── index.ts
│   │
│   ├── services/                 # External service integrations
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   ├── storage/
│   │   │   ├── mmkv.ts           # MMKV instance + helpers
│   │   │   ├── secureStore.ts    # Expo SecureStore wrapper
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── lib/                      # Pure utility functions
│   │   ├── format/
│   │   │   ├── currency.ts       # Locale-aware currency formatting
│   │   │   ├── date.ts           # Date formatting helpers
│   │   │   └── index.ts
│   │   ├── uuid.ts               # UUID generation
│   │   ├── constants.ts          # App-wide constants
│   │   └── index.ts
│   │
│   ├── types/                    # Shared TypeScript types/interfaces
│   │   ├── expense.types.ts
│   │   ├── category.types.ts
│   │   ├── account.types.ts
│   │   ├── navigation.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   │
│   └── i18n/                     # Internationalization (future-ready)
│       ├── en.ts
│       ├── config.ts
│       └── index.ts
│
├── assets/                       # Static assets
│   ├── fonts/
│   │   ├── Inter-Regular.ttf
│   │   ├── Inter-Medium.ttf
│   │   ├── Inter-SemiBold.ttf
│   │   └── Inter-Bold.ttf
│   ├── icons/
│   │   └── category-icons/       # Category icon SVGs/PNGs
│   └── images/
│       ├── splash.png
│       ├── icon.png
│       └── adaptive-icon.png
│
├── __tests__/                    # Integration / E2E tests
│   ├── db/
│   │   ├── migrations.test.ts
│   │   └── repositories.test.ts
│   ├── domain/
│   │   └── use-cases.test.ts
│   └── e2e/
│       └── expense-flow.test.ts
│
├── .env.example                  # Environment variable template
├── .env.local                    # Local environment (gitignored)
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── babel.config.js               # Babel config (Tamagui plugin)
├── metro.config.js               # Metro bundler config
├── tamagui.config.ts             # Root Tamagui config (imports from src/theme)
├── drizzle.config.ts             # Drizzle Kit configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── README.md
```

---

## 3) Naming Conventions

| Item | Convention | Example |
|---|---|---|
| **Components** | PascalCase folder + file | `Button/Button.tsx` |
| **Hooks** | `use` prefix, camelCase | `useExpenses.ts` |
| **Stores** | `use` prefix + `Store` suffix | `useExpenseStore.ts` |
| **Repositories** | camelCase + `.repo.ts` | `expenses.repo.ts` |
| **Types** | camelCase + `.types.ts` | `expense.types.ts` |
| **Validators** | camelCase + `.validator.ts` | `expense.validator.ts` |
| **Use Cases** | camelCase verb-first | `addExpense.ts` |
| **DB Schema** | camelCase table name | `expenses.ts` |
| **Migrations** | `NNNN_description.sql` | `0001_init.sql` |
| **Tests** | `*.test.tsx` / `*.test.ts` | `Button.test.tsx` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_NOTE_LENGTH` |

---

## 4) Import Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/theme/*": ["./src/theme/*"],
      "@/db/*": ["./src/db/*"],
      "@/store/*": ["./src/store/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/repositories/*": ["./src/repositories/*"]
    }
  }
}
```

---

## 5) Barrel Export Pattern

Every folder MUST have an `index.ts` that re-exports its public API:

```typescript
// src/components/atoms/index.ts
export { Button } from './Button';
export { Text } from './Text';
export { Icon } from './Icon';
export { Input } from './Input';
export { Badge } from './Badge';
export { Card } from './Card';
export { Chip } from './Chip';
export { Divider } from './Divider';
export { Spinner } from './Spinner';
export { Avatar } from './Avatar';
```

This enables clean imports:

```typescript
import { Button, Text, Card } from '@/components/atoms';
```

---

## 6) Component File Structure (Standard Template)

Every component follows this internal structure:

```typescript
// src/components/atoms/Button/Button.tsx

// 1. Imports
import { styled, GetProps } from 'tamagui';

// 2. Types
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends GetProps<typeof StyledButton> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

// 3. Styled component (Tamagui)
const StyledButton = styled(/* ... */);

// 4. Component
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  ...props
}) => {
  // hooks
  // derived state
  // handlers
  // render
};

// 5. Display name (debugging)
Button.displayName = 'Button';
```

---

## 7) Rules (enforce in code review)

1. **No direct imports from deep paths** — always use barrel exports
2. **No business logic in components** — delegate to hooks or use-cases
3. **No raw SQL in UI/domain** — only via repositories
4. **No hardcoded colors/sizes** — always use theme tokens
5. **No `any` types** — strict TypeScript always
6. **One component per file** — no multi-component files
7. **Tests colocated** — `Button.test.tsx` lives next to `Button.tsx`
8. **Screens are thin** — screens compose organisms, they don't contain logic
