import type { ComponentProps, ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native';
import { YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  gap?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: ComponentProps<typeof YStack>['backgroundColor'];
  showsVerticalScrollIndicator?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function ScreenContainer({
  children,
  scrollable = true,
  gap = 16,
  paddingHorizontal = 20,
  paddingVertical = 20,
  contentContainerStyle,
  backgroundColor = '$background',
  showsVerticalScrollIndicator = false,
  refreshing,
  onRefresh,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const contentPaddingTop = insets.top + paddingVertical;
  const contentPaddingBottom = insets.bottom + paddingVertical;

  if (scrollable) {
    const refreshControl = onRefresh ? (
      <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} />
    ) : undefined;

    return (
      <YStack flex={1} backgroundColor={backgroundColor}>
        <ScrollView
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={refreshControl}
          contentContainerStyle={{
            paddingTop: contentPaddingTop,
            paddingBottom: contentPaddingBottom,
            paddingHorizontal,
            ...contentContainerStyle,
          }}
        >
          <YStack gap={gap}>{children}</YStack>
        </ScrollView>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      backgroundColor={backgroundColor}
      paddingTop={contentPaddingTop}
      paddingBottom={contentPaddingBottom}
      paddingHorizontal={paddingHorizontal}
      gap={gap}
    >
      {children}
    </YStack>
  );
}
