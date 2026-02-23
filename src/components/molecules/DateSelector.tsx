import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { useState } from 'react';
import { DatePickerModal } from 'react-native-paper-dates';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { AppChip } from '../atoms';

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

interface DatePreset {
  label: string;
  date: Date;
}

interface DateSelectorProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  onOpenPicker?: () => void;
  showPresets?: boolean;
  presets?: DatePreset[];
}

const getDisplayLabel = (value?: Date) => {
  if (!value) return 'Select date';
  if (isToday(value)) return 'Today';
  if (isYesterday(value)) return 'Yesterday';
  return format(value, 'MMM d, yyyy');
};

export function DateSelector({
  label = 'Date',
  value,
  onChange,
  onOpenPicker,
  showPresets = true,
  presets,
}: DateSelectorProps) {
  const theme = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const fallbackPresets = [
    { label: 'Today', date: new Date() },
    { label: 'Yesterday', date: subDays(new Date(), 1) },
  ];
  const displayPresets = presets ?? fallbackPresets;
  const resolvedValue = value ?? new Date();

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

  const handleConfirm = ({ date }: { date: Date | undefined }) => {
    setIsPickerOpen(false);
    if (date) {
      onChange?.(date);
    }
  };

  return (
    <YStack gap={12}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {label}
      </Text>
      <DateField onPress={handleOpenPicker}>
        <XStack alignItems="center" gap={8}>
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
          mode="single"
          visible={isPickerOpen}
          date={resolvedValue}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
        />
      ) : null}
      {showPresets ? (
        <XStack gap={8} flexWrap="wrap">
          {displayPresets.map((preset) => (
            <AppChip
              key={preset.label}
              label={preset.label}
              active={Boolean(value && format(preset.date, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd'))}
              onPress={() => onChange?.(preset.date)}
            />
          ))}
        </XStack>
      ) : null}
    </YStack>
  );
}
