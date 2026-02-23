import { Text, YStack } from 'tamagui';
import { AmountInput, CategoryPicker, DateSelector, InputField } from '../molecules';
import { AppButton } from '../atoms';
import type { CategoryOption } from '../molecules/CategoryPicker';

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

      <InputField
        label="Note (optional)"
        placeholder="Add a note"
        value={note ?? ''}
        onChangeText={onNoteChange}
        multiline
        textAlignVertical="top"
        height={88}
        error={errors?.note}
      />

      <InputField
        label="Merchant (optional)"
        placeholder="Where did you spend?"
        value={merchant ?? ''}
        onChangeText={onMerchantChange}
        error={errors?.merchant}
      />

      <InputField
        label="Payment method (optional)"
        placeholder="Card, cash, bank"
        value={paymentMethod ?? ''}
        onChangeText={onPaymentMethodChange}
        error={errors?.paymentMethod}
      />

      <AppButton
        label={isSubmitting ? 'Saving...' : submitLabel}
        onPress={isSubmitting ? undefined : onSubmit}
        opacity={isSubmitting ? 0.7 : 1}
      />
    </YStack>
  );
}
