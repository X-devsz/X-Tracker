/**
 * Expense Modal Layout — Stack for add/edit expense
 */
import { Stack } from 'expo-router';

export default function ExpenseLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="add"
        options={{ title: 'Add Expense' }}
      />
    </Stack>
  );
}
