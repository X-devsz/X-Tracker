import { format, isSameMonth, isSameYear, isToday, isYesterday } from 'date-fns';

const CURRENCY_SYMBOLS: Record<string, string> = {
  LKR: 'Rs ',
  USD: '$',
  CAD: '$',
  AUD: '$',
  NZD: '$',
  EUR: 'EUR ',
  GBP: 'GBP ',
  INR: 'INR ',
  JPY: 'JPY ',
};

export const SUPPORTED_CURRENCY_CODES = Object.keys(CURRENCY_SYMBOLS);

export const getCurrencySymbol = (code: string, locale?: string): string => {
  const upper = code.toUpperCase();
  if (CURRENCY_SYMBOLS[upper]) {
    return CURRENCY_SYMBOLS[upper];
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: upper,
      currencyDisplay: 'narrowSymbol',
    });
    const parts = formatter.formatToParts(0);
    const symbol = parts.find((part) => part.type === 'currency')?.value;
    return symbol ?? `${upper} `;
  } catch {
    return `${upper} `;
  }
};

export const formatCurrency = (
  amountMinor: number,
  currencyCode: string,
  locale?: string,
): string => {
  const amount = amountMinor / 100;
  const upper = currencyCode.toUpperCase();
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: upper,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const symbol = getCurrencySymbol(upper, locale);
    return `${symbol}${formatAmountMinor(amountMinor, locale)}`;
  }
};

export const formatAmountMinor = (amountMinor: number, locale?: string): string => {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return amount.toFixed(2);
  }
};

export const parseAmountToMinor = (value: string): number => {
  const normalized = value.replace(/,/g, '').trim();
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.round(parsed * 100);
};

export const formatExpenseDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today - ${format(date, 'h:mm a')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday - ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, yyyy');
};

export const formatMonthLabel = (date: Date): string => format(date, 'MMM');

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  if (isSameYear(startDate, endDate)) {
    if (isSameMonth(startDate, endDate)) {
      return `${format(startDate, 'MMM d')}-${format(endDate, 'd, yyyy')}`;
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  }
  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
};
