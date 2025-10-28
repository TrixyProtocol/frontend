import type { Market } from "@/types/market.types";
import type { Bet } from "@/types/bet.types";
import type { ApiResponse } from "@/types/api.types";

import { apiClient } from "@/lib/api-client";

export const marketService = {
  getMarkets: async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    sort_by?: string;
    order?: string;
  }) => {
    return apiClient.get<ApiResponse<Market[]>>(
      "/markets",
      params as Record<string, string | number>,
    );
  },

  getMarketById: async (id: string) => {
    return apiClient.get<ApiResponse<Market>>(`/markets/${id}`);
  },

  getMarketBets: async (
    id: string,
    params?: { limit?: number; offset?: number },
  ) => {
    return apiClient.get<ApiResponse<Bet[]>>(
      `/markets/${id}/bets`,
      params as Record<string, string | number>,
    );
  },

  updateMarketImage: async (id: string, imageUrl: string | null) => {
    return apiClient.put<{ message: string }>(`/markets/${id}/image`, {
      imageUrl,
    });
  },
};
