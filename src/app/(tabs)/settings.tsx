/**
 * Settings Screen - App configuration
 *
 * Theme toggle, currency, account info.
 */
import { Alert } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { useAuthStore, useSettingsStore, type ThemeMode } from '../../store';
import { useGoogleSignIn } from '../../services/auth';
import { AppAvatar, ScreenContainer, SettingsGroup } from '../../components';
import { SUPPORTED_CURRENCY_CODES, formatCurrency } from '../../utils/formatters';

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const getInitials = (email?: string | null) => {
  if (!email) return 'U';
  const handle = email.split('@')[0] ?? '';
  return handle.slice(0, 2).toUpperCase();
};

export default function SettingsScreen() {
  const { themeMode, setThemeMode, currency, setCurrency } = useSettingsStore();
  const { user } = useAuthStore();
  const { signOut } = useGoogleSignIn();

  const handleThemeSelect = () => {
    Alert.alert('Select theme', 'Choose the appearance mode', [
      ...themeOptions.map((option) => ({
        text: option.label,
        onPress: () => setThemeMode(option.value),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCurrencySelect = () => {
    const options = SUPPORTED_CURRENCY_CODES;
    Alert.alert('Select currency', 'Choose the default currency', [
      ...options.map((code) => ({
        text: `${code} • ${formatCurrency(123400, code)}`,
        onPress: () => setCurrency(code),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  return (
    <ScreenContainer gap={20}>
      <Text color="$textPrimary" fontSize={24} fontWeight="700">
        Settings
      </Text>

      <SettingsGroup
        title="APPEARANCE"
        rows={[
          {
            id: 'theme',
            label: 'Theme',
            description: 'Match your device or pick a mode',
            iconName: 'color-palette-outline',
            type: 'navigation',
            detail: themeOptions.find((option) => option.value === themeMode)?.label ?? 'System',
            onPress: handleThemeSelect,
          },
          {
            id: 'currency',
            label: 'Currency',
            description: 'Default currency for new expenses',
            iconName: 'cash-outline',
            type: 'navigation',
            detail: `${currency} • ${formatCurrency(123400, currency)}`,
            onPress: handleCurrencySelect,
          },
        ]}
      />

      <SettingsGroup
        title="DATA"
        rows={[
          {
            id: 'export',
            label: 'Export CSV',
            description: 'Download your expense history',
            iconName: 'download-outline',
            type: 'navigation',
            onPress: () => {},
          },
          {
            id: 'clear',
            label: 'Clear All Data',
            description: 'Remove all local expenses',
            iconName: 'trash-outline',
            tone: 'danger',
            type: 'action',
            onPress: () => {},
          },
        ]}
      />

      <SettingsGroup
        title="ABOUT"
        rows={[
          {
            id: 'version',
            label: 'Version',
            description: 'Current app build',
            iconName: 'information-circle-outline',
            type: 'navigation',
            detail: '1.0.0',
          },
        ]}
      />

      {user ? (
        <SettingsGroup
          title="ACCOUNT"
          rows={[
            {
              id: 'account',
              label: 'Signed in',
              description: user.email ?? 'Google account',
              iconName: 'person-circle-outline',
              rightElement: (
                <AppAvatar
                  size="sm"
                  initials={getInitials(user.email)}
                />
              ),
            },
            {
              id: 'signout',
              label: 'Sign out',
              description: 'Disconnect this account',
              iconName: 'log-out-outline',
              tone: 'danger',
              type: 'action',
              onPress: handleSignOut,
            },
          ]}
        />
      ) : null}
    </ScreenContainer>
  );
}
