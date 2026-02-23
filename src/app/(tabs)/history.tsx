/**
 * History Screen - Expense history with filters
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import { Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import type { ListRenderItem } from 'react-native';
import {
  endOfDay,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import { useRouter } from 'expo-router';
import { Sheet, Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { DatePickerModal } from 'react-native-paper-dates';
import {
  AppButton,
  AppChip,
  AppIconButton,
  ExpenseList,
  ExpenseListItem,
  ScreenLayout,
  SearchBar,
  SnackBar,
  useAlertDialog,
} from '@/components';
import type { ExpenseListItemData } from '@/components/organisms/ExpenseList';
import {
  useCategoryStore,
  useExpenseStore,
  useFilterStore,
  useSettingsStore,
  type DateRange,
} from '@/store';
import { resolveCategoryColor, resolveCategoryIcon } from '@/utils/categories';
import {
  formatAmountMinor,
  formatExpenseDate,
  getCurrencySymbol,
  formatDateRange,
} from '@/utils/formatters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { haptics } from '@/services/haptics';
import { useScreenRenderTimer } from '@/services/performance';
import { radius, space } from '@/theme/tokens';
import { useShallow } from 'zustand/react/shallow';

type IconName = keyof typeof Ionicons.glyphMap;

const SwipeContainer = styled(YStack, {
  borderRadius: radius.xs,
  overflow: 'hidden',
});

const SwipeAction = styled(YStack, {
  width: 92,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
});

const resolveTint = (color: string) =>
  `${color}20` as ComponentProps<typeof YStack>['backgroundColor'];

const CategoryOptionRow = styled(XStack, {
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  pressStyle: { backgroundColor: '$surfaceHover' },
});

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { alertDialog, showAlert } = useAlertDialog();
  const insets = useSafeAreaInsets();
  const currency = useSettingsStore((state) => state.currency);
  const { categories, fetchCategories } = useCategoryStore(
    useShallow((state) => ({
      categories: state.categories,
      fetchCategories: state.fetchCategories,
    })),
  );
  const {
    recentExpenses,
    isLoadingRecent,
    error,
    fetchRecent,
    softDeleteExpense,
    restoreExpense,
  } = useExpenseStore(
    useShallow((state) => ({
      recentExpenses: state.recentExpenses,
      isLoadingRecent: state.isLoadingRecent,
      error: state.error,
      fetchRecent: state.fetchRecent,
      softDeleteExpense: state.softDeleteExpense,
      restoreExpense: state.restoreExpense,
    })),
  );
  const {
    dateRange,
    searchQuery,
    sortOrder,
    setDateRange,
    setSearchQuery,
    setSortOrder,
  } = useFilterStore(
    useShallow((state) => ({
      dateRange: state.dateRange,
      searchQuery: state.searchQuery,
      sortOrder: state.sortOrder,
      setDateRange: state.setDateRange,
      setSearchQuery: state.setSearchQuery,
      setSortOrder: state.setSortOrder,
    })),
  );
  const [mode, setMode] = useState<'browse' | 'search'>('browse');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteLabel, setPendingDeleteLabel] = useState('Expense deleted');
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRenderReady = !isLoadingRecent;

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

  useEffect(() => {
    fetchRecent({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  }, [fetchRecent, dateRange.startDate, dateRange.endDate]);

  const getDefaultRange = () => {
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, 30));
    return { startDate, endDate };
  };

  const datePresets = useMemo(
    () => [
      {
        id: 'all',
        label: 'All time',
        getRange: () => ({ startDate: new Date(2000, 0, 1), endDate: new Date() }),
      },
      {
        id: 'week',
        label: 'This week',
        getRange: () => {
          const now = new Date();
          return { startDate: startOfWeek(now, { weekStartsOn: 1 }), endDate: now };
        },
      },
      {
        id: 'month',
        label: 'This month',
        getRange: () => {
          const now = new Date();
          return { startDate: startOfMonth(now), endDate: now };
        },
      },
      {
        id: '30',
        label: 'Last 30 days',
        getRange: () => {
          const endDate = new Date();
          return { startDate: subDays(endDate, 30), endDate };
        },
      },
    ],
    [],
  );

  const applyDateRange = useCallback(
    (range: DateRange) => {
      setDateRange({
        startDate: startOfDay(range.startDate),
        endDate: endOfDay(range.endDate),
      });
    },
    [setDateRange],
  );

  const handleRangeChange = useCallback(
    (range: DateRange) => {
      applyDateRange(range);
      setIsDatePickerOpen(false);
    },
    [applyDateRange],
  );

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  useScreenRenderTimer('History', isRenderReady);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const selectedCategories = useMemo(
    () => categories.filter((category) => selectedCategoryIds.includes(category.id)),
    [categories, selectedCategoryIds],
  );
  const selectedCategoryLabel =
    selectedCategories.length === 0
      ? 'All categories'
      : selectedCategories.length === 1
        ? selectedCategories[0].name
        : `${selectedCategories.length} categories`;

  const filteredCategories = useMemo(() => {
    const query = categoryQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, categoryQuery]);
  const allFilteredSelected =
    filteredCategories.length > 0
    && filteredCategories.every((category) => selectedCategoryIds.includes(category.id));
  const defaultRange = getDefaultRange();
  const hasCustomDateRange =
    !isSameDay(dateRange.startDate, defaultRange.startDate)
    || !isSameDay(dateRange.endDate, defaultRange.endDate);
  const hasActiveFilters =
    selectedCategoryIds.length > 0 || hasCustomDateRange || sortOrder !== 'desc';
  const sortLabel = sortOrder === 'desc' ? 'Newest' : 'Oldest';
  const activePresetId = datePresets.find((preset) => {
    const range = preset.getRange();
    return (
      isSameDay(dateRange.startDate, range.startDate)
      && isSameDay(dateRange.endDate, range.endDate)
    );
  })?.id;
  const activePresetLabel = datePresets.find((preset) => preset.id === activePresetId)?.label;
  const dateChipLabel =
    activePresetLabel ?? formatDateRange(dateRange.startDate, dateRange.endDate);
  const isCustomRangeActive = hasCustomDateRange && !activePresetId;

  const filteredExpenses = useMemo(() => {
    let results = recentExpenses;
    if (selectedCategoryIds.length > 0) {
      results = results.filter(
        (expense) => expense.categoryId && selectedCategoryIds.includes(expense.categoryId),
      );
    }
    if (normalizedQuery) {
      results = results.filter((expense) => {
        const categoryName = expense.categoryName ?? '';
        const merchant = expense.merchant ?? '';
        const note = expense.note ?? '';
        return (
          categoryName.toLowerCase().includes(normalizedQuery) ||
          merchant.toLowerCase().includes(normalizedQuery) ||
          note.toLowerCase().includes(normalizedQuery)
        );
      });
    }
    if (sortOrder === 'asc') {
      return [...results].sort(
        (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
      );
    }
    return results;
  }, [normalizedQuery, recentExpenses, selectedCategoryIds, sortOrder]);

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSelectAllCategories = () => {
    if (filteredCategories.length === 0) return;
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      filteredCategories.forEach((category) => next.add(category.id));
      return Array.from(next);
    });
  };

  const handleClearCategories = () => {
    setSelectedCategoryIds([]);
  };

  const handleClearFilters = () => {
    setSelectedCategoryIds([]);
    setCategoryQuery('');
    setSortOrder('desc');
    setDateRange(getDefaultRange());
  };

  const toggleSortOrder = useCallback(
    () => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'),
    [setSortOrder, sortOrder],
  );

  const isSearchMode = mode === 'search';
  const contentGap = isSearchMode ? space[0] : space.lg;
  const contentPadding = isSearchMode ? space[0] : space.xl;
  const headerPaddingBottom = isSearchMode ? space.sm : space.md;

  const enterSearch = () => setMode('search');
  const exitSearch = () => {
    setSearchQuery('');
    setMode('browse');
    Keyboard.dismiss();
  };
  const handleSearchBlur = () => {
    if (searchQuery.trim().length === 0) {
      exitSearch();
    }
  };

  const handleFilterSheetChange = (open: boolean) => {
    setFilterSheetOpen(open);
    if (!open) {
      setCategoryQuery('');
      setIsDatePickerOpen(false);
    }
  };

  useEffect(() => {
    setSelectedCategoryIds((prev) =>
      prev.filter((id) => categories.some((category) => category.id === id)),
    );
  }, [categories]);

  const listHeader = !isSearchMode ? (
    <YStack paddingVertical={space.xs} backgroundColor="$background">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: space.xs }}
      >
        <XStack gap={8} alignItems="center">
          <AppChip
            label={dateChipLabel}
            active={hasCustomDateRange}
            icon={
              <Ionicons
                name="calendar-outline"
                size={14}
                color={hasCustomDateRange ? theme.primary?.val : theme.textTertiary?.val}
              />
            }
            onPress={() => setFilterSheetOpen(true)}
          />
          <AppChip
            label={selectedCategoryLabel}
            active={selectedCategoryIds.length > 0}
            icon={
              <Ionicons
                name="pricetag-outline"
                size={14}
                color={selectedCategoryIds.length > 0 ? theme.primary?.val : theme.textTertiary?.val}
              />
            }
            onPress={() => setFilterSheetOpen(true)}
          />
          <AppChip
            label={`Sort: ${sortLabel}`}
            active={sortOrder !== 'desc'}
            icon={
              <Ionicons
                name="swap-vertical"
                size={14}
                color={sortOrder !== 'desc' ? theme.primary?.val : theme.textTertiary?.val}
              />
            }
            onPress={toggleSortOrder}
          />
          {hasActiveFilters ? (
            <AppChip
              label="Clear"
              icon={
                <Ionicons
                  name="close"
                  size={14}
                  color={theme.textSecondary?.val}
                />
              }
              onPress={handleClearFilters}
            />
          ) : null}
        </XStack>
      </ScrollView>
    </YStack>
  ) : null;

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
      showAlert('Delete expense', 'This will remove the expense from history.', [
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
              showAlert(
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

  const handleSwipeOpen = useCallback(
    (
      direction: 'left' | 'right',
      itemId: string,
      label: string,
      swipeable: Swipeable,
    ) => {
      if (direction === 'right') {
        confirmDelete(itemId, label);
      } else {
        router.push(`/expense/${itemId}`);
      }
      swipeable.close();
    },
    [confirmDelete, router],
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
      showAlert(
        'Undo failed',
        err instanceof Error ? err.message : 'Unable to restore expense.',
      );
    }
  }, [pendingDeleteId, restoreExpense]);

  const renderLeftActions = () => (
    <XStack flex={1} backgroundColor="$primary" alignItems="center" justifyContent="center">
      <SwipeAction>
        <Ionicons name="create-outline" size={20} color={theme.textInverse?.val} />
        <Text color="$textInverse" fontSize={12} fontWeight="600">
          Edit
        </Text>
      </SwipeAction>
    </XStack>
  );

  const renderRightActions = () => (
    <XStack flex={1} backgroundColor="$danger" alignItems="center" justifyContent="center">
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
        onSwipeableOpen={(direction, swipeable) =>
          handleSwipeOpen(direction, item.id, item.title, swipeable)
        }
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
          padding={space.md}
          borderRadius={radius.xs}
          backgroundColor="$background"
          onPress={() => router.push(`/expense/${item.id}`)}
        />
      </Swipeable>
    </SwipeContainer>
  );

  const stickyHeaderIndices = listHeader ? [0] : undefined;

  return (
    <YStack flex={1} backgroundColor="$background">
      {alertDialog}
      <ScreenLayout
        scrollable={false}
        gap={contentGap}
        paddingVertical={contentPadding}
        headerPaddingBottom={headerPaddingBottom}
        header={(
          <YStack gap={6}>
            <XStack alignItems="center" justifyContent="space-between">
              <Text color="$textPrimary" fontSize={24} fontWeight="700">
                History
              </Text>
              <XStack gap={8}>
                <AppIconButton
                  tone={isSearchMode ? 'soft' : 'surface'}
                  icon={(
                    <Ionicons
                      name={isSearchMode ? 'close' : 'search-outline'}
                      size={18}
                      color={isSearchMode ? theme.primary?.val : theme.textPrimary?.val}
                    />
                  )}
                  onPress={isSearchMode ? exitSearch : enterSearch}
                />
                {!isSearchMode ? (
                  <AppIconButton
                    tone="surface"
                    icon={<Ionicons name="funnel-outline" size={18} color={theme.textPrimary?.val} />}
                    onPress={() => setFilterSheetOpen(true)}
                  />
                ) : null}
              </XStack>
            </XStack>
            {isSearchMode ? (
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by merchant, note, or category"
                autoFocus
                onBlur={handleSearchBlur}
              />
            ) : null}
          </YStack>
        )}
      >
        <ExpenseList
          data={listData}
          renderItem={renderItem}
          listStyle={{ flex: 1 }}
          listHeader={listHeader}
          stickyHeaderIndices={stickyHeaderIndices}
          extraData={isSearchMode}
          itemSpacing={space[0]}
          isLoading={isLoadingRecent}
          error={error ?? undefined}
          onRetry={() =>
            fetchRecent({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            })
          }
          onRefresh={() =>
            fetchRecent({
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            })
          }
          refreshing={isLoadingRecent}
          emptyTitle="No matching expenses"
          emptyDescription="Try a different filter or search term."
          emptyActionLabel="Add expense"
          onEmptyAction={() => router.push('/expense/add')}
        />
      </ScreenLayout>

      <Sheet
        modal
        open={filterSheetOpen}
        onOpenChange={handleFilterSheetChange}
        snapPoints={[80]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          bg="$overlay"
        />
        <Sheet.Frame padding={20} gap={16} backgroundColor="$background">
          <XStack alignItems="center" justifyContent="space-between">
            <YStack gap={4}>
              <Text color="$textPrimary" fontSize={18} fontWeight="700">
                Filters
              </Text>
              <Text color="$textSecondary" fontSize={12}>
                Adjust date and category filters.
              </Text>
            </YStack>
            <AppIconButton
              tone="surface"
              icon={<Ionicons name="close" size={18} color={theme.textPrimary?.val} />}
              onPress={() => handleFilterSheetChange(false)}
            />
          </XStack>

          <YStack gap={8}>
            <Text color="$textSecondary" fontSize={12} fontWeight="600">
              Date range
            </Text>
            <XStack gap={8} flexWrap="wrap">
              {datePresets.map((preset) => {
                const range = preset.getRange();
                const isActive = activePresetId === preset.id;
                return (
                  <AppChip
                    key={preset.id}
                    label={preset.label}
                    active={isActive}
                    onPress={() => applyDateRange(range)}
                  />
                );
              })}
              <AppChip
                label="Custom range"
                active={isCustomRangeActive}
                icon={
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={theme.textSecondary?.val}
                  />
                }
                onPress={() => setIsDatePickerOpen(true)}
              />
            </XStack>
          </YStack>

          <YStack gap={8}>
            <Text color="$textSecondary" fontSize={12} fontWeight="600">
              Categories
            </Text>
            <SearchBar
              value={categoryQuery}
              onChangeText={setCategoryQuery}
              placeholder="Search categories"
            />
          </YStack>
          <XStack alignItems="center" justifyContent="space-between">
            <Text color="$textSecondary" fontSize={12}>
              {selectedCategoryIds.length} selected
            </Text>
            <XStack gap={8}>
              <AppChip
                label="Select all"
                active={allFilteredSelected}
                onPress={handleSelectAllCategories}
              />
              <AppChip
                label="Clear"
                active={selectedCategoryIds.length > 0}
                onPress={handleClearCategories}
              />
            </XStack>
          </XStack>

          <ScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 12 }}
          >
            <YStack gap={6}>
              {filteredCategories.map((category) => {
                const iconColor = resolveCategoryColor(category.colorToken);
                const iconName = resolveCategoryIcon(
                  category.icon,
                  'pricetag-outline',
                ) as IconName;
                const isSelected = selectedCategoryIds.includes(category.id);
                return (
                  <CategoryOptionRow
                    key={category.id}
                    onPress={() => toggleCategorySelection(category.id)}
                  >
                    <XStack alignItems="center" gap={12} flex={1}>
                      <YStack
                        width={36}
                        height={36}
                        borderRadius={12}
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={resolveTint(iconColor)}
                      >
                        <Ionicons name={iconName} size={18} color={iconColor} />
                      </YStack>
                      <Text color="$textPrimary" fontSize={14} fontWeight="600">
                        {category.name}
                      </Text>
                    </XStack>
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={isSelected ? theme.primary?.val : theme.textTertiary?.val}
                    />
                  </CategoryOptionRow>
                );
              })}
              {filteredCategories.length === 0 ? (
                <YStack paddingVertical={12} alignItems="center">
                  <Text color="$textSecondary" fontSize={12}>
                    No categories match that search.
                  </Text>
                </YStack>
              ) : null}
            </YStack>
          </ScrollView>

          <XStack gap={12} paddingBottom={insets.bottom}>
            <AppButton
              label="Clear all"
              tone="ghost"
              onPress={handleClearFilters}
            />
            <AppButton
              label="Done"
              tone="primary"
              onPress={() => handleFilterSheetChange(false)}
            />
          </XStack>
        </Sheet.Frame>
      </Sheet>

      <DatePickerModal
        locale="en-GB"
        mode="range"
        visible={isDatePickerOpen}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onConfirm={({ startDate, endDate }) => {
          if (startDate && endDate) {
            handleRangeChange({ startDate, endDate });
          } else {
            setIsDatePickerOpen(false);
          }
        }}
        onDismiss={() => setIsDatePickerOpen(false)}
      />

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
