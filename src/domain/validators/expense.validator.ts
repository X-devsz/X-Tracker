export interface ExpenseValidationErrors {
  amount?: string;
  category?: string;
  date?: string;
}

export interface ExpenseValidationInput {
  amountMinor?: number | null;
  categoryId?: string | null;
  occurredAt?: Date | null;
}

interface ExpenseValidationOptions {
  requireAll?: boolean;
}

export const validateExpenseInput = (
  input: ExpenseValidationInput,
  options: ExpenseValidationOptions = {},
): ExpenseValidationErrors => {
  const errors: ExpenseValidationErrors = {};
  const requireAll = options.requireAll ?? true;

  if (requireAll || input.amountMinor !== undefined) {
    if (!input.amountMinor || input.amountMinor <= 0) {
      errors.amount = 'Amount must be greater than zero.';
    } else if (!Number.isInteger(input.amountMinor)) {
      errors.amount = 'Amount must be an integer minor unit.';
    }
  }

  if (requireAll || input.categoryId !== undefined) {
    if (!input.categoryId || input.categoryId.trim().length === 0) {
      errors.category = 'Category is required.';
    }
  }

  if (requireAll || input.occurredAt !== undefined) {
    if (!input.occurredAt) {
      errors.date = 'Date is required.';
    }
  }

  return errors;
};

export const assertExpenseInput = (
  input: ExpenseValidationInput,
  options: ExpenseValidationOptions = {},
): void => {
  const errors = validateExpenseInput(input, options);
  const message = errors.amount ?? errors.category ?? errors.date;
  if (message) {
    throw new Error(message);
  }
};
