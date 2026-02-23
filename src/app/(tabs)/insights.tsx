/**
 * Insights Screen - Charts and analytics
 */
import { useCallback, useEffect, useMemo, useState, type ComponentProps } from 'react';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { useRouter } from 'expo-router';
import { Text, XStack, YStack } from 'tamagui';
import {
  AppBadge,
  AppCard,
  AppSkeleton,
  CategoryBreakdown,
  EmptyState,
  ErrorCard,
  ScreenContainer,
  SpendingTrendChart,
} from '../../components';
import { expensesRepo } from '../../repositories';
import { useExpenseStore, useSettingsStore } from '../../store';
import { resolveCategoryColor } from '../../utils/categories';
import { formatCurrency, formatMonthLabel } from '../../utils/formatters';
import { useScreenRenderTimer } from '../../services/performance';

export default function InsightsScreen() {
  const router = useRouter();
  const { currency } = useSettingsStore();
  const {
    categoryBreakdown,
    isLoadingBreakdown,
    fetchCategoryBreakdown,
    error,
  } = useExpenseStore();
  const [trendData, setTrendData] = useState<{ value: number; label: string }[]>([]);
  const [isLoadingTrend, setIsLoadingTrend] = useState(false);
  const [trendError, setTrendError] = useState<string | null>(null);
  const isRenderReady = !isLoadingBreakdown && !isLoadingTrend;

  const refreshBreakdown = useCallback(() => {
    const now = new Date();
    fetchCategoryBreakdown(now.getFullYear(), now.getMonth() + 1);
  }, [fetchCategoryBreakdown]);

  const loadTrend = useCallback(async () => {
    setIsLoadingTrend(true);
    setTrendError(null);
    try {
      const now = new Date();
      const startDate = startOfMonth(subMonths(now, 5));
      const endDate = endOfMonth(now);
      const expenses = await expensesRepo.listByDateRange(startDate, endDate);
      const totals = new Map<string, number>();

      expenses.forEach((expense) => {
        const date = expense.occurredAt;
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        totals.set(key, (totals.get(key) ?? 0) + expense.amountMinor);
      });

      const points = Array.from({ length: 6 }).map((_, index) => {
        const monthDate = subMonths(new Date(now.getFullYear(), now.getMonth(), 1), 5 - index);
        const key = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
        const totalMinor = totals.get(key) ?? 0;
        return {
          label: formatMonthLabel(monthDate),
          value: Number((totalMinor / 100).toFixed(2)),
        };
      });

      setTrendData(points);
    } catch (err) {
      setTrendError(err instanceof Error ? err.message : 'Failed to load trends.');
    } finally {
      setIsLoadingTrend(false);
    }
  }, []);

  useEffect(() => {
    refreshBreakdown();
  }, [refreshBreakdown]);

  useEffect(() => {
    loadTrend();
  }, [loadTrend]);

  useScreenRenderTimer('Insights', isRenderReady);

  const breakdownData = useMemo(
    () =>
      categoryBreakdown.map((item) => ({
        label: item.categoryName ?? 'Uncategorized',
        value: item.totalMinor / 100,
        color: resolveCategoryColor(item.categoryColorToken),
      })),
    [categoryBreakdown],
  );

  const topCategories = useMemo(
    () =>
      categoryBreakdown.slice(0, 3).map((item) => ({
        label: item.categoryName ?? 'Uncategorized',
        totalMinor: item.totalMinor,
        color: resolveCategoryColor(item.categoryColorToken),
      })),
    [categoryBreakdown],
  );

  const resolveCategoryTint = useCallback(
    (color: string) => (`${color}20` as ComponentProps<typeof YStack>['backgroundColor']),
    [],
  );

  return (
    <ScreenContainer gap={20}>
      <Text color="$textPrimary" fontSize={24} fontWeight="700">
        Insights
      </Text>

      {isLoadingBreakdown && breakdownData.length === 0 ? (
        <AppCard>
          <YStack gap={16}>
            <AppSkeleton height={12} width="50%" borderRadius={6} />
            <XStack alignItems="center" gap={16}>
              <AppSkeleton width={140} height={140} borderRadius={70} />
              <YStack flex={1} gap={10}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <XStack key={`breakdown-skeleton-${index}`} gap={8} alignItems="center">
                    <AppSkeleton width={10} height={10} borderRadius={5} />
                    <AppSkeleton height={10} width="55%" borderRadius={6} />
                  </XStack>
                ))}
              </YStack>
            </XStack>
          </YStack>
        </AppCard>
      ) : error && breakdownData.length === 0 ? (
        <ErrorCard message={error} onRetry={refreshBreakdown} />
      ) : (
        <CategoryBreakdown
          data={breakdownData}
          totalLabel={`Total (${currency})`}
          emptyActionLabel="Add expense"
          onEmptyAction={() => router.push('/expense/add')}
        />
      )}

      {isLoadingTrend ? (
        <AppCard>
          <YStack gap={16}>
            <XStack alignItems="center" justifyContent="space-between">
              <AppSkeleton height={12} width="40%" borderRadius={6} />
              <AppSkeleton height={10} width={80} borderRadius={6} />
            </XStack>
            <AppSkeleton height={140} borderRadius={12} />
          </YStack>
        </AppCard>
      ) : trendError ? (
        <ErrorCard message={trendError} onRetry={loadTrend} />
      ) : (
        <SpendingTrendChart
          data={trendData}
          emptyActionLabel="Add expense"
          onEmptyAction={() => router.push('/expense/add')}
        />
      )}

      <YStack gap={12}>
        <Text color="$textPrimary" fontSize={17} fontWeight="600">
          Top Categories
        </Text>
        <YStack gap={10}>
          {isLoadingBreakdown && topCategories.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <AppCard key={`top-skeleton-${index}`} elevated padding={16}>
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap={10}>
                    <AppSkeleton width={36} height={36} borderRadius={12} />
                    <AppSkeleton height={12} width="40%" borderRadius={6} />
                  </XStack>
                  <AppSkeleton height={20} width={70} borderRadius={10} />
                </XStack>
              </AppCard>
            ))
          ) : topCategories.length === 0 ? (
            <AppCard>
              <EmptyState
                title="No category totals yet"
                description="Add expenses to see your top categories."
                actionLabel="Add expense"
                onAction={() => router.push('/expense/add')}
              />
            </AppCard>
          ) : (
            topCategories.map((category) => (
              <AppCard key={category.label} elevated padding={16}>
                <XStack alignItems="center" justifyContent="space-between">
                  <XStack alignItems="center" gap={10}>
                    <YStack
                      width={36}
                      height={36}
                      borderRadius={12}
                      backgroundColor={resolveCategoryTint(category.color)}
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
                  <AppBadge
                    label={formatCurrency(category.totalMinor, currency)}
                    tone="neutral"
                  />
                </XStack>
              </AppCard>
            ))
          )}
        </YStack>
      </YStack>
    </ScreenContainer>
  );
}
