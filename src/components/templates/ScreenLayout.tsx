import type { ComponentProps, ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDivider } from '../atoms';

interface ScreenLayoutProps {
  header: ReactNode;
  children: ReactNode;
  scrollable?: boolean;
  gap?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  headerPaddingTop?: number;
  headerPaddingBottom?: number;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: ComponentProps<typeof YStack>['backgroundColor'];
  showsVerticalScrollIndicator?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  showDivider?: boolean;
}

export function ScreenLayout({
  header,
  children,
  scrollable = true,
  gap = 16,
  paddingHorizontal = 20,
  paddingVertical = 20,
  headerPaddingTop = 12,
  headerPaddingBottom = 12,
  contentContainerStyle,
  backgroundColor = '$background',
  showsVerticalScrollIndicator = false,
  refreshing,
  onRefresh,
  showDivider = true,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const contentPaddingBottom = insets.bottom + paddingVertical;

  const refreshControl = onRefresh ? (
    <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} />
  ) : undefined;

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      <YStack
        paddingTop={insets.top + headerPaddingTop}
        paddingBottom={headerPaddingBottom}
        paddingHorizontal={paddingHorizontal}
        backgroundColor={backgroundColor}
      >
        {header}
      </YStack>
      {showDivider ? <AppDivider /> : null}
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={refreshControl}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: paddingVertical,
            paddingBottom: contentPaddingBottom,
            paddingHorizontal,
            ...contentContainerStyle,
          }}
        >
          <YStack gap={gap}>{children}</YStack>
        </ScrollView>
      ) : (
        <YStack
          flex={1}
          paddingTop={paddingVertical}
          paddingBottom={contentPaddingBottom}
          paddingHorizontal={paddingHorizontal}
          gap={gap}
        >
          {children}
        </YStack>
      )}
    </YStack>
  );
}
