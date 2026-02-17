const resolveBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
};

// Feature flags are public because they gate UI behavior at runtime.
export const AUTH_ENABLED = resolveBoolean(
  process.env.EXPO_PUBLIC_AUTH_ENABLED,
  true,
);
