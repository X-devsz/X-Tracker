import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticFeedbackType = 'selection' | 'success' | 'warning' | 'none';

const runHaptic = (handler: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  void handler().catch(() => undefined);
};

export const haptics = {
  selection: () => runHaptic(() => Haptics.selectionAsync()),
  success: () =>
    runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () =>
    runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};

export const triggerHaptic = (type?: HapticFeedbackType) => {
  if (!type || type === 'none') return;
  if (type === 'success') {
    haptics.success();
    return;
  }
  if (type === 'warning') {
    haptics.warning();
    return;
  }
  haptics.selection();
};
