/**
 * History Screen - Expense history with filters
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import { endOfDay, startOfDay, startOfMonth, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import {
  ExpenseList,
  ExpenseListItem,
  FilterBar,
  ScreenContainer,
  SearchBar,
  SnackBar,
} from '../../components';
import type { ExpenseListItemData } from '../../components/organisms/ExpenseList';
import {
  useCategoryStore,
  useExpenseStore,
  useFilterStore,
  useSettingsStore,
} from '../../store';
import { resolveCategoryColor, resolveCategoryIcon } from '../../utils/categories';
import {
  formatAmountMinor,
  formatExpenseDate,
  getCurrencySymbol,
  formatDateRange,
} from '../../utils/formatters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptics } from '../../services/haptics';
import { useScreenRenderTimer } from '../../services/performance';

type IconName = keyof typeof Ionicons.glyphMap;

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

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { currency } = useSettingsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    recentExpenses,
    isLoadingRecent,
    error,
    fetchRecent,
    softDeleteExpense,
    restoreExpense,
  } = useExpenseStore();
  const {
    dateRange,
    categoryId,
    searchQuery,
    setDateRange,
    setCategoryId,
    setSearchQuery,
  } = useFilterStore();
  const [activeFilterId, setActiveFilterId] = useState('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState('Expense deleted');
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRenderReady = !isLoadingRecent;

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchRecent({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      categoryId: categoryId ?? undefined,
    });
  }, [fetchRecent, dateRange.startDate, dateRange.endDate, categoryId]);

  const filters = useMemo(() => {
    const base = [
      { id: 'all', label: 'All' },
      { id: 'range-week', label: 'This Week' },
      { id: 'range-month', label: 'This Month' },
    ];

    const categoryFilters = categories.map((category) => ({
      id: `category-${category.id}`,
      label: category.name,
    }));

    return [...base, ...categoryFilters];
  }, [categories]);

  const handleFilterSelect = useCallback(
    (filterId: string) => {
      if (filterId === 'all') {
        setActiveFilterId('all');
        setCategoryId(null);
        const endDate = new Date();
        const startDate = subDays(endDate, 30);
        setDateRange({ startDate, endDate });
        return;
      }

      if (filterId === 'range-week') {
        const endDate = new Date();
        const startDate = subDays(endDate, 7);
        setDateRange({ startDate, endDate });
        setCategoryId(null);
        setActiveFilterId(filterId);
        return;
      }

      if (filterId === 'range-month') {
        const now = new Date();
        setDateRange({
          startDate: startOfMonth(now),
          endDate: now,
        });
        setCategoryId(null);
        setActiveFilterId(filterId);
        return;
      }

      if (filterId.startsWith('category-')) {
        const id = filterId.replace('category-', '');
        setCategoryId(id);
        setActiveFilterId(filterId);
      }
    },
    [setCategoryId, setDateRange],
  );

  const handleDateChange = useCallback(
    (date: Date) => {
      setDateRange({
        startDate: startOfDay(date),
        endDate: endOfDay(date),
      });
      if (activeFilterId === 'range-week' || activeFilterId === 'range-month') {
        setActiveFilterId('all');
      }
    },
    [activeFilterId, setDateRange],
  );

  useEffect(() => {
    if (!categoryId && activeFilterId.startsWith('category-')) {
      setActiveFilterId('all');
    }
  }, [categoryId, activeFilterId]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  useScreenRenderTimer('History', isRenderReady);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredExpenses = useMemo(() => {
    if (!normalizedQuery) return recentExpenses;

    return recentExpenses.filter((expense) => {
      const categoryName = expense.categoryName ?? '';
      const merchant = expense.merchant ?? '';
      const note = expense.note ?? '';
      return (
        categoryName.toLowerCase().includes(normalizedQuery) ||
        merchant.toLowerCase().includes(normalizedQuery) ||
        note.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery, recentExpenses]);

  const listData = useMemo(
    () =>
      filteredExpenses.map((expense) => {
        const color = resolveCategoryColor(expense.categoryColorToken);
        return {
          id: expense.id,
          title: expense.merchant ?? expense.categoryName ?? 'Expense',
          category: expense.categoryName ?? 'Uncategorized',
          amount: formatAmountMinor(expense.amountMinor),
          date: formatExpenseDate(expense.occurredAt),
          note: expense.note ?? undefined,
          currencySymbol,
          iconName: resolveCategoryIcon(
            expense.categoryIcon,
            'receipt-outline',
          ) as IconName,
          iconColor: color,
          iconBackgroundColor: `${color}20`,
        };
      }),
    [filteredExpenses, currencySymbol],
  );

  const showUndo = useCallback((id: string, label: string) => {
    setPendingDeleteId(id);
    setPendingDeleteLabel(`Deleted ${label}`);
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }
    undoTimerRef.current = setTimeout(() => {
      setPendingDeleteId(null);
      setPendingDeleteLabel('Expense deleted');
    }, 5000);
  }, []);

  const confirmDelete = useCallback(
    (id: string, label: string) => {
      Alert.alert('Delete expense', 'This will remove the expense from history.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await softDeleteExpense(id);
              haptics.warning();
              showUndo(id, label);
            } catch (err) {
              Alert.alert(
                'Delete failed',
                err instanceof Error ? err.message : 'Unable to delete expense.',
              );
            }
          },
        },
      ]);
    },
    [softDeleteExpense, showUndo],
  );

  const handleUndo = useCallback(async () => {
    if (!pendingDeleteId) return;
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }
    try {
      await restoreExpense(pendingDeleteId);
      setPendingDeleteId(null);
    } catch (err) {
      Alert.alert(
        'Undo failed',
        err instanceof Error ? err.message : 'Unable to restore expense.',
      );
    }
  }, [pendingDeleteId, restoreExpense]);

  const renderLeftActions = (itemId: string) => (
    <XStack flex={1} backgroundColor="$primary">
      <Pressable
        onPress={() => router.push(`/expense/${itemId}`)}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <SwipeAction>
          <Ionicons name="create-outline" size={20} color={theme.textInverse?.val} />
          <Text color="$textInverse" fontSize={12} fontWeight="600">
            Edit
          </Text>
        </SwipeAction>
      </Pressable>
    </XStack>
  );

  const renderRightActions = (itemId: string, label: string) => (
    <XStack flex={1} backgroundColor="$danger">
      <Pressable
        onPress={() => confirmDelete(itemId, label)}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <SwipeAction>
          <Ionicons name="trash-outline" size={20} color={theme.textInverse?.val} />
          <Text color="$textInverse" fontSize={12} fontWeight="600">
            Delete
          </Text>
        </SwipeAction>
      </Pressable>
    </XStack>
  );

  const renderItem: ListRenderItem<ExpenseListItemData> = ({ item }) => (
    <SwipeContainer>
      <Swipeable
        renderLeftActions={() => renderLeftActions(item.id)}
        renderRightActions={() => renderRightActions(item.id, item.title)}
      >
        <ExpenseListItem
          title={item.title}
          category={item.category}
          amount={item.amount}
          date={item.date}
          note={item.note}
          currencySymbol={item.currencySymbol}
          iconName={item.iconName}
          iconColor={item.iconColor}
          iconBackgroundColor={item.iconBackgroundColor}
          onPress={() => router.push(`/expense/${item.id}`)}
        />
      </Swipeable>
    </SwipeContainer>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScreenContainer scrollable={false} gap={16}>
        <YStack gap={12}>
          <Text color="$textPrimary" fontSize={24} fontWeight="700">
            History
          </Text>
          <Text color="$textSecondary" fontSize={12}>
            {formatDateRange(dateRange.startDate, dateRange.endDate)}
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search expenses"
          />
        </YStack>

        <FilterBar
          title="Filters"
          date={dateRange.endDate}
          onDateChange={handleDateChange}
          filters={filters}
          activeFilterId={activeFilterId}
          onFilterSelect={(filter) => handleFilterSelect(filter.id)}
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
            data={listData}
            renderItem={renderItem}
            listStyle={{ flex: 1 }}
            isLoading={isLoadingRecent}
            error={error ?? undefined}
            onRetry={() =>
              fetchRecent({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                categoryId: categoryId ?? undefined,
              })
            }
            onRefresh={() =>
              fetchRecent({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                categoryId: categoryId ?? undefined,
              })
            }
            refreshing={isLoadingRecent}
            emptyTitle="No matching expenses"
            emptyDescription="Try a different filter or search term."
            emptyActionLabel="Add expense"
            onEmptyAction={() => router.push('/expense/add')}
          />
        </YStack>
      </ScreenContainer>

      {pendingDeleteId ? (
        <YStack
          position="absolute"
          left={16}
          right={16}
          bottom={insets.bottom + 12}
        >
          <SnackBar
            tone="danger"
            message={pendingDeleteLabel}
            actionLabel="Undo"
            onAction={handleUndo}
            onDismiss={() => {
              if (undoTimerRef.current) {
                clearTimeout(undoTimerRef.current);
              }
              setPendingDeleteId(null);
              setPendingDeleteLabel('Expense deleted');
            }}
          />
        </YStack>
      ) : null}
    </YStack>
  );
}
