import { styled, Text, XStack } from 'tamagui';
import type { ComponentProps, ReactNode } from 'react';

const ButtonContainer = styled(XStack, {
  height: 52,
  borderRadius: 14,
  paddingHorizontal: 18,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  animation: 'bouncy',
  pressStyle: { scale: 0.98 },
  variants: {
    tone: {
      primary: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
      soft: {
        backgroundColor: '$primaryLight',
        borderColor: '$primaryLight',
      },
      surface: {
        backgroundColor: '$surface',
        borderColor: '$border',
        borderWidth: 1,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$border',
        borderWidth: 1,
      },
    },
  } as const,
  defaultVariants: {
    tone: 'primary',
  },
});

type ButtonTone = ComponentProps<typeof ButtonContainer>['tone'];

interface AppButtonProps extends ComponentProps<typeof ButtonContainer> {
  label: string;
  icon?: ReactNode;
}

const getLabelColor = (tone?: ButtonTone) => {
  switch (tone) {
    case 'soft':
      return '$primary';
    case 'surface':
    case 'outline':
      return '$textPrimary';
    case 'primary':
    default:
      return '$textInverse';
  }
};

export function AppButton({ label, icon, tone = 'primary', ...props }: AppButtonProps) {
  return (
    <ButtonContainer tone={tone} {...props}>
      {icon}
      <Text color={getLabelColor(tone)} fontSize={15} fontWeight="600">
        {label}
      </Text>
    </ButtonContainer>
  );
}
