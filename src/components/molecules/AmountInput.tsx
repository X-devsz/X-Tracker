import { Text, XStack, YStack, styled } from 'tamagui';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { AppInput } from '../atoms';

const AmountContainer = styled(YStack, {
  backgroundColor: '$surface',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 16,
  paddingVertical: 14,
  gap: 8,
  animation: 'fast',
  pressStyle: { borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
  variants: {
    error: {
      true: {
        borderColor: '$borderError',
        pressStyle: { borderColor: '$borderError', backgroundColor: '$surfaceHover' },
      },
    },
  } as const,
});

const AmountField = styled(AppInput, {
  fontSize: 32,
  fontWeight: '700',
  height: 42,
  letterSpacing: -0.5,
});

interface AmountInputProps
  extends Omit<ComponentProps<typeof AppInput>, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeValue: (nextValue: string) => void;
  currencySymbol?: string;
  locale?: string;
  showFormatted?: boolean;
  helperText?: string;
  error?: string;
  maxDecimals?: number;
}

const normalizeValue = (text: string, maxDecimals: number) => {
  const sanitized = text.replace(/[^0-9.]/g, '');
  const parts = sanitized.split('.');
  const whole = parts[0] ?? '';
  const decimals = parts[1] ? parts[1].slice(0, maxDecimals) : '';

  return decimals.length > 0 ? `${whole}.${decimals}` : whole;
};

const formatValue = (value: string, locale?: string) => {
  if (!value) return '';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numeric);
  } catch {
    return value;
  }
};

export function AmountInput({
  label = 'Amount',
  value,
  onChangeValue,
  currencySymbol = '$',
  locale,
  showFormatted = true,
  helperText,
  error,
  maxDecimals = 2,
  placeholder = '0.00',
  ...props
}: AmountInputProps) {
  const displayValue = useMemo(
    () => (showFormatted ? formatValue(value, locale) : value),
    [value, locale, showFormatted],
  );

  return (
    <YStack gap={8}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {label}
      </Text>
      <AmountContainer error={Boolean(error)}>
        <XStack alignItems="center" gap={8}>
          <Text color="$textSecondary" fontSize={16} fontWeight="600">
            {currencySymbol}
          </Text>
          <AmountField
            keyboardType="decimal-pad"
            placeholder={placeholder}
            value={displayValue}
            onChangeText={(next) => onChangeValue(normalizeValue(next, maxDecimals))}
            {...props}
          />
        </XStack>
        {error ? (
          <Text color="$danger" fontSize={12}>
            {error}
          </Text>
        ) : helperText ? (
          <Text color="$textTertiary" fontSize={12}>
            {helperText}
          </Text>
        ) : null}
      </AmountContainer>
    </YStack>
  );
}
