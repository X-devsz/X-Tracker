import type { ComponentProps } from 'react';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { AppInput, AppTextArea } from '@/components/atoms';

const fieldShellBase = {
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  alignItems: 'center',
  height: 52,
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
};

const InputShell = styled(XStack, fieldShellBase);

const TextAreaShell = styled(XStack, {
  ...fieldShellBase,
  alignItems: 'flex-start',
  paddingVertical: 12,
  minHeight: 100,
  height: 'auto',
});

interface InputFieldProps extends ComponentProps<typeof AppInput> {
  label: string;
  error?: string;
}

export function InputField({ label, error, multiline, ...props }: InputFieldProps) {
  const theme = useTheme();
  const Shell = multiline ? TextAreaShell : InputShell;
  const placeholderColor = props.placeholderTextColor ?? theme.textTertiary?.val;

  return (
    <YStack gap={6}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {label}
      </Text>
      <Shell error={Boolean(error)}>
        {multiline ? (
          <AppTextArea
            placeholderTextColor={placeholderColor}
            multiline={multiline}
            {...props}
          />
        ) : (
          <AppInput
            placeholderTextColor={placeholderColor}
            multiline={multiline}
            {...props}
          />
        )}
      </Shell>
      {error ? (
        <Text color="$danger" fontSize={12}>
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}
