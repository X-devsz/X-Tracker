import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../store';

export default function AuthLayout() {
  const { user, loading } = useAuthStore();

  if (loading) {
    // We are still checking the user's authentication state.
    // You can show a loading indicator here if you want.
    return null;
  }

  if (user) {
    // The user is signed in, so redirect them away from the auth screens.
    return <Redirect href="/(tabs)" />;
  }

  // The user is not signed in, so show the auth screens.
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
