import React, { useState, useCallback } from 'react';
import { AlertDialog } from '@tamagui/alert-dialog';
import { Text, XStack, styled } from 'tamagui';
import { AppButton } from '@/components/atoms';
import { radius, space } from '@/theme/tokens';
import { fontSize, fontWeight, lineHeight } from '@/theme/typography';

/**
 * AppAlertDialog — Tamagui AlertDialog wrapper
 *
 * Replaces React Native Alert.alert() with a fully themed,
 * animated Tamagui AlertDialog for confirmations and errors.
 */

const StyledOverlay = styled(AlertDialog.Overlay, {
  backgroundColor: '$overlay',
  animation: null,
});

const StyledContent = styled(AlertDialog.Content, {
  backgroundColor: '$cardBackground',
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: '$cardBorder',
  padding: space['2xl'],
  gap: space.lg,
  maxWidth: 320,
  width: '90%',
  animation: null,
  elevate: true,
});

const AlertDialogDestructive =
  (AlertDialog as unknown as { Destructive?: typeof AlertDialog.Action }).Destructive ??
  AlertDialog.Action;

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'cancel' | 'destructive' | 'default';
}

interface AppAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  native?: boolean;
}

export function AppAlertDialog({
  open,
  onOpenChange,
  title,
  message,
  buttons,
  native,
}: AppAlertDialogProps) {
  const resolvedButtons = buttons ?? [{ text: 'OK', style: 'default' }];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} native={native}>
      <AlertDialog.Portal>
        <StyledOverlay key="overlay" />
        <StyledContent key="content">
          <AlertDialog.Title>
            <Text fontSize={fontSize.lg} fontWeight={fontWeight.bold} color="$textPrimary">
              {title}
            </Text>
          </AlertDialog.Title>
          {message ? (
            <AlertDialog.Description>
              <Text
                fontSize={fontSize.sm}
                color="$textSecondary"
                lineHeight={lineHeight.sm}
              >
                {message}
              </Text>
            </AlertDialog.Description>
          ) : null}
          <XStack gap={space.md} justifyContent="flex-end" paddingTop={space.sm}>
            {resolvedButtons.map((btn, i) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';

              if (isCancel) {
                return (
                  <AlertDialog.Cancel key={i} asChild>
                    <AppButton
                      tone="secondary"
                      animation={null}
                      label={btn.text}
                      onPress={() => {
                        btn.onPress?.();
                        onOpenChange(false);
                      }}
                    />
                  </AlertDialog.Cancel>
                );
              }

              if (isDestructive) {
                return (
                  <AlertDialogDestructive key={i} asChild>
                    <AppButton
                      tone="danger"
                      animation={null}
                      label={btn.text}
                      onPress={() => {
                        btn.onPress?.();
                        onOpenChange(false);
                      }}
                    />
                  </AlertDialogDestructive>
                );
              }

              return (
                <AlertDialog.Action key={i} asChild>
                  <AppButton
                    tone="primary"
                    animation={null}
                    label={btn.text}
                    onPress={() => {
                      btn.onPress?.();
                      onOpenChange(false);
                    }}
                  />
                </AlertDialog.Action>
              );
            })}
          </XStack>
        </StyledContent>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

/**
 * useAlertDialog — Hook to use AppAlertDialog imperatively,
 * similar to Alert.alert() but returns JSX + a show function.
 *
 * Usage:
 *   const { alertDialog, showAlert } = useAlertDialog();
 *   showAlert('Title', 'Message', [{ text: 'OK' }]);
 *   return <>{alertDialog}{...rest}</>
 */
export function useAlertDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    native?: boolean;
  }>({ open: false, title: '' });

  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      options?: { native?: boolean },
    ) => {
      setState({ open: true, title, message, buttons, native: options?.native });
    },
    [],
  );

  const alertDialog = (
    <AppAlertDialog
      open={state.open}
      onOpenChange={(open) => setState((prev) => ({ ...prev, open }))}
      title={state.title}
      message={state.message}
      buttons={state.buttons}
      native={state.native}
    />
  );

  return { alertDialog, showAlert };
}

AppAlertDialog.displayName = 'AppAlertDialog';
