import type { ReactNode } from 'react';
import { Text, YStack } from 'tamagui';
import { AppButton } from '../atoms';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <YStack alignItems="center" justifyContent="center" gap={12} paddingVertical={32}>
      {icon}
      <YStack alignItems="center" gap={4}>
        <Text color="$textPrimary" fontSize={16} fontWeight="600">
          {title}
        </Text>
        {description ? (
          <Text color="$textSecondary" fontSize={13} textAlign="center">
            {description}
          </Text>
        ) : null}
      </YStack>
      {actionLabel ? (
        <AppButton label={actionLabel} onPress={onAction} tone="secondary" />
      ) : null}
    </YStack>
  );
}
