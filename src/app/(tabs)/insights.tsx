/**
 * Insights Screen - Charts and analytics
 */
import { useEffect, useMemo, useState } from 'react';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Text, XStack, YStack } from 'tamagui';
import {
  AppBadge,
  AppCard,
  AppSpinner,
  CategoryBreakdown,
  ErrorCard,
  ScreenContainer,
  SpendingTrendChart,
} from '../../components';
import { expensesRepo } from '../../repositories';
import { useExpenseStore, useSettingsStore } from '../../store';
import { resolveCategoryColor } from '../../utils/categories';
import {
  formatAmountMinor,
  formatMonthLabel,
  getCurrencySymbol,
} from '../../utils/formatters';

export default function InsightsScreen() {
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

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  useEffect(() => {
    const now = new Date();
    fetchCategoryBreakdown(now.getFullYear(), now.getMonth() + 1);
  }, [fetchCategoryBreakdown]);

  useEffect(() => {
    let isActive = true;
    const loadTrend = async () => {
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

        if (isActive) {
          setTrendData(points);
        }
      } catch (err) {
        if (isActive) {
          setTrendError(err instanceof Error ? err.message : 'Failed to load trends.');
        }
      } finally {
        if (isActive) {
          setIsLoadingTrend(false);
        }
      }
    };

    loadTrend();

    return () => {
      isActive = false;
    };
  }, []);

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

  return (
    <ScreenContainer gap={20}>
      <Text color="$textPrimary" fontSize={24} fontWeight="700">
        Insights
      </Text>

      {isLoadingBreakdown && breakdownData.length === 0 ? (
        <AppCard alignItems="center" paddingVertical={24}>
          <AppSpinner size="large" />
        </AppCard>
      ) : error && breakdownData.length === 0 ? (
        <ErrorCard message={error} />
      ) : (
        <CategoryBreakdown data={breakdownData} totalLabel={`Total (${currency})`} />
      )}

      {isLoadingTrend ? (
        <AppCard alignItems="center" paddingVertical={24}>
          <AppSpinner size="large" />
        </AppCard>
      ) : trendError ? (
        <ErrorCard message={trendError} />
      ) : (
        <SpendingTrendChart data={trendData} />
      )}

      <YStack gap={12}>
        <Text color="$textPrimary" fontSize={17} fontWeight="600">
          Top Categories
        </Text>
        <YStack gap={10}>
          {topCategories.length === 0 ? (
            <AppCard>
              <Text color="$textSecondary" fontSize={13}>
                No category totals yet.
              </Text>
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
                      backgroundColor={`${category.color}20`}
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
                    label={`${currencySymbol}${formatAmountMinor(category.totalMinor)}`}
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
