import { styled, YStack } from 'tamagui';

export const AppCard = styled(YStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$cardBorder',
  padding: 16,
  gap: 8,
  variants: {
    elevated: {
      true: {
        shadowColor: '$cardShadow',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
      },
    },
    pressable: {
      true: {
        pressStyle: {
          scale: 0.98,
          backgroundColor: '$surfaceHover',
        },
      },
    },
  } as const,
});
