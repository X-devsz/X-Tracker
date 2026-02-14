import { Text, XStack, YStack } from 'tamagui';

interface OrDividerProps {
  label: string;
}

export function OrDivider({ label }: OrDividerProps) {
  return (
    <XStack alignItems="center" gap={12}>
      <YStack flex={1} height={1} backgroundColor="$border" />
      <Text color="$textTertiary" fontSize={12}>
        {label}
      </Text>
      <YStack flex={1} height={1} backgroundColor="$border" />
    </XStack>
  );
}
