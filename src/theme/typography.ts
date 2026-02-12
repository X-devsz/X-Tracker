/**
 * Expense Tracker — Typography System
 *
 * Inter font family with defined size scale and text style presets.
 */

export const fontFamily = {
  heading: 'Inter',
  body: 'Inter',
  mono: 'SpaceMono',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 42,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
} as const;

/**
 * Pre-built text style presets for components.
 */
export const textStyles = {
  h1: { fontSize: fontSize['4xl'], fontWeight: fontWeight.bold, lineHeight: lineHeight['4xl'], letterSpacing: letterSpacing.tight },
  h2: { fontSize: fontSize['3xl'], fontWeight: fontWeight.bold, lineHeight: lineHeight['3xl'], letterSpacing: letterSpacing.tight },
  h3: { fontSize: fontSize['2xl'], fontWeight: fontWeight.semibold, lineHeight: lineHeight['2xl'] },
  h4: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, lineHeight: lineHeight.xl },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: lineHeight.md },
  bodySm: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, lineHeight: lineHeight.sm },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, lineHeight: lineHeight.sm },
  caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular, lineHeight: lineHeight.xs },
  button: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, lineHeight: lineHeight.md },
  amount: { fontSize: fontSize['4xl'], fontWeight: fontWeight.bold, lineHeight: lineHeight['4xl'], letterSpacing: letterSpacing.tight },
  amountSm: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, lineHeight: lineHeight.xl },
} as const;
