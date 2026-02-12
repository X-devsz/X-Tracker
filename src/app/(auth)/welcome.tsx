/**
 * Welcome Screen — Onboarding / First launch
 */
import { Text, YStack, XStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding={32}
      gap={32}
    >
      {/* Icon / Logo */}
      <YStack
        width={120}
        height={120}
        borderRadius={24}
        backgroundColor="$primaryLight"
        alignItems="center"
        justifyContent="center"
      >
        <Ionicons name="wallet" size={56} color={theme.primary?.val} />
      </YStack>

      {/* Welcome Text */}
      <YStack alignItems="center" gap={12}>
        <Text color="$textPrimary" fontSize={28} fontWeight="700" textAlign="center">
          Expense Tracker
        </Text>
        <Text color="$textSecondary" fontSize={15} textAlign="center" lineHeight={22}>
          Track your spending, manage categories, and get insights into your financial habits.
        </Text>
      </YStack>

      {/* Features List */}
      <YStack gap={16} width="100%">
        {[
          { icon: 'receipt-outline' as const, text: 'Track expenses effortlessly' },
          { icon: 'pie-chart-outline' as const, text: 'Visual spending insights' },
          { icon: 'shield-checkmark-outline' as const, text: 'Your data stays on your device' },
        ].map((item) => (
          <XStack key={item.text} alignItems="center" gap={12}>
            <YStack
              width={40}
              height={40}
              borderRadius={12}
              backgroundColor="$primaryLight"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name={item.icon} size={20} color={theme.primary?.val} />
            </YStack>
            <Text color="$textPrimary" fontSize={15} fontWeight="500" flex={1}>
              {item.text}
            </Text>
          </XStack>
        ))}
      </YStack>

      {/* CTA Button */}
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        style={{ width: '100%' }}
      >
        <XStack
          backgroundColor="$primary"
          borderRadius={12}
          height={52}
          alignItems="center"
          justifyContent="center"
          gap={8}
        >
          <Text color="$textInverse" fontSize={15} fontWeight="600">
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={18} color={theme.textInverse?.val} />
        </XStack>
      </Pressable>
    </YStack>
  );
}
