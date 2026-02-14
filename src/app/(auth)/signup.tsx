/**
 * Sign Up Screen
 */
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { XStack, useTheme } from 'tamagui';
import { AppIconButton, AuthForm, AuthTemplate, SectionHeader } from '../../components';
import { useGoogleSignIn } from '../../services/auth';

export default function SignUpScreen() {
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
        title="Let's go! Register in seconds."
        subtitle="Create your account to start tracking expenses with clean insights."
      />

      <AuthForm
        variant="signup"
        onPrimaryPress={() => router.replace('/(tabs)')}
        onGooglePress={async () => {
          try {
            await signInWithGoogle();
            router.replace('/(tabs)');
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unable to sign up with Google.';
            Alert.alert('Google sign-in failed', message);
          }
        }}
        onFooterPress={() => router.push('/(auth)/login')}
      />
    </AuthTemplate>
  );
}
