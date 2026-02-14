import { Image, Text, XStack, styled } from 'tamagui';
import type { ComponentProps } from 'react';

const AvatarContainer = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: 9999,
  backgroundColor: '$surface',
  borderWidth: 1,
  borderColor: '$border',
  variants: {
    size: {
      sm: { width: 32, height: 32 },
      md: { width: 44, height: 44 },
      lg: { width: 64, height: 64 },
      xl: { width: 88, height: 88 },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
});

const sizeToFont = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
} as const;

interface AppAvatarProps extends ComponentProps<typeof AvatarContainer> {
  uri?: string;
  initials?: string;
}

export function AppAvatar({ uri, initials, size = 'md', ...props }: AppAvatarProps) {
  const fallback = initials?.trim().slice(0, 2).toUpperCase();
  const fontSize = sizeToFont[size] ?? 14;

  return (
    <AvatarContainer size={size} {...props}>
      {uri ? (
        <Image
          source={{ uri }}
          width="100%"
          height="100%"
          resizeMode="cover"
        />
      ) : (
        <Text color="$textSecondary" fontSize={fontSize} fontWeight="600">
          {fallback || '?'}
        </Text>
      )}
    </AvatarContainer>
  );
}
