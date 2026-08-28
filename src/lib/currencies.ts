export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'SAR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // 1 USD in this currency
  formatPrefix: boolean;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateAgainstUSD: 1.0,
    formatPrefix: true,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateAgainstUSD: 0.92,
    formatPrefix: true,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateAgainstUSD: 0.79,
    formatPrefix: true,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    rateAgainstUSD: 3.6725,
    formatPrefix: true,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    rateAgainstUSD: 1.36,
    formatPrefix: true,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR ',
    name: 'Saudi Riyal',
    rateAgainstUSD: 3.75,
    formatPrefix: true,
  },
};

export function formatPrice(amountInUSD: number, targetCurrency: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  const converted = amountInUSD * config.rateAgainstUSD;
  const formattedNumber = converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (config.formatPrefix) {
    return `${config.symbol}${formattedNumber}`;
  }
  return `${formattedNumber} ${config.symbol}`;
}

export function convertAmount(amountInUSD: number, targetCurrency: CurrencyCode = 'USD'): number {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  return Number((amountInUSD * config.rateAgainstUSD).toFixed(2));
}
