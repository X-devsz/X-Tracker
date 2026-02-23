import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { AmountInput, CategoryPicker, DateSelector } from '../molecules';
import { AppButton, AppInput } from '../atoms';
import type { CategoryOption } from '../molecules/CategoryPicker';

const FieldContainer = styled(YStack, {
  gap: 6,
});

const InputShell = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  alignItems: 'center',
  height: 52,
  gap: 8,
  animation: 'fast',
  pressStyle: { borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
});

const TextAreaShell = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  paddingVertical: 12,
  alignItems: 'flex-start',
  minHeight: 100,
  animation: 'fast',
  pressStyle: { borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
});

interface ExpenseFormErrors {
  amount?: string;
  category?: string;
  date?: string;
  note?: string;
  merchant?: string;
  paymentMethod?: string;
}

interface ExpenseFormProps {
  amount: string;
  onAmountChange: (value: string) => void;
  currencySymbol?: string;
  categories: CategoryOption[];
  selectedCategoryId?: string;
  onCategorySelect?: (category: CategoryOption) => void;
  date?: Date;
  onDateChange?: (date: Date) => void;
  onOpenDatePicker?: () => void;
  note?: string;
  onNoteChange?: (value: string) => void;
  merchant?: string;
  onMerchantChange?: (value: string) => void;
  paymentMethod?: string;
  onPaymentMethodChange?: (value: string) => void;
  onSubmit?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  errors?: ExpenseFormErrors;
}

export function ExpenseForm({
  amount,
  onAmountChange,
  currencySymbol = '$',
  categories,
  selectedCategoryId,
  onCategorySelect,
  date,
  onDateChange,
  onOpenDatePicker,
  note,
  onNoteChange,
  merchant,
  onMerchantChange,
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
  submitLabel = 'Save Expense',
  isSubmitting,
  errors,
}: ExpenseFormProps) {
  const theme = useTheme();

  return (
    <YStack gap={18}>
      <AmountInput
        value={amount}
        onChangeValue={onAmountChange}
        error={errors?.amount}
        currencySymbol={currencySymbol}
      />

      <YStack gap={8}>
        <CategoryPicker
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={onCategorySelect}
        />
        {errors?.category ? (
          <Text color="$danger" fontSize={12}>
            {errors.category}
          </Text>
        ) : null}
      </YStack>

      <YStack gap={8}>
        <DateSelector
          value={date}
          onChange={onDateChange}
          onOpenPicker={onOpenDatePicker}
        />
        {errors?.date ? (
          <Text color="$danger" fontSize={12}>
            {errors.date}
          </Text>
        ) : null}
      </YStack>

      <FieldContainer>
        <Text color="$textSecondary" fontSize={12} fontWeight="600">
          Note (optional)
        </Text>
        <TextAreaShell>
          <AppInput
            placeholder="Add a note"
            placeholderTextColor={theme.textTertiary?.val}
            value={note}
            onChangeText={onNoteChange}
            multiline
            textAlignVertical="top"
            height={88}
          />
        </TextAreaShell>
        {errors?.note ? (
          <Text color="$danger" fontSize={12}>
            {errors.note}
          </Text>
        ) : null}
      </FieldContainer>

      <FieldContainer>
        <Text color="$textSecondary" fontSize={12} fontWeight="600">
          Merchant (optional)
        </Text>
        <InputShell>
          <AppInput
            placeholder="Where did you spend?"
            placeholderTextColor={theme.textTertiary?.val}
            value={merchant}
            onChangeText={onMerchantChange}
          />
        </InputShell>
        {errors?.merchant ? (
          <Text color="$danger" fontSize={12}>
            {errors.merchant}
          </Text>
        ) : null}
      </FieldContainer>

      <FieldContainer>
        <Text color="$textSecondary" fontSize={12} fontWeight="600">
          Payment method (optional)
        </Text>
        <InputShell>
          <AppInput
            placeholder="Card, cash, bank"
            placeholderTextColor={theme.textTertiary?.val}
            value={paymentMethod}
            onChangeText={onPaymentMethodChange}
          />
        </InputShell>
        {errors?.paymentMethod ? (
          <Text color="$danger" fontSize={12}>
            {errors.paymentMethod}
          </Text>
        ) : null}
      </FieldContainer>

      <AppButton
        label={isSubmitting ? 'Saving...' : submitLabel}
        onPress={isSubmitting ? undefined : onSubmit}
        opacity={isSubmitting ? 0.7 : 1}
      />
    </YStack>
  );
}
