import { YStack } from 'tamagui';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

interface AuthTemplateProps {
  children: ReactNode;
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 20,
        }}
      >
        <YStack gap={20}>{children}</YStack>
      </ScrollView>
    </YStack>
  );
}
