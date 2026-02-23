import { ActivityIndicator } from 'react-native';
import type { ComponentProps } from 'react';
import { useTheme } from 'tamagui';

type AppSpinnerProps = ComponentProps<typeof ActivityIndicator>;

export function AppSpinner({ color, size = 'small', ...props }: AppSpinnerProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.primary?.val;

  return <ActivityIndicator color={resolvedColor} size={size} {...props} />;
}
