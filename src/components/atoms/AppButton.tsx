import { styled, Text, XStack } from 'tamagui';
import type { ComponentProps, ReactNode } from 'react';
import { triggerHaptic, type HapticFeedbackType } from '../../services/haptics';

const ButtonContainer = styled(XStack, {
  height: 52,
  borderRadius: 14,
  paddingHorizontal: 18,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  animation: 'bouncy',
  pressStyle: { scale: 0.98 },
  variants: {
    tone: {
      primary: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
      secondary: {
        backgroundColor: '$surface',
        borderColor: '$border',
        borderWidth: 1,
      },
      danger: {
        backgroundColor: '$danger',
        borderColor: '$danger',
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 1,
        pressStyle: { scale: 0.98, backgroundColor: '$surfaceHover' },
        hoverStyle: { backgroundColor: '$surface' },
      },
    },
  } as const,
  defaultVariants: {
    tone: 'primary',
  },
});

type ButtonTone = ComponentProps<typeof ButtonContainer>['tone'];

interface AppButtonProps extends ComponentProps<typeof ButtonContainer> {
  label: string;
  icon?: ReactNode;
  haptic?: HapticFeedbackType;
}

const getLabelColor = (tone?: ButtonTone) => {
  switch (tone) {
    case 'secondary':
      return '$textPrimary';
    case 'ghost':
      return '$textPrimary';
    case 'danger':
      return '$textInverse';
    case 'primary':
    default:
      return '$textInverse';
  }
};

export function AppButton({
  label,
  icon,
  tone = 'primary',
  haptic,
  onPress,
  disabled,
  ...props
}: AppButtonProps) {
  const resolvedHaptic =
    haptic ?? (tone === 'danger' ? 'warning' : 'selection');
  const handlePress = onPress
    ? (...args: Parameters<NonNullable<typeof onPress>>) => {
        if (!disabled) {
          triggerHaptic(resolvedHaptic);
        }
        onPress(...args);
      }
    : undefined;

  return (
    <ButtonContainer
      tone={tone}
      onPress={handlePress}
      disabled={disabled}
      {...props}
    >
      {icon}
      <Text color={getLabelColor(tone)} fontSize={15} fontWeight="600">
        {label}
      </Text>
    </ButtonContainer>
  );
}
