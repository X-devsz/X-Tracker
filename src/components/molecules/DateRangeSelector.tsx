import { Ionicons } from '@expo/vector-icons';
import { format, isSameDay } from 'date-fns';
import { useState } from 'react';
import { DatePickerModal } from 'react-native-paper-dates';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { formatDateRange } from '../../utils/formatters';

const DateField = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  animation: 'fast',
  pressStyle: { scale: 0.98, borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
});

interface DateRangeValue {
  startDate: Date;
  endDate: Date;
}

interface DateRangeSelectorProps {
  label?: string;
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  onOpenPicker?: () => void;
}

const getDisplayLabel = (value?: DateRangeValue) => {
  if (!value) return 'Select range';
  if (isSameDay(value.startDate, value.endDate)) {
    return format(value.startDate, 'MMM d, yyyy');
  }
  return formatDateRange(value.startDate, value.endDate);
};

export function DateRangeSelector({
  label = 'Date range',
  value,
  onChange,
  onOpenPicker,
}: DateRangeSelectorProps) {
  const theme = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleOpenPicker = () => {
    if (onOpenPicker) {
      onOpenPicker();
      return;
    }
    setIsPickerOpen(true);
  };

  const handleDismiss = () => {
    setIsPickerOpen(false);
  };

  const handleConfirm = ({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }) => {
    setIsPickerOpen(false);
    if (startDate && endDate) {
      onChange?.({ startDate, endDate });
    }
  };

  return (
    <YStack gap={12}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {label}
      </Text>
      <DateField onPress={handleOpenPicker}>
        <XStack alignItems="center" gap={8} flex={1}>
          <Ionicons name="calendar-outline" size={18} color={theme.textTertiary?.val} />
          <Text color={value ? '$textPrimary' : '$textTertiary'} fontSize={14}>
            {getDisplayLabel(value)}
          </Text>
        </XStack>
        <Ionicons name="chevron-down" size={16} color={theme.textTertiary?.val} />
      </DateField>
      {!onOpenPicker ? (
        <DatePickerModal
          locale="en-GB"
          mode="range"
          visible={isPickerOpen}
          startDate={value?.startDate}
          endDate={value?.endDate}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
        />
      ) : null}
    </YStack>
  );
}
