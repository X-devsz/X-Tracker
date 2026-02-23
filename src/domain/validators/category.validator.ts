export interface CategoryValidationErrors {
  name?: string;
}

export const normalizeCategoryName = (name: string): string =>
  name.trim().toLowerCase();

export const validateCategoryName = (name?: string | null): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Category name is required.';
  }
  return null;
};

export const validateCategoryInput = (name?: string | null): CategoryValidationErrors => {
  const error = validateCategoryName(name);
  return error ? { name: error } : {};
};

export const isCategoryNameUnique = (name: string, existingNames: string[]): boolean => {
  const normalized = normalizeCategoryName(name);
  return !existingNames.some((existing) => normalizeCategoryName(existing) === normalized);
};
