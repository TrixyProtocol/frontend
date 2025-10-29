/**
 * Convert FLOW amount to USD
 * @param flowAmount - Amount in FLOW tokens
 * @param flowPriceUsd - Current FLOW price in USD
 * @returns USD value
 */
export function flowToUsd(flowAmount: number, flowPriceUsd: number): number {
  return flowAmount * flowPriceUsd;
}

/**
 * Format USD value with $ prefix and appropriate decimals
 * @param usdValue - Value in USD
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted USD string
 */
export function formatUsd(usdValue: number, decimals: number = 2): string {
  return `$${usdValue.toFixed(decimals)}`;
}

/**
 * Convert and format FLOW to USD in one step
 * @param flowAmount - Amount in FLOW tokens
 * @param flowPriceUsd - Current FLOW price in USD
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted USD string
 */
export function flowToUsdFormatted(
  flowAmount: number,
  flowPriceUsd: number,
  decimals: number = 2,
): string {
  const usdValue = flowToUsd(flowAmount, flowPriceUsd);

  return formatUsd(usdValue, decimals);
}
