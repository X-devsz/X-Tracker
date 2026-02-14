import { styled, Text, XStack } from 'tamagui';
import type { ComponentProps } from 'react';

const BadgeContainer = styled(XStack, {
  borderRadius: 9999,
  paddingHorizontal: 8,
  paddingVertical: 4,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  variants: {
    tone: {
      success: {
        backgroundColor: '$successLight',
        borderColor: '$success',
      },
      warning: {
        backgroundColor: '$warningLight',
        borderColor: '$warning',
      },
      danger: {
        backgroundColor: '$dangerLight',
        borderColor: '$danger',
      },
      neutral: {
        backgroundColor: '$surface',
        borderColor: '$border',
      },
    },
  } as const,
  defaultVariants: {
    tone: 'success',
  },
});

type BadgeTone = ComponentProps<typeof BadgeContainer>['tone'];

interface AppBadgeProps extends ComponentProps<typeof BadgeContainer> {
  label: string;
}

const getLabelColor = (tone?: BadgeTone) => {
  switch (tone) {
    case 'danger':
      return '$danger';
    case 'warning':
      return '$warning';
    case 'success':
      return '$success';
    case 'neutral':
    default:
      return '$textSecondary';
  }
};

export function AppBadge({ label, tone = 'success', ...props }: AppBadgeProps) {
  return (
    <BadgeContainer tone={tone} {...props}>
      <Text color={getLabelColor(tone)} fontSize={11} fontWeight="600">
        {label}
      </Text>
    </BadgeContainer>
  );
}
