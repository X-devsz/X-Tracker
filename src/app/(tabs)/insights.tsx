/**
 * Insights Screen - Charts and analytics
 */
import { Text, XStack, YStack } from 'tamagui';
import { categoryColors } from '../../theme';
import {
  AppBadge,
  AppCard,
  CategoryBreakdown,
  ScreenContainer,
  SpendingTrendChart,
} from '../../components';

const breakdownData = [
  { label: 'Food', value: 420, color: categoryColors.food },
  { label: 'Transport', value: 180, color: categoryColors.transport },
  { label: 'Shopping', value: 260, color: categoryColors.shopping },
];

const trendData = [
  { value: 120, label: 'Jan' },
  { value: 180, label: 'Feb' },
  { value: 160, label: 'Mar' },
  { value: 260, label: 'Apr' },
  { value: 220, label: 'May' },
  { value: 300, label: 'Jun' },
];

const topCategories = [
  { label: 'Food', total: 420, color: categoryColors.food },
  { label: 'Shopping', total: 260, color: categoryColors.shopping },
  { label: 'Transport', total: 180, color: categoryColors.transport },
];

export default function InsightsScreen() {
  return (
    <ScreenContainer gap={20}>
      <Text color="$textPrimary" fontSize={24} fontWeight="700">
        Insights
      </Text>

      <CategoryBreakdown data={breakdownData} />

      <SpendingTrendChart data={trendData} />

      <YStack gap={12}>
        <Text color="$textPrimary" fontSize={17} fontWeight="600">
          Top Categories
        </Text>
        <YStack gap={10}>
          {topCategories.map((category) => (
            <AppCard key={category.label} elevated padding={16}>
              <XStack alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" gap={10}>
                  <YStack
                    width={36}
                    height={36}
                    borderRadius={12}
                    backgroundColor={`${category.color}20`}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="$textPrimary" fontSize={14} fontWeight="600">
                      {category.label.slice(0, 1)}
                    </Text>
                  </YStack>
                  <Text color="$textPrimary" fontSize={15} fontWeight="600">
                    {category.label}
                  </Text>
                </XStack>
                <AppBadge label={`$${category.total}`} tone="neutral" />
              </XStack>
            </AppCard>
          ))}
        </YStack>
      </YStack>
    </ScreenContainer>
  );
}
