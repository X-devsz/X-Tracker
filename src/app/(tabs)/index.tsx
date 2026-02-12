/**
 * Home Screen — Dashboard
 *
 * Placeholder with themed styling. Will show monthly summary + recent expenses.
 */
import { styled, Text, YStack, XStack } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "tamagui";

const SummaryCard = styled(YStack, {
  backgroundColor: "$primary",
  borderRadius: 16,
  padding: 20,
  gap: 8,
});

const QuickStatCard = styled(YStack, {
  backgroundColor: "$cardBackground",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "$cardBorder",
  padding: 16,
  flex: 1,
  gap: 4,
});

export default function HomeScreen() {
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
      <XStack justifyContent="space-between" alignItems="center">
        <YStack>
          <Text color="$textSecondary" fontSize={13} fontWeight="500">
            Welcome back
          </Text>
          <Text color="$textPrimary" fontSize={24} fontWeight="700">
            Dashboards
          </Text>
        </YStack>
        <YStack
          width={44}
          height={44}
          borderRadius={9999}
          backgroundColor="$primaryLight"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="person" size={22} color={theme.primary?.val} />
        </YStack>
      </XStack>

      {/* Monthly Summary Card */}
      <SummaryCard>
        <Text color="$textInverse" fontSize={13} fontWeight="500" opacity={0.8}>
          Total Spent This Month
        </Text>
        <Text color="$textInverse" fontSize={34} fontWeight="700">
          ₹0.00
        </Text>
        <XStack gap={4} alignItems="center">
          <Ionicons
            name="trending-up"
            size={14}
            color="rgba(255,255,255,0.7)"
          />
          <Text color="$textInverse" fontSize={11} opacity={0.7}>
            No expenses yet
          </Text>
        </XStack>
      </SummaryCard>

      {/* Quick Stats */}
      <XStack gap={12}>
        <QuickStatCard>
          <XStack
            width={36}
            height={36}
            borderRadius={12}
            backgroundColor="$successLight"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="arrow-down" size={18} color={theme.success?.val} />
          </XStack>
          <Text color="$textSecondary" fontSize={11}>
            Transactions
          </Text>
          <Text color="$textPrimary" fontSize={20} fontWeight="700">
            0
          </Text>
        </QuickStatCard>
        <QuickStatCard>
          <XStack
            width={36}
            height={36}
            borderRadius={12}
            backgroundColor="$warningLight"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="layers" size={18} color={theme.warning?.val} />
          </XStack>
          <Text color="$textSecondary" fontSize={11}>
            Categories
          </Text>
          <Text color="$textPrimary" fontSize={20} fontWeight="700">
            8
          </Text>
        </QuickStatCard>
      </XStack>

      {/* Recent Expenses Placeholder */}
      <YStack gap={12} flex={1}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textPrimary" fontSize={17} fontWeight="600">
            Recent Expenses
          </Text>
          <Text color="$primary" fontSize={13} fontWeight="500">
            See All
          </Text>
        </XStack>

        {/* Empty State */}
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          gap={16}
          paddingVertical={32}
        >
          <YStack
            width={80}
            height={80}
            borderRadius={9999}
            backgroundColor="$primaryLight"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons
              name="receipt-outline"
              size={36}
              color={theme.primary?.val}
            />
          </YStack>
          <YStack alignItems="center" gap={4}>
            <Text color="$textPrimary" fontSize={17} fontWeight="600">
              No expenses yet
            </Text>
            <Text color="$textSecondary" fontSize={13} textAlign="center">
              Tap the + button to add your first expense
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
