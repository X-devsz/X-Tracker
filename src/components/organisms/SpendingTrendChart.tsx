import { LineChart } from 'react-native-gifted-charts';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { AppCard } from '../atoms';
import { EmptyState } from '../molecules';

export interface TrendPoint {
  value: number;
  label?: string;
}

interface SpendingTrendChartProps {
  title?: string;
  data: TrendPoint[];
  subtitle?: string;
}

export function SpendingTrendChart({
  title = 'Spending Trend',
  data,
  subtitle = 'Last 6 months',
}: SpendingTrendChartProps) {
  const theme = useTheme();
  const primaryColor = theme.primary?.val ?? '#6366F1';

  if (data.length === 0) {
    return (
      <AppCard>
        <EmptyState
          title="No trend data yet"
          description="Add more expenses to unlock trend insights."
        />
      </AppCard>
    );
  }

  return (
    <AppCard elevated>
      <YStack gap={16}>
        <XStack alignItems="center" justifyContent="space-between">
          <Text color="$textPrimary" fontSize={16} fontWeight="600">
            {title}
          </Text>
          <Text color="$textSecondary" fontSize={12}>
            {subtitle}
          </Text>
        </XStack>
        <LineChart
          data={data}
          color={primaryColor}
          thickness={3}
          hideRules
          dataPointsColor={primaryColor}
          startFillColor={primaryColor}
          endFillColor="transparent"
          areaChart
          isAnimated
          hideYAxisText
          spacing={40}
        />
      </YStack>
    </AppCard>
  );
}
