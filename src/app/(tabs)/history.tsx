/**
 * History Screen — Expense history with filters
 */
import { styled, Text, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { ScrollView } from 'react-native';

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

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

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

      {/* Empty State */}
      <YStack flex={1} alignItems="center" justifyContent="center" gap={16} padding={16}>
        <YStack
          width={80}
          height={80}
          borderRadius={9999}
          backgroundColor="$surface"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="calendar-outline" size={36} color={theme.textSecondary?.val} />
        </YStack>
        <YStack alignItems="center" gap={4}>
          <Text color="$textPrimary" fontSize={17} fontWeight="600">
            No expenses found
          </Text>
          <Text color="$textSecondary" fontSize={13} textAlign="center">
            Your expense history will appear here
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}
