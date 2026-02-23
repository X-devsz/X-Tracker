import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { TextLink } from '../atoms';

const SnackBarContainer = styled(XStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  paddingVertical: 10,
  alignItems: 'center',
  gap: 10,
  animation: 'fast',
  enterStyle: { opacity: 0, y: 6 },
  variants: {
    tone: {
      success: {
        backgroundColor: '$successLight',
        borderColor: '$success',
      },
      danger: {
        backgroundColor: '$dangerLight',
        borderColor: '$danger',
      },
      neutral: {
        backgroundColor: '$cardBackground',
        borderColor: '$border',
      },
    },
  } as const,
  defaultVariants: {
    tone: 'neutral',
  },
});

const DismissButton = styled(XStack, {
  width: 28,
  height: 28,
  borderRadius: 9999,
  alignItems: 'center',
  justifyContent: 'center',
  pressStyle: { scale: 0.96, backgroundColor: '$surfaceHover' },
});

type SnackTone = ComponentProps<typeof SnackBarContainer>['tone'];

interface SnackBarProps extends ComponentProps<typeof SnackBarContainer> {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const getToneIcon = (tone?: SnackTone) => {
  if (tone === 'success') return 'checkmark-circle';
  if (tone === 'danger') return 'alert-circle';
  return 'information-circle';
};

export function SnackBar({
  message,
  actionLabel,
  onAction,
  onDismiss,
  tone = 'neutral',
  ...props
}: SnackBarProps) {
  const theme = useTheme();
  const iconColor = tone === 'danger' ? theme.danger?.val : theme.primary?.val;

  return (
    <SnackBarContainer tone={tone} {...props}>
      <Ionicons name={getToneIcon(tone)} size={18} color={iconColor} />
      <Text color="$textPrimary" fontSize={13} flex={1}>
        {message}
      </Text>
      {actionLabel ? (
        <TextLink fontSize={12} onPress={onAction}>
          {actionLabel}
        </TextLink>
      ) : null}
      {onDismiss ? (
        <DismissButton onPress={onDismiss}>
          <Ionicons name="close" size={16} color={theme.textTertiary?.val} />
        </DismissButton>
      ) : null}
    </SnackBarContainer>
  );
}
