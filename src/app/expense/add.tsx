/**
 * Add Expense Screen - Modal form
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import type { CategoryOption } from '../../components/molecules/CategoryPicker';
import { AppSpinner, ErrorCard, ExpenseForm, ModalLayout } from '../../components';
import { useCategoryStore, useExpenseStore, useSettingsStore } from '../../store';
import { resolveCategoryColor, resolveCategoryIcon } from '../../utils/categories';
import { getCurrencySymbol, parseAmountToMinor } from '../../utils/formatters';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { currency } = useSettingsStore();
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  const { createExpense } = useExpenseStore();
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [note, setNote] = useState('');
  const [merchant, setMerchant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    amount?: string;
    category?: string;
    date?: string;
  }>({});

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoryOptions = useMemo<CategoryOption[]>(
    () =>
      categories.map((category) => ({
        id: category.id,
        label: category.name,
        iconName: resolveCategoryIcon(category.icon) as CategoryOption['iconName'],
        color: resolveCategoryColor(category.colorToken),
      })),
    [categories],
  );

  useEffect(() => {
    if (!selectedCategoryId && categoryOptions.length > 0) {
      setSelectedCategoryId(categoryOptions[0]?.id);
    }
  }, [categoryOptions, selectedCategoryId]);

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }, [router]);

  const handleSubmit = useCallback(async () => {
    const nextErrors: { amount?: string; category?: string; date?: string } = {};
    const amountMinor = parseAmountToMinor(amount);

    if (!amount || amountMinor <= 0) {
      nextErrors.amount = 'Enter a valid amount.';
    }
    if (!selectedCategoryId) {
      nextErrors.category = 'Select a category.';
    }
    if (!date) {
      nextErrors.date = 'Pick a date.';
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createExpense({
        amountMinor,
        currency,
        categoryId: selectedCategoryId!,
        occurredAt: date!,
        note: note.trim() ? note.trim() : undefined,
        merchant: merchant.trim() ? merchant.trim() : undefined,
        paymentMethod: paymentMethod.trim() ? paymentMethod.trim() : undefined,
      });
      handleClose();
    } catch (err) {
      Alert.alert(
        'Save failed',
        err instanceof Error ? err.message : 'Unable to save expense.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    amount,
    selectedCategoryId,
    date,
    note,
    merchant,
    paymentMethod,
    createExpense,
    currency,
    handleClose,
  ]);

  return (
    <ModalLayout
      title="Add Expense"
      subtitle="Log your spending quickly"
      onClose={handleClose}
    >
      {isLoading && categoryOptions.length === 0 ? (
        <AppSpinner size="large" />
      ) : error && categoryOptions.length === 0 ? (
        <ErrorCard message={error} onRetry={fetchCategories} />
      ) : (
        <ExpenseForm
          amount={amount}
          onAmountChange={setAmount}
          categories={categoryOptions}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={(category) => setSelectedCategoryId(category.id)}
          date={date}
          onDateChange={setDate}
          note={note}
          onNoteChange={setNote}
          merchant={merchant}
          onMerchantChange={setMerchant}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          currencySymbol={currencySymbol}
          onSubmit={handleSubmit}
          submitLabel="Save Expense"
          isSubmitting={isSubmitting}
          errors={formErrors}
        />
      )}
    </ModalLayout>
  );
}
