import { styled, XStack } from 'tamagui';
import type { ComponentProps, ReactNode } from 'react';
import { triggerHaptic, type HapticFeedbackType } from '../../services/haptics';

const IconButton = styled(XStack, {
  width: 44,
  height: 44,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fast',
  pressStyle: { scale: 0.96 },
  variants: {
    tone: {
      soft: {
        backgroundColor: '$primaryLight',
      },
      surface: {
        backgroundColor: '$surface',
        borderWidth: 1,
        borderColor: '$border',
      },
      primary: {
        backgroundColor: '$primary',
      },
    },
  } as const,
  defaultVariants: {
    tone: 'surface',
  },
});

interface AppIconButtonProps extends ComponentProps<typeof IconButton> {
  icon: ReactNode;
  haptic?: HapticFeedbackType;
}

export function AppIconButton({
  icon,
  haptic = 'selection',
  onPress,
  disabled,
  ...props
}: AppIconButtonProps) {
  const handlePress = onPress
    ? (...args: Parameters<NonNullable<typeof onPress>>) => {
        if (!disabled) {
          triggerHaptic(haptic);
        }
        onPress(...args);
      }
    : undefined;

  return (
    <IconButton onPress={handlePress} disabled={disabled} {...props}>
      {icon}
    </IconButton>
  );
}
