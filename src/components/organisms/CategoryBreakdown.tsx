import { PieChart } from 'react-native-gifted-charts';
import { Text, XStack, YStack } from 'tamagui';
import { AppBadge, AppCard } from '../atoms';
import { EmptyState } from '../molecules';

export interface CategoryBreakdownItem {
  label: string;
  value: number;
  color: string;
}

interface CategoryBreakdownProps {
  title?: string;
  data: CategoryBreakdownItem[];
  totalLabel?: string;
}

export function CategoryBreakdown({
  title = 'Category Breakdown',
  data,
  totalLabel = 'Total',
}: CategoryBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <AppCard>
        <EmptyState
          title="No category data yet"
          description="Add expenses to see category trends."
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
            {totalLabel}: {total.toFixed(2)}
          </Text>
        </XStack>

        <XStack alignItems="center" gap={16}>
          <PieChart
            data={data.map((item) => ({
              value: item.value,
              color: item.color,
              text: item.label,
            }))}
            donut
            radius={70}
            innerRadius={40}
            focusOnPress
            showText
            textColor="#FFFFFF"
            textSize={10}
          />
          <YStack flex={1} gap={10}>
            {data.map((item) => {
              const percent = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <XStack key={item.label} alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap={8}>
                    <YStack
                      width={10}
                      height={10}
                      borderRadius={9999}
                      backgroundColor={item.color}
                    />
                    <Text color="$textSecondary" fontSize={12}>
                      {item.label}
                    </Text>
                  </XStack>
                  <AppBadge label={`${percent.toFixed(0)}%`} tone="neutral" />
                </XStack>
              );
            })}
          </YStack>
        </XStack>
      </YStack>
    </AppCard>
  );
}
