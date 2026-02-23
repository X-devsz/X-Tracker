import { FlatList, type ListRenderItem } from 'react-native';
import type { ComponentProps } from 'react';
import { XStack, YStack } from 'tamagui';
import { AppCard, AppSkeleton } from '../atoms';
import { EmptyState, ErrorCard, ExpenseListItem } from '../molecules';

export interface ExpenseListItemData {
  id: string;
  title: string;
  category: string;
  amount: number | string;
  date: string;
  note?: string;
  currencySymbol?: string;
  iconName?: ComponentProps<typeof ExpenseListItem>['iconName'];
  iconColor?: string;
  iconBackgroundColor?: string;
}

interface ExpenseListProps {
  data: ExpenseListItemData[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onItemPress?: (item: ExpenseListItemData) => void;
  renderItem?: ListRenderItem<ExpenseListItemData>;
  keyExtractor?: (item: ExpenseListItemData) => string;
  contentContainerStyle?: ComponentProps<typeof FlatList>['contentContainerStyle'];
  listStyle?: ComponentProps<typeof FlatList>['style'];
}

export function ExpenseList({
  data,
  isLoading,
  error,
  onRetry,
  onRefresh,
  refreshing,
  emptyTitle = 'No expenses yet',
  emptyDescription = 'Start tracking your spending to see it here.',
  emptyActionLabel,
  onEmptyAction,
  onItemPress,
  renderItem,
  keyExtractor,
  contentContainerStyle,
  listStyle,
}: ExpenseListProps) {
  if (isLoading && data.length === 0) {
    return (
      <YStack gap={12} paddingVertical={8}>
        {Array.from({ length: 4 }).map((_, index) => (
          <AppCard key={`skeleton-${index}`} padding={16}>
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
    );
  }

  if (error && data.length === 0) {
    return (
      <ErrorCard
        message={error}
        onRetry={onRetry}
      />
    );
  }

  const defaultRenderItem: ListRenderItem<ExpenseListItemData> = ({ item }) => (
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
      onPress={onItemPress ? () => onItemPress(item) : undefined}
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem ?? defaultRenderItem}
      keyExtractor={keyExtractor ?? ((item) => item.id)}
      contentContainerStyle={contentContainerStyle ?? { paddingBottom: 24 }}
      style={listStyle}
      ItemSeparatorComponent={() => <YStack height={12} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      }
    />
  );
}
