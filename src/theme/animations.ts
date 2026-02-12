/**
 * Expense Tracker — Animation Presets
 *
 * Reanimated-based animations for Tamagui components.
 */
import { createAnimations } from '@tamagui/animations-react-native';

export const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 150,
  },
  slow: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 100,
  },
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 200,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 60,
  },
});
