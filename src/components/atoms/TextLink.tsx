import { Text } from 'tamagui';
import type { ComponentProps } from 'react';

type TextLinkProps = ComponentProps<typeof Text>;

export function TextLink({ children, ...props }: TextLinkProps) {
  return (
    <Text color="$primary" fontWeight="600" {...props}>
      {children}
    </Text>
  );
}
