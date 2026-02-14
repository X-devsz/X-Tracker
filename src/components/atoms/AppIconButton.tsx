import { styled, XStack } from 'tamagui';
import type { ComponentProps, ReactNode } from 'react';

const IconButton = styled(XStack, {
  width: 44,
  height: 44,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fast',
  pressStyle: { scale: 0.96 },
  variants: {
    tone: {
      soft: {
        backgroundColor: '$primaryLight',
      },
      surface: {
        backgroundColor: '$surface',
        borderWidth: 1,
        borderColor: '$border',
      },
      primary: {
        backgroundColor: '$primary',
      },
    },
  } as const,
  defaultVariants: {
    tone: 'surface',
  },
});

interface AppIconButtonProps extends ComponentProps<typeof IconButton> {
  icon: ReactNode;
}

export function AppIconButton({ icon, ...props }: AppIconButtonProps) {
  return <IconButton {...props}>{icon}</IconButton>;
}
