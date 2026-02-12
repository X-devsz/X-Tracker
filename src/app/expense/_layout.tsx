/**
 * Expense Modal Layout — Stack for add/edit expense
 */
import { Stack } from 'expo-router';
import { useTheme } from 'tamagui';

export default function ExpenseLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerStyle: {
          backgroundColor: theme.surface?.val,
        },
        headerTintColor: theme.textPrimary?.val,
        headerTitleStyle: {
          fontFamily: 'Inter',
          fontWeight: '600' as const,
          fontSize: 17,
        },
      }}
    >
      <Stack.Screen
        name="add"
        options={{ title: 'Add Expense' }}
      />
    </Stack>
  );
}
