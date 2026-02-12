/**
 * Settings Screen — App configuration
 *
 * Theme toggle, currency, account info.
 */
import { styled, Text, YStack, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'tamagui';
import { Pressable } from 'react-native';
import { useSettingsStore, type ThemeMode } from '../../store';

const SettingsCard = styled(YStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$cardBorder',
  overflow: 'hidden',
});

const SettingsRow = styled(XStack, {
  paddingHorizontal: 16,
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '$border',
});

const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '📱' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { themeMode, setThemeMode, currency } = useSettingsStore();

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingTop={insets.top + 16}
      paddingHorizontal={16}
      gap={20}
    >
      {/* Header */}
      <Text color="$textPrimary" fontSize={24} fontWeight="700">
        Settings
      </Text>

      {/* Appearance */}
      <YStack gap={8}>
        <Text color="$textSecondary" fontSize={13} fontWeight="500" paddingLeft={4}>
          APPEARANCE
        </Text>
        <SettingsCard>
          <SettingsRow>
            <XStack alignItems="center" gap={12}>
              <Ionicons name="color-palette-outline" size={22} color={theme.primary?.val} />
              <Text color="$textPrimary" fontSize={15} fontWeight="500">
                Theme
              </Text>
            </XStack>
            <XStack gap={8}>
              {themeOptions.map((opt) => (
                <Pressable key={opt.value} onPress={() => setThemeMode(opt.value)}>
                  <XStack
                    paddingHorizontal={12}
                    paddingVertical={8}
                    borderRadius={12}
                    backgroundColor={themeMode === opt.value ? '$primaryLight' : '$surface'}
                    borderWidth={1}
                    borderColor={themeMode === opt.value ? '$primary' : '$border'}
                    gap={4}
                    alignItems="center"
                  >
                    <Text fontSize={11}>{opt.icon}</Text>
                    <Text
                      color={themeMode === opt.value ? '$primary' : '$textSecondary'}
                      fontSize={11}
                      fontWeight="500"
                    >
                      {opt.label}
                    </Text>
                  </XStack>
                </Pressable>
              ))}
            </XStack>
          </SettingsRow>
          <SettingsRow borderBottomWidth={0}>
            <XStack alignItems="center" gap={12}>
              <Ionicons name="cash-outline" size={22} color={theme.success?.val} />
              <Text color="$textPrimary" fontSize={15} fontWeight="500">
                Currency
              </Text>
            </XStack>
            <Text color="$textSecondary" fontSize={15}>{currency}</Text>
          </SettingsRow>
        </SettingsCard>
      </YStack>

      {/* Data */}
      <YStack gap={8}>
        <Text color="$textSecondary" fontSize={13} fontWeight="500" paddingLeft={4}>
          DATA
        </Text>
        <SettingsCard>
          <SettingsRow>
            <XStack alignItems="center" gap={12}>
              <Ionicons name="download-outline" size={22} color={theme.primary?.val} />
              <Text color="$textPrimary" fontSize={15} fontWeight="500">
                Export CSV
              </Text>
            </XStack>
            <Ionicons name="chevron-forward" size={18} color={theme.textTertiary?.val} />
          </SettingsRow>
          <SettingsRow borderBottomWidth={0}>
            <XStack alignItems="center" gap={12}>
              <Ionicons name="trash-outline" size={22} color={theme.danger?.val} />
              <Text color="$danger" fontSize={15} fontWeight="500">
                Clear All Data
              </Text>
            </XStack>
            <Ionicons name="chevron-forward" size={18} color={theme.textTertiary?.val} />
          </SettingsRow>
        </SettingsCard>
      </YStack>

      {/* About */}
      <YStack gap={8}>
        <Text color="$textSecondary" fontSize={13} fontWeight="500" paddingLeft={4}>
          ABOUT
        </Text>
        <SettingsCard>
          <SettingsRow borderBottomWidth={0}>
            <XStack alignItems="center" gap={12}>
              <Ionicons name="information-circle-outline" size={22} color={theme.textSecondary?.val} />
              <Text color="$textPrimary" fontSize={15} fontWeight="500">
                Version
              </Text>
            </XStack>
            <Text color="$textSecondary" fontSize={15}>1.0.0</Text>
          </SettingsRow>
        </SettingsCard>
      </YStack>
    </YStack>
  );
}
