import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { AppBadge, AppCard, AppSpinner } from '../atoms';

const SummaryCard = styled(AppCard, {
  backgroundColor: '$primary',
  borderColor: 'rgba(255,255,255,0.15)',
  padding: 20,
  gap: 12,
  shadowColor: '$cardShadow',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 1,
  shadowRadius: 18,
  elevation: 8,
});

interface MonthlySummaryCardProps extends ComponentProps<typeof SummaryCard> {
  title?: string;
  amount: number | string;
  currencySymbol?: string;
  changePercent?: number;
  changeLabel?: string;
  isLoading?: boolean;
}

const formatChange = (value?: number) => {
  if (value === undefined || value === null) return '0%';
  const absValue = Math.abs(value);
  return `${absValue.toFixed(1)}%`;
};

export function MonthlySummaryCard({
  title = 'Total Spent This Month',
  amount,
  currencySymbol = '$',
  changePercent,
  changeLabel = 'vs last month',
  isLoading,
  ...props
}: MonthlySummaryCardProps) {
  const theme = useTheme();
  const isPositive = typeof changePercent === 'number' ? changePercent >= 0 : true;
  const badgeTone = changePercent === undefined ? 'neutral' : isPositive ? 'success' : 'danger';
  const trendIcon = isPositive ? 'trending-up' : 'trending-down';

  return (
    <SummaryCard elevated {...props}>
      <Text color="$textInverse" fontSize={12} fontWeight="600" opacity={0.8}>
        {title}
      </Text>
      {isLoading ? (
        <XStack alignItems="center" gap={10}>
          <AppSpinner color={theme.textInverse?.val} />
          <Text color="$textInverse" fontSize={16} fontWeight="600">
            Loading summary...
          </Text>
        </XStack>
      ) : (
        <Text color="$textInverse" fontSize={34} fontWeight="700">
          {currencySymbol}
          {amount}
        </Text>
      )}
      <XStack alignItems="center" gap={8}>
        <Ionicons name={trendIcon} size={16} color={theme.textInverse?.val} />
        <AppBadge label={formatChange(changePercent)} tone={badgeTone} />
        <Text color="$textInverse" fontSize={12} opacity={0.7}>
          {changeLabel}
        </Text>
      </XStack>
    </SummaryCard>
  );
}
