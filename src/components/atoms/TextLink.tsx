import { Text } from 'tamagui';
import type { ComponentProps } from 'react';
import { triggerHaptic, type HapticFeedbackType } from '../../services/haptics';

interface TextLinkProps extends ComponentProps<typeof Text> {
  haptic?: HapticFeedbackType;
}

export function TextLink({
  children,
  haptic = 'selection',
  onPress,
  disabled,
  ...props
}: TextLinkProps) {
  const handlePress = onPress
    ? (...args: Parameters<NonNullable<typeof onPress>>) => {
        if (!disabled) {
          triggerHaptic(haptic);
        }
        onPress(...args);
      }
    : undefined;

  return (
    <Text
      color="$primary"
      fontWeight="600"
      onPress={handlePress}
      disabled={disabled}
      {...props}
    >
      {children}
    </Text>
  );
}
