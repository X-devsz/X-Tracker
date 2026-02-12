/**
 * matchMedia polyfill for React Native
 *
 * Tamagui's @tamagui/select uses window.matchMedia which
 * doesn't exist in React Native. This provides a minimal
 * no-op implementation.
 */
const createMatchMedia = () => (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

const windowMatchMedia =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia
    : null;

if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.matchMedia !== 'function') {
    globalThis.matchMedia = windowMatchMedia ?? createMatchMedia();
  }
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = globalThis.matchMedia ?? createMatchMedia();
}
