/**
 * History Screen — Expense history with filters
 */
import { styled, Text, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { ScrollView } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const FilterChip = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: '$border',
  alignItems: 'center',
  gap: 4,
  variants: {
    active: {
      true: {
        backgroundColor: '$primaryLight',
        borderColor: '$primary',
      },
    },
  } as const,
});

const SwipeContainer = styled(YStack, {
  borderRadius: 16,
  overflow: 'hidden',
});

const ExpenseRow = styled(XStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$cardBorder',
  paddingHorizontal: 14,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  animation: 'fast',
  enterStyle: { opacity: 0, y: 8 },
  pressStyle: { scale: 0.985, backgroundColor: '$surfaceHover' },
  shadowColor: '#0B1220',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
});

const SwipeAction = styled(YStack, {
  width: 92,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
});

const demoExpenses = [
  { id: '1', title: 'Groceries', category: 'Food', amount: 420, time: '8:42 PM' },
  { id: '2', title: 'Metro Pass', category: 'Transport', amount: 120, time: '7:15 PM' },
  { id: '3', title: 'Coffee', category: 'Food', amount: 90, time: '9:10 AM' },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const renderLeftActions = () => (
    <XStack flex={1} backgroundColor="$primary">
      <SwipeAction>
        <Ionicons name="create-outline" size={20} color={theme.textInverse?.val} />
        <Text color="$textInverse" fontSize={12} fontWeight="600">
          Edit
        </Text>
      </SwipeAction>
    </XStack>
  );

  const renderRightActions = () => (
    <XStack flex={1} backgroundColor="$danger">
      <SwipeAction>
        <Ionicons name="trash-outline" size={20} color={theme.textInverse?.val} />
        <Text color="$textInverse" fontSize={12} fontWeight="600">
          Delete
        </Text>
      </SwipeAction>
    </XStack>
  );

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + 16}
    >
      {/* Header */}
      <YStack paddingHorizontal={16} gap={16}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textPrimary" fontSize={24} fontWeight="700">
            History
          </Text>
          <XStack
            width={44}
            height={44}
            borderRadius={12}
            backgroundColor="$surface"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="$border"
          >
            <Ionicons name="search" size={20} color={theme.textSecondary?.val} />
          </XStack>
        </XStack>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap={8}>
            <FilterChip active>
              <Text color="$primary" fontSize={13} fontWeight="500">All</Text>
            </FilterChip>
            <FilterChip>
              <Text color="$textSecondary" fontSize={13}>This Week</Text>
            </FilterChip>
            <FilterChip>
              <Text color="$textSecondary" fontSize={13}>This Month</Text>
            </FilterChip>
            <FilterChip>
              <Text color="$textSecondary" fontSize={13}>Food</Text>
            </FilterChip>
            <FilterChip>
              <Text color="$textSecondary" fontSize={13}>Transport</Text>
            </FilterChip>
          </XStack>
        </ScrollView>
      </YStack>

      <YStack flex={1} paddingHorizontal={16} paddingTop={16} gap={12}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textSecondary" fontSize={12} fontWeight="600">
            RECENT ACTIVITY
          </Text>
          <Text color="$textTertiary" fontSize={12}>
            Swipe left to delete
          </Text>
        </XStack>

        <YStack gap={12}>
          {demoExpenses.map((expense) => (
            <SwipeContainer key={expense.id}>
              <Swipeable
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
              >
                <ExpenseRow>
                  <XStack gap={12} alignItems="center" flex={1}>
                    <YStack
                      width={44}
                      height={44}
                      borderRadius={14}
                      backgroundColor="$primaryLight"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Ionicons name="receipt-outline" size={22} color={theme.primary?.val} />
                    </YStack>
                    <YStack flex={1} gap={2}>
                      <Text color="$textPrimary" fontSize={15} fontWeight="600">
                        {expense.title}
                      </Text>
                      <Text color="$textSecondary" fontSize={12}>
                        {expense.category} · Today
                      </Text>
                    </YStack>
                  </XStack>
                  <YStack alignItems="flex-end" gap={2}>
                    <Text color="$textPrimary" fontSize={15} fontWeight="700">
                      INR {expense.amount}
                    </Text>
                    <Text color="$textTertiary" fontSize={11}>
                      {expense.time}
                    </Text>
                  </YStack>
                </ExpenseRow>
              </Swipeable>
            </SwipeContainer>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
}
