/**
 * Add Expense Screen - Modal form
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { categoryColors } from '../../theme';
import type { CategoryOption } from '../../components/molecules/CategoryPicker';
import { ExpenseForm, ModalLayout } from '../../components';

const categories: CategoryOption[] = [
  { id: 'food', label: 'Food', iconName: 'fast-food-outline', color: categoryColors.food, isFavorite: true },
  { id: 'transport', label: 'Transport', iconName: 'bus-outline', color: categoryColors.transport },
  { id: 'shopping', label: 'Shopping', iconName: 'bag-handle-outline', color: categoryColors.shopping },
  { id: 'bills', label: 'Bills', iconName: 'receipt-outline', color: categoryColors.bills },
  { id: 'health', label: 'Health', iconName: 'medkit-outline', color: categoryColors.health },
  { id: 'entertainment', label: 'Fun', iconName: 'game-controller-outline', color: categoryColors.entertainment },
  { id: 'education', label: 'Education', iconName: 'school-outline', color: categoryColors.education },
  { id: 'other', label: 'Other', iconName: 'ellipsis-horizontal-outline', color: categoryColors.other },
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
    categories[0]?.id,
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [note, setNote] = useState('');
  const [merchant, setMerchant] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <ModalLayout
      title="Add Expense"
      subtitle="Log your spending quickly"
      onClose={() => router.back()}
    >
      <ExpenseForm
        amount={amount}
        onAmountChange={setAmount}
        categories={categories}
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
        onSubmit={() => router.back()}
      />
    </ModalLayout>
  );
}
