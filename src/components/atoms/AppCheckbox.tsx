import { Checkbox } from '@tamagui/checkbox';
import { Check, Minus } from '@tamagui/lucide-icons';
import { Label, XStack, styled } from 'tamagui';
import type { ComponentProps } from 'react';
import { triggerHaptic, type HapticFeedbackType } from '@/services/haptics';
import { fontSize, fontWeight, radius, space } from '@/theme';

const CheckboxFrame = styled(Checkbox, {
  backgroundColor: '$surface',
  borderColor: '$border',
  borderWidth: 1,
  borderRadius: radius.sm,
  alignItems: 'center',
  justifyContent: 'center',
  hoverStyle: { borderColor: '$borderFocused' },
  pressStyle: { borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
  focusStyle: { borderColor: '$borderFocused' },
});

const CheckboxIndicator = styled(Checkbox.Indicator, {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$primary',
  borderRadius: radius.sm,
});

interface AppCheckboxProps
  extends Omit<ComponentProps<typeof CheckboxFrame>, 'children'> {
  label?: string;
  haptic?: HapticFeedbackType;
  iconSize?: number;
}

export function AppCheckbox({
  label,
  haptic = 'selection',
  iconSize = fontSize.sm,
  onCheckedChange,
  checked,
  defaultChecked,
  disabled,
  size,
  id,
  ...props
}: AppCheckboxProps) {
  const handleCheckedChange = onCheckedChange
    ? (next: Parameters<NonNullable<typeof onCheckedChange>>[0]) => {
        if (!disabled) {
          triggerHaptic(haptic);
        }
        onCheckedChange(next);
      }
    : undefined;
  const isIndeterminate = checked === 'indeterminate';
  const labelOpacity = disabled ? 0.6 : 1;

  return (
    <XStack alignItems="center" gap={space.sm} opacity={labelOpacity}>
      <CheckboxFrame
        id={id}
        size={size ?? '$3'}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        {...props}
      >
        <CheckboxIndicator disablePassStyles>
          {isIndeterminate ? (
            <Minus size={iconSize} color="$textInverse" />
          ) : (
            <Check size={iconSize} color="$textInverse" />
          )}
        </CheckboxIndicator>
      </CheckboxFrame>
      {label ? (
        <Label
          htmlFor={id}
          color="$textSecondary"
          fontSize={fontSize.sm}
          fontWeight={fontWeight.medium}
        >
          {label}
        </Label>
      ) : null}
    </XStack>
  );
}

AppCheckbox.displayName = 'AppCheckbox';
