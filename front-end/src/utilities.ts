import { Address } from './universalTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IntentionallyAny = any;

const moneyFormatter = new Intl.NumberFormat('en-US', {
  // Formats to USD
  style: 'currency',
  currency: 'USD',

  // Round to nearest int
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Format a number into its money value
// Rounds to the nearest integer
export function formatNumberToMoney(n?: number): string {
  if (n !== undefined) return moneyFormatter.format(n);
  return '---';
}

export function formatAddressState(address: Address): string {
  return `${address.city}, ${address.state} ${address.zipcode}`;
}
