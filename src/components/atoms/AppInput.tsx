import { Input, styled } from 'tamagui';
import { fontSize, space } from '@/theme';

export const AppInput = styled(Input, {
  flex: 1,
  minWidth: space[0],
  height: '100%',
  fontFamily: '$body',
  fontSize: fontSize.md,
  color: '$textPrimary',
  paddingHorizontal: space[0],
  paddingVertical: space[0],
  unstyled: true,
});
