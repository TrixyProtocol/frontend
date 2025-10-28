import type { Bet, BetStats } from "@/types/bet.types";
import type { ApiResponse } from "@/types/api.types";

import { apiClient } from "@/lib/api-client";

export const betService = {
  getBets: async (params?: { limit?: number; offset?: number }) => {
    return apiClient.get<ApiResponse<Bet[]>>(
      "/bets",
      params as Record<string, string | number>,
    );
  },

  getBetById: async (id: string) => {
    return apiClient.get<ApiResponse<Bet>>(`/bets/${id}`);
  },

  getUserBets: async (
    address: string,
    params?: { limit?: number; offset?: number },
  ) => {
    return apiClient.get<ApiResponse<Bet[]>>(
      `/bets/user/${address}`,
      params as Record<string, string | number>,
    );
  },

  getMarketBets: async (
    marketId: string,
    params?: { limit?: number; offset?: number },
  ) => {
    return apiClient.get<ApiResponse<Bet[]>>(
      `/bets/market/${marketId}`,
      params as Record<string, string | number>,
    );
  },

  getBetStats: async (userAddress?: string) => {
    const params = userAddress ? { userAddress } : undefined;

    return apiClient.get<ApiResponse<BetStats>>(
      "/bets/stats/summary",
      params as Record<string, string | number>,
    );
  },
};
