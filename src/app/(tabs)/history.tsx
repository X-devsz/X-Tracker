/**
 * History Screen - Expense history with filters
 */
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { categoryColors } from '../../theme';
import {
  ExpenseList,
  ExpenseListItem,
  FilterBar,
  ScreenContainer,
  SearchBar,
} from '../../components';
import type { ExpenseListItemData } from '../../components/organisms/ExpenseList';

const SwipeContainer = styled(YStack, {
  borderRadius: 16,
  overflow: 'hidden',
});

const SwipeAction = styled(YStack, {
  width: 92,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
});

const demoExpenses: ExpenseListItemData[] = [
  {
    id: '1',
    title: 'Groceries',
    category: 'Food',
    amount: 420,
    date: 'Today - 8:42 PM',
    note: 'Weekly market',
    iconColor: categoryColors.food,
    iconBackgroundColor: `${categoryColors.food}20`,
    currencySymbol: 'INR ',
  },
  {
    id: '2',
    title: 'Metro Pass',
    category: 'Transport',
    amount: 120,
    date: 'Today - 7:15 PM',
    note: 'Monthly',
    iconColor: categoryColors.transport,
    iconBackgroundColor: `${categoryColors.transport}20`,
    currencySymbol: 'INR ',
  },
  {
    id: '3',
    title: 'Coffee',
    category: 'Food',
    amount: 90,
    date: 'Today - 9:10 AM',
    note: 'Morning',
    iconColor: categoryColors.food,
    iconBackgroundColor: `${categoryColors.food}20`,
    currencySymbol: 'INR ',
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
];

export default function HistoryScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [activeFilterId, setActiveFilterId] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const normalizedQuery = query.trim().toLowerCase();
  const filteredExpenses = demoExpenses.filter((expense) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      expense.title.toLowerCase().includes(normalizedQuery) ||
      expense.category.toLowerCase().includes(normalizedQuery);
    const matchesFilter =
      activeFilterId === 'all' ||
      (activeFilterId === 'food' && expense.category === 'Food') ||
      (activeFilterId === 'transport' && expense.category === 'Transport');

    return matchesQuery && matchesFilter;
  });

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

  const renderItem: ListRenderItem<ExpenseListItemData> = ({ item }) => (
    <SwipeContainer>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <ExpenseListItem
          title={item.title}
          category={item.category}
          amount={item.amount}
          date={item.date}
          note={item.note}
          currencySymbol={item.currencySymbol}
          iconColor={item.iconColor}
          iconBackgroundColor={item.iconBackgroundColor}
        />
      </Swipeable>
    </SwipeContainer>
  );

  return (
    <ScreenContainer scrollable={false} gap={16}>
      <YStack gap={12}>
        <Text color="$textPrimary" fontSize={24} fontWeight="700">
          History
        </Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search expenses"
        />
      </YStack>

      <FilterBar
        title="Filters"
        date={selectedDate}
        onDateChange={setSelectedDate}
        filters={filters}
        activeFilterId={activeFilterId}
        onFilterSelect={(filter) => setActiveFilterId(filter.id)}
      />

      <YStack gap={8} flex={1}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="$textSecondary" fontSize={12} fontWeight="600">
            RECENT ACTIVITY
          </Text>
          <Text color="$textTertiary" fontSize={12}>
            Swipe left to delete
          </Text>
        </XStack>

        <ExpenseList
          data={filteredExpenses}
          renderItem={renderItem}
          listStyle={{ flex: 1 }}
          emptyTitle="No matching expenses"
          emptyDescription="Try a different filter or search term."
        />
      </YStack>
    </ScreenContainer>
  );
}
