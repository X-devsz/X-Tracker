/**
 * Expense Tracker — Design Tokens
 *
 * Spacing, sizing, border-radius, z-index, and shadow presets.
 * 4px base grid system.
 */

export const space = {
  true: 16,    // ★ Required by Tamagui — default spacing value
  0: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const size = {
  true: 44,   // ★ Required by Tamagui — default size (44px min touch target)
  xs: 20,
  sm: 28,
  md: 36,
  lg: 44,     // Minimum touch target (accessibility)
  xl: 52,
  '2xl': 64,
  '3xl': 80,
  '4xl': 120,
} as const;

export const radius = {
  true: 12,   // ★ Required by Tamagui — default
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

/** Use directly in styles: `borderRadius: RADIUS_FULL` */
export const RADIUS_FULL = 9999;

export const zIndex = {
  true: 0,     // ★ Required by Tamagui — default
  xs: 1,       // Cards
  sm: 10,      // Sticky headers
  md: 50,      // Modals
  lg: 100,     // Toasts
  xl: 200,     // Overlays
} as const;

export const shadows = {
  sm: {
    shadowColor: '$cardShadow',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '$cardShadow',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  lg: {
    shadowColor: '$cardShadow',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
  },
} as const;

