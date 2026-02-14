/**
 * Login Screen
 */
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { XStack, useTheme } from 'tamagui';
import { AppIconButton, AuthForm, AuthTemplate, SectionHeader } from '../../components';
import { useGoogleSignIn } from '../../services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signInWithGoogle } = useGoogleSignIn();

  return (
    <AuthTemplate>
      <XStack>
        <AppIconButton
          tone="surface"
          icon={<Ionicons name="arrow-back" size={18} color={theme.textPrimary?.val} />}
          onPress={() => router.back()}
        />
      </XStack>

      <SectionHeader
        title="Hey, welcome back!"
        subtitle="Good to see you again. Log in to keep tracking your spending."
      />

      <AuthForm
        variant="login"
        onPrimaryPress={() => router.replace('/(tabs)')}
        onGooglePress={async () => {
          try {
            await signInWithGoogle();
            router.replace('/(tabs)');
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unable to sign in with Google.';
            Alert.alert('Google sign-in failed', message);
          }
        }}
        onFooterPress={() => router.push('/(auth)/signup')}
      />
    </AuthTemplate>
  );
}
