/**
 * Insights Screen — Charts and analytics
 */
import { styled, Text, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';

const ChartPlaceholder = styled(YStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$cardBorder',
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
  gap: 12,
  animation: 'medium',
  enterStyle: { opacity: 0, y: 10 },
  shadowColor: '#0B1220',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
});

const StatRow = styled(XStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '$cardBorder',
  padding: 16,
  alignItems: 'center',
  justifyContent: 'space-between',
  animation: 'fast',
  enterStyle: { opacity: 0, y: 6 },
  pressStyle: { scale: 0.985, backgroundColor: '$surfaceHover' },
});

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + 16}
      paddingHorizontal={16}
      gap={20}
    >
      {/* Header */}
      <Text color="$textPrimary" fontSize={24} fontWeight="700">
        Insights
      </Text>

      {/* Category Breakdown Chart */}
      <YStack gap={8} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
        <Text color="$textPrimary" fontSize={17} fontWeight="600">
          Category Breakdown
        </Text>
        <ChartPlaceholder>
          <Ionicons name="pie-chart-outline" size={48} color={theme.textTertiary?.val} />
          <Text color="$textSecondary" fontSize={13} textAlign="center">
            Add expenses to see category breakdown
          </Text>
        </ChartPlaceholder>
      </YStack>

      {/* Spending Trend */}
      <YStack gap={8} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
        <Text color="$textPrimary" fontSize={17} fontWeight="600">
          Spending Trend
        </Text>
        <ChartPlaceholder>
          <Ionicons name="trending-up" size={48} color={theme.textTertiary?.val} />
          <Text color="$textSecondary" fontSize={13} textAlign="center">
            Track your spending over time
          </Text>
        </ChartPlaceholder>
      </YStack>

      {/* Top Categories */}
      <YStack gap={8} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
        <Text color="$textPrimary" fontSize={17} fontWeight="600">
          Top Categories
        </Text>
        <YStack gap={8}>
          {['Food', 'Transport', 'Shopping'].map((cat, i) => (
            <StatRow key={cat}>
              <XStack alignItems="center" gap={12}>
                <YStack
                  width={36}
                  height={36}
                  borderRadius={12}
                  backgroundColor="$primaryLight"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize={15}>{['🍕', '🚗', '🛍️'][i]}</Text>
                </YStack>
                <Text color="$textPrimary" fontSize={15} fontWeight="500">{cat}</Text>
              </XStack>
              <Text color="$textSecondary" fontSize={15} fontWeight="600">₹0</Text>
            </StatRow>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
}
