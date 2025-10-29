import type { Bet, BetStats } from "@/types/bet.types";
import type { ApiResponse } from "@/types/api.types";

import { apiClient } from "@/lib/api-client";

export interface FlowBet {
  id: string;
  marketId: number;
  user: string;
  selectedOption: string;
  amount: string;
  blockHeight: number;
  blockTimestamp: number;
  transactionId: string;
  eventIndex: number;
}

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

  getFlowMarketBets: async (
    marketId: number,
    params?: { limit?: number; offset?: number },
  ) => {
    return apiClient.get<FlowBet[]>("/flow/bets", {
      market_id: marketId,
      ...params,
    } as Record<string, string | number>);
  },

  getFlowBets: async (params?: {
    limit?: number;
    offset?: number;
    user?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<Bet[]>>(
      "/bets",
      params as Record<string, string | number>,
    );

    return response.data.map((bet: any) => ({
      id: bet.ID,
      marketId: bet.BlockchainBetID || 0,
      user: bet.UserID,
      selectedOption: bet.Position ? "YES" : "NO",
      amount: bet.Amount || "0",
      blockHeight: 0,
      blockTimestamp: new Date(bet.CreatedAt).getTime() / 1000,
      transactionId: "",
      eventIndex: 0,
    }));
  },
};
