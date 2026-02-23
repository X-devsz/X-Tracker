/**
 * Home Screen - Dashboard
 *
 * Overview with monthly summary and recent expenses.
 */
import { useCallback, useEffect, useMemo, useState, type ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { subDays } from 'date-fns';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import {
  AppCard,
  AppIconButton,
  AppSkeleton,
  EmptyState,
  ErrorCard,
  ExpenseListItem,
  MonthlySummaryCard,
  QuickAddFAB,
  ScreenContainer,
} from '../../components';
import { useCategoryStore, useExpenseStore, useSettingsStore } from '../../store';
import { expensesRepo } from '../../repositories';
import { resolveCategoryColor, resolveCategoryIcon } from '../../utils/categories';
import {
  formatAmountMinor,
  formatExpenseDate,
  getCurrencySymbol,
} from '../../utils/formatters';
import { useScreenRenderTimer } from '../../services/performance';

type IconName = keyof typeof Ionicons.glyphMap;
type StatCard = {
  id: string;
  label: string;
  value: string;
  icon: IconName;
  backgroundColor: ComponentProps<typeof XStack>['backgroundColor'];
  iconColor: 'success' | 'warning';
};

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { currency } = useSettingsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const {
    recentExpenses,
    monthlySummary,
    summaryQuery,
    isLoadingRecent,
    isLoadingSummary,
    error,
    fetchRecent,
    fetchMonthlySummary,
  } = useExpenseStore();
  const [changePercent, setChangePercent] = useState<number | undefined>(undefined);
  const [changeLabel, setChangeLabel] = useState('vs last month');

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);
  const isSummaryLoading = isLoadingSummary && !monthlySummary;
  const isRecentLoading = isLoadingRecent && recentExpenses.length === 0;
  const isStatsLoading = isLoadingSummary || categories.length === 0;
  const isRefreshing = isLoadingSummary || isLoadingRecent;
  const isRenderReady = !isLoadingSummary && !isLoadingRecent;

  const quickStats = useMemo<StatCard[]>(
    () => [
      {
        id: 'transactions',
        label: 'Transactions',
        value: `${monthlySummary?.count ?? 0}`,
        icon: 'arrow-down',
        backgroundColor: '$successLight',
        iconColor: 'success',
      },
      {
        id: 'categories',
        label: 'Categories',
        value: `${categories.length}`,
        icon: 'layers',
        backgroundColor: '$warningLight',
        iconColor: 'warning',
      },
    ],
    [monthlySummary?.count, categories.length],
  );

  const recentItems = useMemo(
    () =>
      recentExpenses.slice(0, 4).map((expense) => {
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
    [recentExpenses, currencySymbol],
  );

  const refreshDashboard = useCallback(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    fetchRecent({ startDate, endDate });
    fetchMonthlySummary(endDate.getFullYear(), endDate.getMonth() + 1);
    fetchCategories();
  }, [fetchRecent, fetchMonthlySummary, fetchCategories]);

  useFocusEffect(
    useCallback(() => {
      refreshDashboard();
    }, [refreshDashboard]),
  );

  useEffect(() => {
    let isActive = true;
    if (!monthlySummary) {
      setChangePercent(undefined);
      return;
    }

    const { year, month } = summaryQuery;
    const previousDate = new Date(year, month - 2, 1);
    const prevYear = previousDate.getFullYear();
    const prevMonth = previousDate.getMonth() + 1;

    expensesRepo.getMonthlySummary(prevYear, prevMonth).then((prev) => {
      if (!isActive) return;
      if (prev.totalMinor === 0) {
        setChangePercent(0);
        setChangeLabel('no previous data');
        return;
      }
      const diff = monthlySummary.totalMinor - prev.totalMinor;
      setChangePercent((diff / prev.totalMinor) * 100);
      setChangeLabel('vs last month');
    });

    return () => {
      isActive = false;
    };
  }, [monthlySummary, summaryQuery]);

  useScreenRenderTimer('Home', isRenderReady);

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScreenContainer gap={20} refreshing={isRefreshing} onRefresh={refreshDashboard}>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$textSecondary" fontSize={13} fontWeight="500">
              Welcome back
            </Text>
            <Text color="$textPrimary" fontSize={24} fontWeight="700">
              Dashboard
            </Text>
          </YStack>
          <AppIconButton
            tone="soft"
            icon={<Ionicons name="person" size={20} color={theme.primary?.val} />}
          />
        </XStack>

        <MonthlySummaryCard
          amount={formatAmountMinor(monthlySummary?.totalMinor ?? 0)}
          currencySymbol={currencySymbol}
          changePercent={changePercent}
          changeLabel={changeLabel}
          isLoading={isSummaryLoading}
        />

        {isStatsLoading ? (
          <XStack gap={12}>
            {Array.from({ length: 2 }).map((_, index) => (
              <AppCard
                key={`stat-skeleton-${index}`}
                elevated
                flex={1}
                padding={16}
                gap={6}
              >
                <AppSkeleton width={36} height={36} borderRadius={12} />
                <AppSkeleton width="60%" height={10} borderRadius={6} />
                <AppSkeleton width="50%" height={18} borderRadius={8} />
              </AppCard>
            ))}
          </XStack>
        ) : (
          <XStack gap={12}>
            {quickStats.map((stat) => {
              const iconColor =
                stat.iconColor === 'success' ? theme.success?.val : theme.warning?.val;

              return (
                <AppCard
                  key={stat.id}
                  elevated
                  flex={1}
                  padding={16}
                  gap={6}
                >
                  <XStack
                    width={36}
                    height={36}
                    borderRadius={12}
                    backgroundColor={stat.backgroundColor}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons
                      name={stat.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={iconColor}
                    />
                  </XStack>
                  <Text color="$textSecondary" fontSize={11}>
                    {stat.label}
                  </Text>
                  <Text color="$textPrimary" fontSize={20} fontWeight="700">
                    {stat.value}
                  </Text>
                </AppCard>
              );
            })}
          </XStack>
        )}

        <YStack gap={12}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text color="$textPrimary" fontSize={17} fontWeight="600">
              Recent Expenses
            </Text>
            <Text
              color="$primary"
              fontSize={13}
              fontWeight="500"
              onPress={() => router.push('/(tabs)/history')}
            >
              See All
            </Text>
          </XStack>

          {isRecentLoading ? (
            <YStack gap={12}>
              {Array.from({ length: 3 }).map((_, index) => (
                <AppCard key={`recent-skeleton-${index}`} padding={16}>
                  <XStack alignItems="center" justifyContent="space-between" gap={12}>
                    <XStack alignItems="center" gap={12} flex={1}>
                      <AppSkeleton width={44} height={44} borderRadius={14} />
                      <YStack gap={6} flex={1}>
                        <AppSkeleton height={12} width="60%" borderRadius={6} />
                        <AppSkeleton height={10} width="40%" borderRadius={6} />
                      </YStack>
                    </XStack>
                    <YStack alignItems="flex-end" gap={6}>
                      <AppSkeleton height={12} width={60} borderRadius={6} />
                      <AppSkeleton height={10} width={48} borderRadius={6} />
                    </YStack>
                  </XStack>
                </AppCard>
              ))}
            </YStack>
          ) : error && recentExpenses.length === 0 ? (
            <ErrorCard
              message={error}
              onRetry={refreshDashboard}
            />
          ) : recentItems.length === 0 ? (
            <EmptyState
              icon={
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
              }
              title="No expenses yet"
              description="Tap the button below to add your first expense."
              actionLabel="Add expense"
              onAction={() => router.push('/expense/add')}
            />
          ) : (
            <YStack gap={12}>
              {recentItems.map((item) => (
                <ExpenseListItem
                  key={item.id}
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
              ))}
            </YStack>
          )}
        </YStack>
      </ScreenContainer>

      <QuickAddFAB onPress={() => router.push('/expense/add')} />
    </YStack>
  );
}
