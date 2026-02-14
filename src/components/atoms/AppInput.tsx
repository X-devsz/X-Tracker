import { styled } from 'tamagui';
import { TextInput } from 'react-native';

export const AppInput = styled(TextInput, {
  flex: 1,
  height: 48,
  fontSize: 14,
  color: '$textPrimary',
  paddingHorizontal: 0,
});
