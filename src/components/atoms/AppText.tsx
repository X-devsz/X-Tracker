import { styled, Text } from 'tamagui';
import type { ComponentProps } from 'react';
import { textStyles } from '../../theme';

const StyledText = styled(Text, {
  color: '$textPrimary',
  variants: {
    variant: {
      h1: textStyles.h1,
      h2: textStyles.h2,
      h3: textStyles.h3,
      h4: textStyles.h4,
      body: textStyles.body,
      bodySm: textStyles.bodySm,
      label: textStyles.label,
      caption: textStyles.caption,
      button: textStyles.button,
      amount: textStyles.amount,
      amountSm: textStyles.amountSm,
    },
  } as const,
  defaultVariants: {
    variant: 'body',
  },
});

export type AppTextProps = ComponentProps<typeof StyledText>;

export function AppText(props: AppTextProps) {
  return <StyledText {...props} />;
}
