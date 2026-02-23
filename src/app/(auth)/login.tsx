/**
 * Login Screen
 */
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { XStack, useTheme } from 'tamagui';
import { AppIconButton, AuthForm, AuthTemplate, SectionHeader, useAlertDialog } from '../../components';
import { useGoogleSignIn } from '../../services/auth';
import { useAuthStore } from '../../store';
import { AUTH_ENABLED } from '../../config/featureFlags';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { alertDialog, showAlert } = useAlertDialog();
  const { signInWithGoogle } = useGoogleSignIn();
  const { user } = useAuthStore();

  if (!AUTH_ENABLED) {
    // Auth screens are feature-flagged for future use.
    return <Redirect href="/(auth)/welcome" />;
  }

  const confirmAccountSwitch = () =>
    new Promise<boolean>((resolve) => {
      showAlert(
        'Switch account?',
        'You are already signed in. Continue to switch accounts?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Continue', style: 'destructive', onPress: () => resolve(true) },
        ],
      );
    });
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(auth)/welcome');
  };

  return (
    <AuthTemplate>
      {alertDialog}
      <XStack>
        <AppIconButton
          tone="surface"
          icon={<Ionicons name="arrow-back" size={18} color={theme.textPrimary?.val} />}
          onPress={handleBack}
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
            if (user) {
              const confirmed = await confirmAccountSwitch();
              if (!confirmed) {
                return;
              }
            }
            const result = await signInWithGoogle();
            if (result.status === 'cancelled') {
              return;
            }
            router.replace('/(tabs)');
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unable to sign in with Google.';
            showAlert('Google sign-in failed', message);
          }
        }}
        onFooterPress={() => router.push('/(auth)/signup')}
      />
    </AuthTemplate>
  );
}
