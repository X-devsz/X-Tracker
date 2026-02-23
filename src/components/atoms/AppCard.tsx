import { Card, styled, withStaticProperties } from 'tamagui';
import { radius, shadows, space } from '@/theme';

const StyledCard = styled(Card, {
  backgroundColor: '$cardBackground',
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: '$cardBorder',
  padding: space.lg,
  gap: space.sm,
  overflow: 'hidden',
  variants: {
    elevated: {
      true: {
        elevate: true,
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

export const AppCard = withStaticProperties(StyledCard, {
  Header: Card.Header,
  Footer: Card.Footer,
  Background: Card.Background,
});
