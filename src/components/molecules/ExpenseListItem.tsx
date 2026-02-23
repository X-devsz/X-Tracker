import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { AppCard } from '../atoms';

type IconName = keyof typeof Ionicons.glyphMap;

const IconBadge = styled(YStack, {
  width: 44,
  height: 44,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
});

interface ExpenseListItemProps extends ComponentProps<typeof AppCard> {
  title: string;
  category: string;
  amount: number | string;
  date: string;
  note?: string;
  currencySymbol?: string;
  iconName?: IconName;
  iconColor?: string;
  iconBackgroundColor?: string;
}

export function ExpenseListItem({
  title,
  category,
  amount,
  date,
  note,
  currencySymbol = '$',
  iconName = 'receipt-outline',
  iconColor,
  iconBackgroundColor,
  onPress,
  ...props
}: ExpenseListItemProps) {
  const theme = useTheme();
  const resolvedIconColor = iconColor ?? theme.primary?.val;
  const resolvedIconBackground = iconBackgroundColor ?? theme.primaryLight?.val;

  return (
    <AppCard pressable={Boolean(onPress)} onPress={onPress} {...props}>
      <XStack alignItems="center" justifyContent="space-between" gap={12}>
        <XStack alignItems="center" gap={12} flex={1}>
          <IconBadge backgroundColor={resolvedIconBackground}>
            <Ionicons name={iconName} size={22} color={resolvedIconColor} />
          </IconBadge>
          <YStack gap={2} flex={1}>
            <Text color="$textPrimary" fontSize={15} fontWeight="600">
              {title}
            </Text>
            <Text color="$textSecondary" fontSize={12} numberOfLines={1}>
              {category}
              {note ? ` - ${note}` : ''}
            </Text>
          </YStack>
        </XStack>
        <YStack alignItems="flex-end" gap={2}>
          <Text color="$textPrimary" fontSize={15} fontWeight="700">
            {currencySymbol}
            {amount}
          </Text>
          <Text color="$textTertiary" fontSize={11}>
            {date}
          </Text>
        </YStack>
      </XStack>
    </AppCard>
  );
}
