export function formatINR(amount: number, withSymbol = true): string {
  try {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: withSymbol ? 'currency' : undefined,
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
    return formatted;
  } catch {
    return `${withSymbol ? '₹' : ''}${Math.round(amount).toLocaleString('en-IN')}`;
  }
}
