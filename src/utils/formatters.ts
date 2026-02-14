import { format, isToday, isYesterday } from "date-fns";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  CAD: "$",
  AUD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  LKR: "Rs",
  NZD: "$",
};

export const getCurrencySymbol = (code: string, locale?: string): string => {
  const upper = code.toUpperCase();
  if (CURRENCY_SYMBOLS[upper]) {
    return CURRENCY_SYMBOLS[upper];
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: upper,
      currencyDisplay: "narrowSymbol",
    });
    const parts = formatter.formatToParts(0);
    const symbol = parts.find((part) => part.type === "currency")?.value;
    return symbol ?? `${upper} `;
  } catch {
    return `${upper} `;
  }
};

export const formatAmountMinor = (
  amountMinor: number,
  locale?: string
): string => {
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
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.round(parsed * 100);
};

export const formatExpenseDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today - ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday - ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, yyyy");
};

export const formatMonthLabel = (date: Date): string => format(date, "MMM");
