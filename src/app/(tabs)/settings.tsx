/**
 * Settings Screen - App configuration
 *
 * Theme toggle, currency, account info.
 */
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, useTheme } from 'tamagui';
import { useAuthStore, useSettingsStore, type ThemeMode } from '../../store';
import { useGoogleSignIn } from '../../services/auth';
import { AppAvatar, AppSelect, ScreenContainer, SettingsGroup } from '../../components';
import {
  SUPPORTED_CURRENCY_CODES,
  formatCurrency,
  getCurrencySymbol,
} from '../../utils/formatters';

const themeOptions: { value: ThemeMode; label: string; iconName: string }[] = [
  { value: 'system', label: 'System', iconName: 'desktop-outline' },
  { value: 'light', label: 'Light', iconName: 'sunny-outline' },
  { value: 'dark', label: 'Dark', iconName: 'moon-outline' },
];

const getInitials = (email?: string | null) => {
  if (!email) return 'U';
  const handle = email.split('@')[0] ?? '';
  return handle.slice(0, 2).toUpperCase();
};

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode, currency, setCurrency } = useSettingsStore();
  const { user } = useAuthStore();
  const { signOut } = useGoogleSignIn();
  const iconColor = theme.textSecondary?.val ?? '#6B7280';

  const themeItems = themeOptions.map((option) => ({
    value: option.value,
    label: option.label,
    icon: (
      <Ionicons
        name={option.iconName as keyof typeof Ionicons.glyphMap}
        size={16}
        color={iconColor}
      />
    ),
  }));

  const currencyItems = SUPPORTED_CURRENCY_CODES.map((code) => {
    const symbol = getCurrencySymbol(code).trim();
    return {
      value: code,
      label: code,
      description: formatCurrency(123400, code),
      icon: (
        <Text color="$textSecondary" fontSize={12}>
          {symbol}
        </Text>
      ),
    };
  });

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
            rightElement: (
              <AppSelect
                id="theme-select"
                value={themeMode}
                items={themeItems}
                onValueChange={(value) => setThemeMode(value as ThemeMode)}
                width={160}
              />
            ),
          },
          {
            id: 'currency',
            label: 'Currency',
            description: 'Default currency for new expenses',
            iconName: 'cash-outline',
            rightElement: (
              <AppSelect
                id="currency-select"
                value={currency}
                items={currencyItems}
                onValueChange={setCurrency}
                width={190}
              />
            ),
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
