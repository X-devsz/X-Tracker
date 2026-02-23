/**
 * Not Found Screen — 404 handler
 */
import { Text, YStack } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';
import { AppButton, ScreenContainer } from '../components';

export default function NotFoundScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer scrollable={false} gap={20}>
      <YStack flex={1} alignItems="center" justifyContent="center" gap={20}>
        <YStack
          width={80}
          height={80}
          borderRadius={9999}
          backgroundColor="$warningLight"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="warning-outline" size={40} color={theme.warning?.val} />
        </YStack>

        <YStack alignItems="center" gap={8}>
          <Text color="$textPrimary" fontSize={24} fontWeight="700">
            Page Not Found
          </Text>
          <Text color="$textSecondary" fontSize={15} textAlign="center">
            The page you're looking for doesn't exist.
          </Text>
        </YStack>

        <AppButton label="Go Home" onPress={() => router.replace('/(tabs)')} tone="secondary" />
      </YStack>
    </ScreenContainer>
  );
}
