import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../store';
import { AUTH_ENABLED } from '../../config/featureFlags';

export default function AuthLayout() {
  const { user, loading } = useAuthStore();
  // Auth guards are feature-flagged for guest mode.
  const authEnabled = AUTH_ENABLED;

  if (authEnabled && loading) {
    // We are still checking the user's authentication state.
    // You can show a loading indicator here if you want.
    return null;
  }

  if (authEnabled && user) {
    // The user is signed in, so redirect them away from the auth screens.
    return <Redirect href="/(tabs)" />;
  }

  // The user is not signed in, so show the auth screens.
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
