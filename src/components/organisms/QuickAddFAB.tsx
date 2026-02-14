import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { triggerHaptic, type HapticFeedbackType } from '../../services/haptics';
import { shadows } from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

const FabContainer = styled(XStack, {
  backgroundColor: '$primary',
  borderRadius: 9999,
  height: 56,
  minWidth: 56,
  paddingHorizontal: 18,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  ...shadows.md,
  pressStyle: { scale: 0.96 },
  variants: {
    floating: {
      true: {
        position: 'absolute',
        right: 20,
        bottom: 20,
      },
    },
  } as const,
  defaultVariants: {
    floating: true,
  },
});

interface QuickAddFABProps extends ComponentProps<typeof FabContainer> {
  label?: string;
  iconName?: IconName;
  haptic?: HapticFeedbackType;
}

export function QuickAddFAB({
  label = 'Add Expense',
  iconName = 'add',
  haptic = 'selection',
  onPress,
  disabled,
  ...props
}: QuickAddFABProps) {
  const theme = useTheme();
  const handlePress = onPress
    ? (...args: Parameters<NonNullable<typeof onPress>>) => {
        if (!disabled) {
          triggerHaptic(haptic);
        }
        onPress(...args);
      }
    : undefined;

  return (
    <FabContainer onPress={handlePress} disabled={disabled} {...props}>
      <Ionicons name={iconName} size={22} color={theme.textInverse?.val} />
      {label ? (
        <Text color="$textInverse" fontSize={14} fontWeight="600">
          {label}
        </Text>
      ) : null}
    </FabContainer>
  );
}
