# Bug Fix Tracker — Expense Tracker

**Last updated:** 2026-02-21  
**Purpose:** Track all bugs identified and fixes applied across the project.  

> **Convention:** Add new entries at the top (reverse chronological). Never remove previous entries.

---

## Format

Each bug entry should include:

| Field | Description |
|---|---|
| **Bug ID** | Auto-increment: `BUG-001`, `BUG-002`, etc. |
| **Date** | Date the bug was identified/fixed |
| **Description** | What was broken or incorrect |
| **Root Cause** | Why it happened |
| **Fix Applied** | What was changed to resolve it |
| **Files Changed** | List of files modified |
| **Related Feature** | Feature Tracker ID (e.g., `F-012.3`) if applicable |
| **Severity** | `Critical` / `High` / `Medium` / `Low` |

---

## Bug Log

<!-- Add new bugs below this line, newest first -->

### BUG-006 - npm ci fails due to out-of-sync lock file

| Field | Value |
|---|---|
| **Date** | 2026-02-22 |
| **Description** | `npm ci --include=dev` failed because `react-refresh@0.18.0` was missing from the lock file; eslint peer warnings appeared with eslint 10. |
| **Root Cause** | `package.json` changes were not followed by a lock file regeneration, and eslint was ahead of the eslint-config-expo peer range. |
| **Fix Applied** | Added `react-refresh` to devDependencies, downgraded eslint to `^9.39.3`, and regenerated `package-lock.json`. |
| **Files Changed** | `package.json`, `package-lock.json` |
| **Related Feature** | F-000.7 |
| **Severity** | Medium |

### BUG-005 - AppAlertDialog animation and button prop type errors

| Field | Value |
|---|---|
| **Date** | 2026-02-21 |
| **Description** | AppAlertDialog failed type-checking due to invalid animation names and unsupported AppButton props. |
| **Root Cause** | Used a non-existent `quick` animation preset and passed `variant`/`size`/children props that AppButton does not support. |
| **Fix Applied** | Swapped to the `fast` animation preset, aligned styles with theme tokens, and updated AppButton usage to `tone` + `label`. |
| **Files Changed** | `src/components/organisms/AppAlertDialog.tsx` |
| **Related Feature** | N/A |
| **Severity** | Medium |

### BUG-004 - History chips not returning after search dismissal

| Field | Value |
|---|---|
| **Date** | 2026-02-21 |
| **Description** | Closing search in History sometimes left the filter chips hidden. |
| **Root Cause** | Search dismissal didn't always trigger a list header refresh, and blur events weren't handled to exit search. |
| **Fix Applied** | Added search blur handling and forced list header updates via `extraData` on the list. |
| **Files Changed** | `src/app/(tabs)/history.tsx`, `src/components/organisms/ExpenseList.tsx` |
| **Related Feature** | F-030.4 |
| **Severity** | Low |

### BUG-003 - History search mode left blank space below header

| Field | Value |
|---|---|
| **Date** | 2026-02-21 |
| **Description** | History search mode showed an empty block under the header after hiding chips. |
| **Root Cause** | ScreenLayout content padding and gap stayed enabled even when the list header was removed. |
| **Fix Applied** | Collapsed content padding and gap in search mode so the list starts directly under the header divider. |
| **Files Changed** | `src/app/(tabs)/history.tsx` |
| **Related Feature** | F-030.4 |
| **Severity** | Low |

### BUG-002 - Tabs/history type errors after navigation update

| Field | Value |
|---|---|
| **Date** | 2026-02-21 |
| **Description** | TypeScript errors appeared in the tabs layout and history screen after the navigation/filters refresh. |
| **Root Cause** | `Tabs` options still included a top-tab-only flag, tab bar button props forwarded an incompatible ref, and Tamagui `$` tokens were used where numeric tokens were required. |
| **Fix Applied** | Removed the unsupported tab option, mapped tab button props explicitly, replaced `$` spacing/radius values with token numbers, and added a typed tint helper for category icons. |
| **Files Changed** | `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/history.tsx` |
| **Related Feature** | F-002.2, F-030.4 |
| **Severity** | Medium |

### BUG-001 - History chips leave empty space after closing search

| Field | Value |
|---|---|
| **Date** | 2026-02-21 |
| **Description** | History filter chips disappeared visually but their layout space stayed reserved after toggling search. |
| **Root Cause** | Search visibility was controlled separately from chip rendering, leaving the list header mounted without content. |
| **Fix Applied** | Consolidated search state into a single mode and unmounted the chip header in search mode; ensured exit clears search state. |
| **Files Changed** | `src/app/(tabs)/history.tsx` |
| **Related Feature** | F-030.4 |
| **Severity** | Low |

---

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 3 |
| **Total** | **5** |
