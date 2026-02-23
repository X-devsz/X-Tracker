import type { ComponentProps, ReactNode } from 'react';
import { Dialog, Text, XStack, YStack, styled } from 'tamagui';
import { AppButton } from '@/components/atoms';
import { radius, space } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: '$overlay',
  animation: null,
});

const StyledContent = styled(Dialog.Content, {
  backgroundColor: '$cardBackground',
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: '$cardBorder',
  padding: space['2xl'],
  gap: space.lg,
  maxWidth: 420,
  width: '90%',
  animation: null,
  elevate: true,
});

type ButtonTone = ComponentProps<typeof AppButton>['tone'];

interface AppDialogAction {
  label: string;
  onPress?: () => void;
  tone?: ButtonTone;
  role?: 'cancel' | 'destructive' | 'default';
  closeOnPress?: boolean;
}

interface AppDialogProps extends Omit<ComponentProps<typeof Dialog>, 'children'> {
  title: string;
  description?: string;
  trigger?: ReactNode;
  children?: ReactNode;
  actions?: AppDialogAction[];
}

const resolveActionTone = (action: AppDialogAction): ButtonTone => {
  if (action.tone) return action.tone;
  if (action.role === 'destructive') return 'danger';
  if (action.role === 'cancel') return 'secondary';
  return 'primary';
};

export function AppDialog({
  title,
  description,
  trigger,
  actions,
  children,
  ...dialogProps
}: AppDialogProps) {
  const resolvedActions = actions ?? [];

  return (
    <Dialog {...dialogProps}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <StyledOverlay key="overlay" />
        <StyledContent key="content">
          <YStack gap={space.sm}>
            <Dialog.Title>
              <Text fontSize={fontSize.lg} fontWeight={fontWeight.bold} color="$textPrimary">
                {title}
              </Text>
            </Dialog.Title>
            {description ? (
              <Dialog.Description>
                <Text fontSize={fontSize.sm} color="$textSecondary" lineHeight={lineHeight.sm}>
                  {description}
                </Text>
              </Dialog.Description>
            ) : null}
          </YStack>
          {children ? <YStack gap={space.md}>{children}</YStack> : null}
          {resolvedActions.length ? (
            <XStack gap={space.md} justifyContent="flex-end" paddingTop={space.sm}>
              {resolvedActions.map((action, index) => {
                const tone = resolveActionTone(action);
                const closeOnPress = action.closeOnPress ?? true;

                if (!closeOnPress) {
                  return (
                    <AppButton
                      key={index}
                      tone={tone}
                      animation={null}
                      label={action.label}
                      onPress={action.onPress}
                    />
                  );
                }

                return (
                  <Dialog.Close key={index} asChild>
                    <AppButton
                      tone={tone}
                      animation={null}
                      label={action.label}
                      onPress={action.onPress}
                    />
                  </Dialog.Close>
                );
              })}
            </XStack>
          ) : null}
        </StyledContent>
      </Dialog.Portal>
    </Dialog>
  );
}

AppDialog.displayName = 'AppDialog';
