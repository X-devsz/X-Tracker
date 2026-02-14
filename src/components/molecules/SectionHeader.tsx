import { Text, YStack } from 'tamagui';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <YStack gap={8} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
      <Text color="$textPrimary" fontSize={26} fontWeight="700">
        {title}
      </Text>
      {subtitle ? (
        <Text color="$textSecondary" fontSize={14} lineHeight={20}>
          {subtitle}
        </Text>
      ) : null}
    </YStack>
  );
}
