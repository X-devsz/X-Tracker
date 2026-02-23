import { categoryColors } from '../theme';

export const resolveCategoryColor = (
  token?: string | null,
  fallback: string = categoryColors.other,
): string => {
  if (!token) return fallback;
  const key = token as keyof typeof categoryColors;
  return categoryColors[key] ?? fallback;
};

export const resolveCategoryIcon = (
  icon?: string | null,
  fallback: string = 'pricetag-outline',
): string => (icon && icon.length > 0 ? icon : fallback);
