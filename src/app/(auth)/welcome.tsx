/**
 * Welcome Screen - Landing / First launch
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { AuthFooter, AuthTemplate, LandingHero } from '../../components';
import { AUTH_ENABLED } from '../../config/featureFlags';

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const authEnabled = AUTH_ENABLED;

  const handleStart = () => {
    if (authEnabled) {
      router.push('/(auth)/signup');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <AuthTemplate>
      <LandingHero onStart={handleStart} />

      <YStack gap={14} animation="medium" enterStyle={{ opacity: 0, y: 12 }}>
        {[
          { icon: 'receipt-outline', text: 'Log daily expenses in seconds' },
          { icon: 'pie-chart-outline', text: 'See clean, instant insights' },
          { icon: 'shield-checkmark-outline', text: 'Your data stays private' },
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
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={theme.primary?.val}
              />
            </YStack>
            <Text color="$textPrimary" fontSize={15} fontWeight="500" flex={1}>
              {item.text}
            </Text>
          </XStack>
        ))}
      </YStack>

      {authEnabled ? (
        <AuthFooter
          hint="Already have an account?"
          action="Log In"
          onPress={() => router.push('/(auth)/login')}
        />
      ) : null}
    </AuthTemplate>
  );
}
