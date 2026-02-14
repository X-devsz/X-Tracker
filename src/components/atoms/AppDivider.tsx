import { styled, XStack } from 'tamagui';

export const AppDivider = styled(XStack, {
  backgroundColor: '$border',
  variants: {
    orientation: {
      horizontal: {
        height: 1,
        width: '100%',
      },
      vertical: {
        width: 1,
        height: '100%',
      },
    },
  } as const,
  defaultVariants: {
    orientation: 'horizontal',
  },
});
