import type { MarketChartData, PlatformChartData } from "@/types/chart.types";

import { apiClient } from "@/lib/api-client";

export const chartService = {
  getMarketChart: async (
    marketId: string,
    params?: {
      interval?: string;
      from?: number;
      to?: number;
      series?: string;
    },
  ) => {
    return apiClient.get<{
      success: boolean;
      meta: {
        market_id: number;
        interval: string;
        from?: number;
        to?: number;
        series: string[];
      };
      data: MarketChartData;
    }>(`/charts/market/${marketId}`, params as Record<string, string | number>);
  },

  getPlatformChart: async (params?: { days?: number }) => {
    return apiClient.get<{
      success: boolean;
      data: PlatformChartData;
      meta: {
        days: number;
      };
    }>("/charts/platform", params as Record<string, string | number>);
  },
};
