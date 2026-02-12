/**
 * Add Expense Screen — Modal form
 *
 * Placeholder styled layout.
 */
import { styled, Text, YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

const FormField = styled(YStack, {
  gap: 4,
});

const MockInput = styled(XStack, {
  backgroundColor: '$inputBackground',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '$inputBorder',
  height: 48,
  paddingHorizontal: 16,
  alignItems: 'center',
});

export default function AddExpenseScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding={16}
      gap={20}
    >
      {/* Amount */}
      <YStack alignItems="center" gap={8} paddingVertical={24}>
        <Text color="$textSecondary" fontSize={13} fontWeight="500">
          Amount
        </Text>
        <Text color="$textPrimary" fontSize={34} fontWeight="700">
          ₹0.00
        </Text>
      </YStack>

      {/* Form Fields */}
      <YStack gap={16}>
        <FormField>
          <Text color="$textSecondary" fontSize={13} fontWeight="500">
            Category
          </Text>
          <MockInput>
            <Ionicons name="grid-outline" size={18} color={theme.textTertiary?.val} />
            <Text color="$textTertiary" fontSize={15} marginLeft={12}>
              Select category
            </Text>
          </MockInput>
        </FormField>

        <FormField>
          <Text color="$textSecondary" fontSize={13} fontWeight="500">
            Date
          </Text>
          <MockInput>
            <Ionicons name="calendar-outline" size={18} color={theme.textTertiary?.val} />
            <Text color="$textPrimary" fontSize={15} marginLeft={12}>
              Today
            </Text>
          </MockInput>
        </FormField>

        <FormField>
          <Text color="$textSecondary" fontSize={13} fontWeight="500">
            Note (optional)
          </Text>
          <MockInput>
            <Ionicons name="create-outline" size={18} color={theme.textTertiary?.val} />
            <Text color="$textTertiary" fontSize={15} marginLeft={12}>
              Add a note...
            </Text>
          </MockInput>
        </FormField>

        <FormField>
          <Text color="$textSecondary" fontSize={13} fontWeight="500">
            Merchant (optional)
          </Text>
          <MockInput>
            <Ionicons name="storefront-outline" size={18} color={theme.textTertiary?.val} />
            <Text color="$textTertiary" fontSize={15} marginLeft={12}>
              Where did you spend?
            </Text>
          </MockInput>
        </FormField>
      </YStack>

      {/* Save Button */}
      <YStack flex={1} justifyContent="flex-end" paddingBottom={20}>
        <Pressable onPress={() => router.back()}>
          <XStack
            backgroundColor="$primary"
            borderRadius={12}
            height={52}
            alignItems="center"
            justifyContent="center"
            gap={8}
          >
            <Ionicons name="checkmark" size={20} color={theme.textInverse?.val} />
            <Text color="$textInverse" fontSize={15} fontWeight="600">
              Save Expense
            </Text>
          </XStack>
        </Pressable>
      </YStack>
    </YStack>
  );
}
