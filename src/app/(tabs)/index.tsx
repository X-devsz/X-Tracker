/**
 * Home Screen — Dashboard
 *
 * Placeholder with themed styling. Will show monthly summary + recent expenses.
 */
import { styled, Text, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';

const SummaryCard = styled(YStack, {
  backgroundColor: "$primary",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",
  padding: 20,
  gap: 8,
  animation: "medium",
  enterStyle: { opacity: 0, y: 12 },
  pressStyle: { scale: 0.985 },
  shadowColor: "#0B1220",
  shadowOpacity: 0.25,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
});

const QuickStatCard = styled(YStack, {
  backgroundColor: "$cardBackground",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "$cardBorder",
  padding: 16,
  flex: 1,
  gap: 4,
  animation: "fast",
  enterStyle: { opacity: 0, y: 8 },
  hoverStyle: { borderColor: "$primary", backgroundColor: "$surface" },
  pressStyle: { scale: 0.98, backgroundColor: "$surfaceHover" },
  shadowColor: "#0B1220",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
});

const IconButton = styled(XStack, {
  width: 44,
  height: 44,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  animation: "fast",
  pressStyle: { scale: 0.96 },
  hoverStyle: { opacity: 0.9 },
  variants: {
    tone: {
      surface: {
        backgroundColor: "$surface",
        borderWidth: 1,
        borderColor: "$border",
      },
      primary: {
        backgroundColor: "$primary",
      },
      soft: {
        backgroundColor: "$primaryLight",
      },
    },
  } as const,
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

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
            Dashboard
          </Text>
        </YStack>
        <XStack gap={10} alignItems="center">
          <IconButton tone="primary" onPress={() => router.push("/expense/add")}>
            <Ionicons name="add" size={22} color={theme.textInverse?.val} />
          </IconButton>
          <IconButton tone="soft">
            <Ionicons name="person" size={20} color={theme.primary?.val} />
          </IconButton>
        </XStack>
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
      <XStack gap={12} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
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
      <YStack gap={12} flex={1} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
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
          animation="medium"
          enterStyle={{ opacity: 0, y: 12 }}
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
