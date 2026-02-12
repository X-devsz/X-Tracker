/**
 * Expense Tracker — Color Palette
 *
 * ★ SINGLE SOURCE OF TRUTH for all colors in the app.
 * Change values here → entire app updates (light + dark modes).
 */

// ─── Raw Palette ───────────────────────────────────────────
export const palette = {
  // Primary (Indigo)
  primary50: '#EEF2FF',
  primary100: '#E0E7FF',
  primary200: '#C7D2FE',
  primary300: '#A5B4FC',
  primary400: '#818CF8',
  primary500: '#6366F1', // ★ Main brand color
  primary600: '#4F46E5',
  primary700: '#4338CA',
  primary800: '#3730A3',
  primary900: '#312E81',

  // Success (Emerald)
  success50: '#ECFDF5',
  success100: '#D1FAE5',
  success400: '#34D399',
  success500: '#10B981',
  success600: '#059669',

  // Warning (Amber)
  warning50: '#FFFBEB',
  warning100: '#FEF3C7',
  warning400: '#FBBF24',
  warning500: '#F59E0B',
  warning600: '#D97706',

  // Danger (Red)
  danger50: '#FEF2F2',
  danger100: '#FEE2E2',
  danger400: '#F87171',
  danger500: '#EF4444',
  danger600: '#DC2626',

  // Neutral (Gray)
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  gray950: '#0F0F14',

  // Absolute
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ─── Category Colors ───────────────────────────────────────
export const categoryColors = {
  food: '#F97316',         // Orange
  transport: '#3B82F6',    // Blue
  shopping: '#EC4899',     // Pink
  bills: '#8B5CF6',        // Violet
  health: '#10B981',       // Emerald
  entertainment: '#F59E0B', // Amber
  education: '#06B6D4',    // Cyan
  other: '#6B7280',        // Gray
} as const;

// ─── Semantic Tokens — Light Theme ─────────────────────────
export const lightColors = {
  // Backgrounds
  background: palette.white,
  surface: '#F8F9FC',
  surfaceHover: palette.gray100,
  surfacePressed: palette.gray200,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray500,
  textTertiary: palette.gray400,
  textInverse: palette.white,
  textLink: palette.primary500,

  // Brand
  primary: palette.primary500,
  primaryHover: palette.primary600,
  primaryPressed: palette.primary700,
  primaryLight: palette.primary50,

  // Status
  success: palette.success500,
  successLight: palette.success50,
  warning: palette.warning500,
  warningLight: palette.warning50,
  danger: palette.danger500,
  dangerLight: palette.danger50,

  // Borders
  border: palette.gray200,
  borderFocused: palette.primary500,
  borderError: palette.danger500,

  // Components
  cardBackground: palette.white,
  cardBorder: palette.gray200,
  cardShadow: 'rgba(0, 0, 0, 0.06)',
  inputBackground: palette.white,
  inputBorder: palette.gray300,

  // Tab Bar
  tabBarBackground: palette.white,
  tabBarBorder: palette.gray200,
  tabBarActive: palette.primary500,
  tabBarInactive: palette.gray400,

  // Modal
  overlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: palette.white,
} as const;

// ─── Semantic Tokens — Dark Theme ──────────────────────────
export const darkColors = {
  // Backgrounds
  background: palette.gray950,
  surface: '#1A1A24',
  surfaceHover: '#242430',
  surfacePressed: '#2E2E3A',

  // Text
  textPrimary: palette.gray100,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.gray900,
  textLink: palette.primary400,

  // Brand
  primary: palette.primary400,
  primaryHover: palette.primary300,
  primaryPressed: palette.primary500,
  primaryLight: '#1E1B4B',

  // Status
  success: palette.success400,
  successLight: '#064E3B',
  warning: palette.warning400,
  warningLight: '#78350F',
  danger: palette.danger400,
  dangerLight: '#7F1D1D',

  // Borders
  border: '#2E2E3A',
  borderFocused: palette.primary400,
  borderError: palette.danger400,

  // Components
  cardBackground: '#1A1A24',
  cardBorder: '#2E2E3A',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  inputBackground: '#1A1A24',
  inputBorder: '#3A3A4A',

  // Tab Bar
  tabBarBackground: '#0F0F14',
  tabBarBorder: '#1E1E28',
  tabBarActive: palette.primary400,
  tabBarInactive: palette.gray500,

  // Modal
  overlay: 'rgba(0, 0, 0, 0.7)',
  modalBackground: '#1A1A24',
} as const;
