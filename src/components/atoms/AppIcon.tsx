import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useTheme } from 'tamagui';

type AppIconProps = ComponentProps<typeof Ionicons>;

export function AppIcon({ color, size = 18, ...props }: AppIconProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.textPrimary?.val;

  return <Ionicons color={resolvedColor} size={size} {...props} />;
}
