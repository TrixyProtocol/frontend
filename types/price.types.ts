export interface OraclePrice {
  id: string;
  symbol: string;
  priceUsd: number;
  txHash?: string;
  blockNumber?: number;
  createdAt: string;
}

export interface PriceStats {
  symbol: string;
  hours: number;
  count: number;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  priceChange: number;
  priceChangePercent: number;
  oldestTimestamp: string;
  latestTimestamp: string;
}

export interface PriceChartPoint {
  timestamp: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  count: number;
}
