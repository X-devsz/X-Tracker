import { Text, XStack } from 'tamagui';
import { TextLink } from '../atoms';

interface AuthFooterProps {
  hint: string;
  action: string;
  onPress?: () => void;
}

export function AuthFooter({ hint, action, onPress }: AuthFooterProps) {
  return (
    <XStack justifyContent="center" gap={6}>
      <Text color="$textSecondary" fontSize={13}>
        {hint}
      </Text>
      <TextLink fontSize={13} onPress={onPress}>
        {action}
      </TextLink>
    </XStack>
  );
}
