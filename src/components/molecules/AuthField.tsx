import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { AppInput } from '../atoms';

type IconName = keyof typeof Ionicons.glyphMap;

const FieldContainer = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 14,
  alignItems: 'center',
  gap: 10,
  height: 52,
  animation: 'fast',
  pressStyle: { borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
});

interface AuthFieldProps extends ComponentProps<typeof AppInput> {
  label: string;
  icon: IconName;
}

export function AuthField({ label, icon, ...props }: AuthFieldProps) {
  const theme = useTheme();

  return (
    <YStack gap={6}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {label}
      </Text>
      <FieldContainer>
        <Ionicons name={icon} size={18} color={theme.textTertiary?.val} />
        <AppInput
          placeholderTextColor={theme.textTertiary?.val}
          {...props}
        />
      </FieldContainer>
    </YStack>
  );
}
