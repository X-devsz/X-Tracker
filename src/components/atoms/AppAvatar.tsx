import { Avatar } from '@tamagui/avatar';
import { Text } from 'tamagui';
import type { ComponentProps } from 'react';

/**
 * AppAvatar — Tamagui Avatar wrapper
 * Replaces custom container + Image + initials fallback
 * with official Tamagui Avatar (built-in image loading + fallback pattern).
 */

const sizeMap = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 88,
} as const;

const fontSizeMap = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
} as const;

type AvatarSize = keyof typeof sizeMap;

interface AppAvatarProps extends Omit<ComponentProps<typeof Avatar>, 'size'> {
  uri?: string;
  initials?: string;
  size?: AvatarSize;
}

export function AppAvatar({ uri, initials, size = 'md', ...props }: AppAvatarProps) {
  const fallback = initials?.trim().slice(0, 2).toUpperCase();
  const resolvedSize = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <Avatar circular size={resolvedSize} borderWidth={1} borderColor="$border" {...props}>
      {uri ? <Avatar.Image src={uri} /> : null}
      <Avatar.Fallback
        backgroundColor="$surface"
        alignItems="center"
        justifyContent="center"
        delayMs={uri ? 300 : 0}
      >
        <Text color="$textSecondary" fontSize={fontSize} fontWeight="600">
          {fallback || '?'}
        </Text>
      </Avatar.Fallback>
    </Avatar>
  );
}

AppAvatar.displayName = 'AppAvatar';
