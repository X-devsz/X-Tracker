import { Spinner } from 'tamagui';
import type { ComponentProps } from 'react';

/**
 * AppSpinner — Tamagui Spinner wrapper
 * Replaces React Native ActivityIndicator with Tamagui Spinner.
 * Uses $color tokens and Tamagui animation driver for consistent theming.
 */

type AppSpinnerProps = ComponentProps<typeof Spinner>;

export function AppSpinner({ color = '$primary', size = 'small', ...props }: AppSpinnerProps) {
  return <Spinner color={color} size={size} {...props} />;
}

AppSpinner.displayName = 'AppSpinner';
