import type {
  OraclePrice,
  PriceStats,
  PriceChartPoint,
} from "@/types/price.types";

import { apiClient } from "@/lib/api-client";

export const priceService = {
  getLatestPrice: async (params?: { symbol?: string }) => {
    return apiClient.get<OraclePrice>(
      "/oracle/price/latest",
      params as Record<string, string | number>,
    );
  },

  getPriceHistory: async (params?: {
    symbol?: string;
    limit?: number;
    hours?: number;
  }) => {
    return apiClient.get<{
      data: OraclePrice[];
      meta: {
        symbol: string;
        hours: number;
        limit: number;
        count: number;
      };
    }>("/oracle/price/history", params as Record<string, string | number>);
  },

  getPriceStats: async (params?: { symbol?: string; hours?: number }) => {
    return apiClient.get<PriceStats>(
      "/oracle/price/stats",
      params as Record<string, string | number>,
    );
  },

  getPriceChart: async (params?: {
    symbol?: string;
    interval?: string;
    hours?: number;
  }) => {
    return apiClient.get<{
      data: PriceChartPoint[];
      meta: {
        symbol: string;
        interval: string;
        hours: number;
        count: number;
      };
    }>("/oracle/price/chart", params as Record<string, string | number>);
  },
};
