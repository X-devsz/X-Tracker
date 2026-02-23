import { TextArea, styled } from 'tamagui';
import { fontSize, space } from '@/theme';

export const AppTextArea = styled(TextArea, {
  flex: 1,
  minWidth: space[0],
  height: '100%',
  fontFamily: '$body',
  fontSize: fontSize.md,
  color: '$textPrimary',
  paddingHorizontal: space[0],
  paddingVertical: space[0],
  textAlignVertical: 'top',
  unstyled: true,
});
