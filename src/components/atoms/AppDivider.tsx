import { YStack, styled } from 'tamagui';

/**
 * AppDivider - Minimal Tamagui divider
 * Uses a solid 1px background to avoid native border width issues.
 */
export const AppDivider = styled(YStack, {
  name: 'AppDivider',
  height: 1,
  backgroundColor: '$border',
  width: '100%',
});
