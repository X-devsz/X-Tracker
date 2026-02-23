import { styled, Text, XStack } from 'tamagui';
import type { ComponentProps, ReactNode } from 'react';
import { triggerHaptic, type HapticFeedbackType } from '../../services/haptics';

const ChipContainer = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: '$border',
  alignItems: 'center',
  gap: 6,
  animation: 'fast',
  pressStyle: { scale: 0.98, backgroundColor: '$surfaceHover' },
  variants: {
    active: {
      true: {
        backgroundColor: '$primaryLight',
        borderColor: '$primary',
      },
    },
  } as const,
});

interface AppChipProps extends ComponentProps<typeof ChipContainer> {
  label: string;
  icon?: ReactNode;
  haptic?: HapticFeedbackType;
}

export function AppChip({
  label,
  icon,
  active,
  haptic = 'selection',
  onPress,
  disabled,
  ...props
}: AppChipProps) {
  const handlePress = onPress
    ? (...args: Parameters<NonNullable<typeof onPress>>) => {
        if (!disabled) {
          triggerHaptic(haptic);
        }
        onPress(...args);
      }
    : undefined;

  return (
    <ChipContainer
      active={active}
      onPress={handlePress}
      disabled={disabled}
      {...props}
    >
      {icon}
      <Text
        color={active ? '$primary' : '$textSecondary'}
        fontSize={13}
        fontWeight={active ? '600' : '500'}
      >
        {label}
      </Text>
    </ChipContainer>
  );
}
