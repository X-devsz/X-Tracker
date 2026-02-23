import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDivider, AppIconButton } from '../atoms';

interface ModalLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose?: () => void;
  onBack?: () => void;
  rightAction?: ReactNode;
  scrollable?: boolean;
  contentPadding?: number;
}

export function ModalLayout({
  title,
  subtitle,
  children,
  onClose,
  onBack,
  rightAction,
  scrollable = true,
  contentPadding = 20,
}: ModalLayoutProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const leftAction = onBack ?? onClose;
  const leftIconName = onBack ? 'chevron-back' : 'close';

  const header = (
    <YStack
      paddingTop={insets.top + 12}
      paddingBottom={12}
      paddingHorizontal={20}
      gap={6}
    >
      <XStack alignItems="center" gap={12}>
        <XStack width={44} height={44} alignItems="center" justifyContent="center">
          {leftAction ? (
            <AppIconButton
              tone="surface"
              icon={<Ionicons name={leftIconName} size={18} color={theme.textPrimary?.val} />}
              onPress={leftAction}
            />
          ) : null}
        </XStack>
        <YStack flex={1} alignItems="center" gap={2}>
          <Text color="$textPrimary" fontSize={17} fontWeight="700">
            {title}
          </Text>
          {subtitle ? (
            <Text color="$textSecondary" fontSize={12}>
              {subtitle}
            </Text>
          ) : null}
        </YStack>
        <XStack width={44} height={44} alignItems="center" justifyContent="center">
          {rightAction}
        </XStack>
      </XStack>
    </YStack>
  );

  const content = (
    <YStack gap={16}>
      {children}
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      {header}
      <AppDivider />
      {scrollable ? (
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: contentPadding,
            paddingTop: contentPadding,
            paddingBottom: insets.bottom + contentPadding,
          }}
        >
          {content}
        </ScrollView>
      ) : (
        <YStack
          paddingHorizontal={contentPadding}
          paddingTop={contentPadding}
          paddingBottom={insets.bottom + contentPadding}
        >
          {content}
        </YStack>
      )}
    </YStack>
  );
}
