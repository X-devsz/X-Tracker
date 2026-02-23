import { Button, Spinner, styled } from 'tamagui';
import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import { triggerHaptic, type HapticFeedbackType } from '@/services/haptics';
import { fontSize, fontWeight, radius, size, space } from '@/theme';

const ButtonContainer = styled(Button, {
  minHeight: size.xl,
  borderRadius: radius.md,
  paddingHorizontal: space.lg,
  paddingVertical: space.sm,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space.sm,
  animation: 'bouncy',
  pressStyle: { scale: 0.98 },
  variants: {
    tone: {
      primary: {
        backgroundColor: '$primary',
        borderColor: '$primary',
        pressStyle: { scale: 0.98, backgroundColor: '$primaryPressed' },
      },
      secondary: {
        backgroundColor: '$surface',
        borderColor: '$border',
        borderWidth: 1,
        pressStyle: { scale: 0.98, backgroundColor: '$surfaceHover' },
      },
      danger: {
        backgroundColor: '$danger',
        borderColor: '$danger',
        pressStyle: { scale: 0.98, backgroundColor: '$dangerLight' },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 1,
        pressStyle: { scale: 0.98, backgroundColor: '$surfaceHover' },
        hoverStyle: { backgroundColor: '$surface' },
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,
  defaultVariants: {
    tone: 'primary',
  },
});

type ButtonTone = ComponentProps<typeof ButtonContainer>['tone'];

interface AppButtonProps
  extends Omit<ComponentProps<typeof ButtonContainer>, 'children' | 'icon' | 'iconAfter'> {
  label: string;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  iconSize?: number;
  haptic?: HapticFeedbackType;
  isLoading?: boolean;
}

const applyIconSize = (icon: ReactNode | undefined, iconSize?: number) => {
  if (!icon || !iconSize) return icon ?? null;
  if (!isValidElement(icon)) return icon;
  return cloneElement(icon as ReactElement<{ size?: number }>, {
    size: iconSize,
  });
};

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
  iconAfter,
  iconSize,
  tone = 'primary',
  haptic,
  onPress,
  disabled,
  isLoading,
  opacity,
  ...props
}: AppButtonProps) {
  const resolvedHaptic =
    haptic ?? (tone === 'danger' ? 'warning' : 'selection');
  const isDisabled = disabled || isLoading;
  const labelColor = getLabelColor(tone);
  const handlePress = onPress
    ? (...args: Parameters<NonNullable<typeof onPress>>) => {
        if (!isDisabled) {
          triggerHaptic(resolvedHaptic);
        }
        onPress(...args);
      }
    : undefined;
  const resolvedOpacity = isDisabled ? 0.6 : opacity;
  const leadingIcon = applyIconSize(icon, iconSize);
  const trailingIcon = applyIconSize(iconAfter, iconSize);

  return (
    <ButtonContainer
      tone={tone}
      onPress={handlePress}
      disabled={isDisabled}
      opacity={resolvedOpacity}
      {...props}
    >
      {isLoading ? (
        <Spinner size="small" color={labelColor} />
      ) : (
        <>
          {leadingIcon ? <Button.Icon>{leadingIcon}</Button.Icon> : null}
          <Button.Text
            color={labelColor}
            fontSize={fontSize.md}
            fontWeight={fontWeight.semibold}
          >
            {label}
          </Button.Text>
          {trailingIcon ? <Button.Icon>{trailingIcon}</Button.Icon> : null}
        </>
      )}
    </ButtonContainer>
  );
}

AppButton.displayName = 'AppButton';
