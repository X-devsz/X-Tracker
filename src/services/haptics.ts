import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

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
