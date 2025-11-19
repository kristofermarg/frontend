const STORE_CURRENCY =
  process.env.NEXT_PUBLIC_STORE_CURRENCY?.toUpperCase() ?? "USD";

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "en-US";
const FRACTION_DIGITS = STORE_CURRENCY === "ISK" ? 0 : 2;

export const formatCurrency = (value: string | number): string => {
  const numericValue =
    typeof value === "string" ? parseFloat(value || "0") : value;

  if (!Number.isFinite(numericValue)) {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: "currency",
      currency: STORE_CURRENCY,
      currencyDisplay: "symbol",
      minimumFractionDigits: FRACTION_DIGITS,
      maximumFractionDigits: FRACTION_DIGITS,
    }).format(0);
  }

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency: STORE_CURRENCY,
    minimumFractionDigits: FRACTION_DIGITS,
    maximumFractionDigits: FRACTION_DIGITS,
  }).format(numericValue);
};
