# UI Changes Tracker — Expense Tracker

**Last updated:** 2026-02-23  
**Purpose:** Track all visual and UI changes made to the app across conversations.

> **Convention:** Add new entries under the current date section at the top (reverse chronological).  
> Never remove previous entries. Categorize each change.

---

## Categories

| Tag | Description |
|---|---|
| `[Layout]` | Screen layouts, spacing, positioning |
| `[Component]` | New or modified UI components |
| `[Theme]` | Colors, fonts, tokens, dark mode |
| `[Navigation]` | Tab bar, routing, screen transitions |
| `[Animation]` | Transitions, micro-animations, gestures |
| `[Accessibility]` | Touch targets, contrast, screen reader labels |

---

## Change Log

<!-- Add new date sections below this line, newest first -->

### 2026-02-23

- `[Component]` Upgraded `AppButton` to wrap Tamagui `Button`, adding tokenized sizing, icon-before/after support, and loading state handling.
- `[Component]` Added `AppCheckbox` + `AppTextArea` and migrated `AppInput` to Tamagui `Input` for form controls.
- `[Component]` Upgraded `AppCard` to wrap Tamagui `Card` with tokenized spacing, radius, and elevation support.
- `[Component]` Added `AppDialog` (Tamagui `Dialog`) and aligned `AppAlertDialog` destructive actions with `AlertDialog.Destructive`.
- `[Component]` Standardized loading spinners to the small Tamagui size via `AppSpinner` defaults.
- `[Component]` History swipe actions now auto-trigger edit (swipe right) and delete confirmation (swipe left) without extra taps.
- `[Animation]` Disabled dialog/toast animations (`animation: null`) to avoid Animated tracking errors.
- `[Component]` Removed History list item bottom border overrides to avoid native style update crashes.
- `[Component]` Simplified `AppDivider` to a 1px background bar to avoid native border width crashes.

### 2026-02-21

- `[Navigation]` Switched `(tabs)` layout to Expo Router `Tabs` with ripple + haptic feedback for clearer bottom-nav selection.
- `[Layout]` Consolidated History filters into a sticky chip row with a unified filter sheet and search mode toggle.
- `[Component]` Tightened History list density with divider rows and configurable spacing.
- `[Animation]` Added tab icon bounce and animated active-tab background feedback on selection.
- `[Animation]` Tuned tab icon bounce to a spring animation for a snappier scale-up/return feel.
- `[Layout]` Removed reserved vertical space under the History header in search mode by collapsing content padding/gap.
- `[Layout]` Restored History filter chips after dismissing search by syncing search blur with list header updates.
- `[Component]` **Tamagui Upgrade:** Replaced `AppDivider` (custom XStack) with `@tamagui/separator` — auto-themed, accessible.
- `[Component]` **Tamagui Upgrade:** Replaced `AppAvatar` (custom Image+fallback) with `@tamagui/avatar` — built-in loading + fallback.
- `[Component]` **Tamagui Upgrade:** Replaced `AppSpinner` (RN ActivityIndicator) with Tamagui `Spinner` — uses theme tokens.
- `[Component]` **Tamagui Upgrade:** Replaced all `Switch` from `react-native` with `@tamagui/switch` in SettingsGroup and Categories — themed, animated thumb.
- `[Component]` **Tamagui Upgrade:** Created `AppAlertDialog` organism with `useAlertDialog` hook — replaces all 16+ `Alert.alert()` calls across 8 screens.
- `[Component]` **Tamagui Upgrade:** Created `AppToast` organism with `@tamagui/toast` — success/error/info/warning variants with auto-dismiss.
- `[Component]` **Tamagui Upgrade:** Added `ToastProvider` + `ToastViewport` to root `_layout.tsx`.
- `[Component]` **Tamagui Upgrade:** Added `@tamagui/label` to SettingsGroup section titles for accessibility binding.

---

### 2026-02-20

- `[Navigation]` Moved Categories to a standalone route (`/categories`) so tab swipes no longer navigate into category management; Settings now links to `/categories`.
- `[Component]` History now uses a header search toggle and a multi-select category filter sheet for refined filtering.
- `[Layout]` History filters now scroll with the list, include a date-range picker, and show selected category chips for quick edits.

---

### 2026-02-17

- `[Navigation]` Enabled swipeable tab navigation with bottom-positioned material tabs and animated slide transitions.
- `[Layout]` Pinned tab headers to safe area while content scrolls (Home, History, Insights, Settings, Categories).
- `[Component]` History filters now show the date picker only when a single day is selected; no default "Today" preselect.

---

## Summary

| Category | Total Changes |
|---|---|
| Layout | 5 |
| Component | 11 |
| Theme | 0 |
| Navigation | 3 |
| Animation | 2 |
| Accessibility | 0 |
