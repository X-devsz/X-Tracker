import { styled, YStack } from 'tamagui';
import { shadows } from '../../theme';

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
        ...shadows.sm,
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
