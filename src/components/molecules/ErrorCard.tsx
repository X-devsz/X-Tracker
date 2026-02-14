import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { AppButton, AppCard } from '../atoms';

interface ErrorCardProps extends ComponentProps<typeof AppCard> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorCard({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  ...props
}: ErrorCardProps) {
  const theme = useTheme();

  return (
    <AppCard
      borderColor="$borderError"
      backgroundColor="$surface"
      {...props}
    >
      <XStack alignItems="center" gap={10}>
        <Ionicons name="alert-circle" size={20} color={theme.danger?.val} />
        <Text color="$textPrimary" fontSize={15} fontWeight="600">
          {title}
        </Text>
      </XStack>
      <Text color="$textSecondary" fontSize={13}>
        {message}
      </Text>
      {onRetry ? (
        <AppButton label={retryLabel} tone="secondary" onPress={onRetry} />
      ) : null}
    </AppCard>
  );
}
