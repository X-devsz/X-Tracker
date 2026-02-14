/**
 * Settings Screen - App configuration
 *
 * Theme toggle, currency, account info.
 */
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { useAuthStore, useSettingsStore, type ThemeMode } from '../../store';
import { useGoogleSignIn } from '../../services/auth';
import { AppAvatar, AppChip, ScreenContainer, SettingsGroup } from '../../components';

const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
  { value: 'system', label: 'System', icon: 'desktop-outline' },
];

const getInitials = (email?: string | null) => {
  if (!email) return 'U';
  const handle = email.split('@')[0] ?? '';
  return handle.slice(0, 2).toUpperCase();
};

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode, currency } = useSettingsStore();
  const { user } = useAuthStore();
  const { signOut } = useGoogleSignIn();

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
              <XStack gap={8} flexWrap="wrap" justifyContent="flex-end">
                {themeOptions.map((option) => (
                  <AppChip
                    key={option.value}
                    label={option.label}
                    active={themeMode === option.value}
                    icon={
                      <Ionicons
                        name={option.icon as keyof typeof Ionicons.glyphMap}
                        size={14}
                        color={themeMode === option.value ? theme.primary?.val : theme.textSecondary?.val}
                      />
                    }
                    onPress={() => setThemeMode(option.value)}
                  />
                ))}
              </XStack>
            ),
          },
          {
            id: 'currency',
            label: 'Currency',
            description: 'Default currency for new expenses',
            iconName: 'cash-outline',
            type: 'navigation',
            detail: currency,
            onPress: () => {},
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
