/**
 * Edit Expense Screen - Modal form with pre-filled data
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { CategoryOption } from '../../components/molecules/CategoryPicker';
import { AppSpinner, ErrorCard, ExpenseForm, ModalLayout } from '../../components';
import { useCategoryStore, useExpenseStore, useSettingsStore } from '../../store';
import { validateExpenseInput } from '../../domain/validators/expense.validator';
import { resolveCategoryColor, resolveCategoryIcon } from '../../utils/categories';
import { getCurrencySymbol, parseAmountToMinor } from '../../utils/formatters';

export default function EditExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currency: defaultCurrency } = useSettingsStore();
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  const { getExpenseById, updateExpense } = useExpenseStore();
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
  const [expenseCurrency, setExpenseCurrency] = useState(defaultCurrency);
  const [isLoadingExpense, setIsLoadingExpense] = useState(true);
  const [expenseError, setExpenseError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const currencySymbol = useMemo(
    () => getCurrencySymbol(expenseCurrency),
    [expenseCurrency],
  );

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

  useEffect(() => {
    let isActive = true;
    const loadExpense = async () => {
      if (!id || Array.isArray(id)) {
        setExpenseError('Invalid expense.');
        setIsLoadingExpense(false);
        return;
      }
      setIsLoadingExpense(true);
      setExpenseError(null);
      try {
        const expense = await getExpenseById(id);
        if (!expense) {
          setExpenseError('Expense not found.');
          return;
        }
        if (!isActive) return;
        setAmount((expense.amountMinor / 100).toFixed(2));
        setSelectedCategoryId(expense.categoryId);
        setDate(expense.occurredAt);
        setNote(expense.note ?? '');
        setMerchant(expense.merchant ?? '');
        setPaymentMethod(expense.paymentMethod ?? '');
        setExpenseCurrency(expense.currency ?? defaultCurrency);
      } catch (err) {
        if (isActive) {
          setExpenseError(err instanceof Error ? err.message : 'Unable to load expense.');
        }
      } finally {
        if (isActive) {
          setIsLoadingExpense(false);
        }
      }
    };

    loadExpense();

    return () => {
      isActive = false;
    };
  }, [id, getExpenseById, defaultCurrency, reloadToken]);

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }, [router]);

  const handleSubmit = useCallback(async () => {
    if (!id || Array.isArray(id)) return;
    const amountMinor = parseAmountToMinor(amount);

    const nextErrors = validateExpenseInput({
      amountMinor,
      categoryId: selectedCategoryId,
      occurredAt: date ?? null,
    });

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateExpense(id, {
        amountMinor,
        currency: expenseCurrency,
        categoryId: selectedCategoryId!,
        occurredAt: date!,
        note: note.trim() ? note.trim() : undefined,
        merchant: merchant.trim() ? merchant.trim() : undefined,
        paymentMethod: paymentMethod.trim() ? paymentMethod.trim() : undefined,
      });
      handleClose();
    } catch (err) {
      Alert.alert(
        'Update failed',
        err instanceof Error ? err.message : 'Unable to update expense.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    id,
    amount,
    selectedCategoryId,
    date,
    note,
    merchant,
    paymentMethod,
    updateExpense,
    expenseCurrency,
    handleClose,
  ]);

  return (
    <ModalLayout
      title="Edit Expense"
      subtitle="Update your expense"
      onClose={handleClose}
    >
      {isLoadingExpense ? (
        <AppSpinner size="large" />
      ) : expenseError ? (
        <ErrorCard
          message={expenseError}
          onRetry={() => setReloadToken((value) => value + 1)}
        />
      ) : isLoading && categoryOptions.length === 0 ? (
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
          submitLabel="Update Expense"
          isSubmitting={isSubmitting}
          errors={formErrors}
        />
      )}
    </ModalLayout>
  );
}
