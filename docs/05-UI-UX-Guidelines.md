# UI/UX Guidelines — Modern, Consistent, Accessible

**Last updated:** 2026-02-10

## 1) Product UI goals
- Fast expense entry
- Minimal cognitive load
- Clear summaries, not “finance dashboards”
- Consistency across screens
- Accessibility by default

## 2) Information architecture (MVP)
- **Home**: total spend (month), quick add, recent list
- **Add Expense**: amount keypad, category picker, date, note
- **History**: list + filters (month/category/search)
- **Insights**: simple charts (category split, trend)
- **Settings**: currency, theme, export, account

## 3) Design system rules
- Spacing scale (4/8/12/16/24/32)
- Typography scale:
  - Title, subtitle, body, caption
- Color tokens (semantic):
  - background, surface, text-primary, text-secondary, danger, success
- Component states:
  - default, loading, disabled, error, empty

## 4) UX patterns (what prevents bad reviews)
- Always show: loading, empty state, clear error + recovery
- Never show “Something went wrong” without next steps.
- Inputs:
  - inline validation
  - preserve user input after errors
- Deletion:
  - undo/snackbar for 5–10 seconds (recommended)

## 5) Expense entry (the app’s core)
- Amount input:
  - keypad
  - formatting (thousands separators)
  - store minor units internally
- Category selection:
  - favorites/recent categories at top
  - avoid deep scrolling
- Date selection:
  - quick presets (Today, Yesterday)
- Default choices:
  - last used category and payment method

## 6) Accessibility requirements
- Touch targets ≥ 44px
- Support large text
- Screen reader labels for:
  - buttons, icons, chart summaries
- Contrast meets WCAG AA

## 7) Localization and formatting
- Locale-based formatting for:
  - currency
  - dates
- No hard-coded strings (use i18n)

## 8) UI performance
- Virtualize lists
- Avoid heavy re-renders
- Cache computed summaries per screen session
