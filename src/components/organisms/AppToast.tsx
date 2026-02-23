import { Toast, useToastState } from '@tamagui/toast';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

/**
 * AppToast — Custom toast component for @tamagui/toast
 *
 * Renders inside ToastViewport. Supports success, error, info, and warning variants.
 * Automatically placed in the root layout via ToastProvider.
 */

const StyledToast = styled(Toast, {
  name: 'AppToast',
  backgroundColor: '$cardBackground',
  borderWidth: 1,
  borderColor: '$cardBorder',
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  marginHorizontal: 16,
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  animation: null,
});

const toastIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
  warning: 'warning',
};

export function AppToast() {
  const toast = useToastState();
  const theme = useTheme();

  if (!toast || toast.isHandledNatively) return null;

  const variant = (toast.customData as { variant?: string })?.variant ?? 'info';
  const iconName = toastIcons[variant] ?? 'information-circle';

  const iconColorMap: Record<string, string | undefined> = {
    success: theme.success?.val ?? '#22C55E',
    error: theme.danger?.val ?? '#EF4444',
    info: theme.primary?.val ?? '#6366F1',
    warning: theme.warning?.val ?? '#F59E0B',
  };
  const iconColor = iconColorMap[variant] ?? theme.primary?.val;

  return (
    <StyledToast
      key={toast.id}
      duration={toast.duration}
      viewportName={toast.viewportName}
    >
      <XStack alignItems="center" gap={12}>
        <Ionicons name={iconName} size={20} color={iconColor} />
        <YStack flex={1} gap={2}>
          <Toast.Title>
            <Text fontSize={14} fontWeight="600" color="$textPrimary">
              {toast.title}
            </Text>
          </Toast.Title>
          {toast.message ? (
            <Toast.Description>
              <Text fontSize={12} color="$textSecondary">
                {toast.message}
              </Text>
            </Toast.Description>
          ) : null}
        </YStack>
        <Toast.Close>
          <Ionicons name="close" size={16} color={theme.textTertiary?.val} />
        </Toast.Close>
      </XStack>
    </StyledToast>
  );
}

AppToast.displayName = 'AppToast';
