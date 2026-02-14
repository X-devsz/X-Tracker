import { ScrollView } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { DateSelector, FilterChip } from '../molecules';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  title?: string;
  date?: Date;
  onDateChange?: (date: Date) => void;
  onOpenDatePicker?: () => void;
  filters: FilterOption[];
  activeFilterId?: string;
  onFilterSelect?: (filter: FilterOption) => void;
}

export function FilterBar({
  title = 'Filters',
  date,
  onDateChange,
  onOpenDatePicker,
  filters,
  activeFilterId,
  onFilterSelect,
}: FilterBarProps) {
  return (
    <YStack gap={12}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {title}
      </Text>
      <DateSelector
        value={date}
        onChange={onDateChange}
        onOpenPicker={onOpenDatePicker}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={8}>
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              count={filter.count}
              active={filter.id === activeFilterId}
              onPress={() => onFilterSelect?.(filter)}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
