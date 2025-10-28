import type {
  FlowMarket,
  FlowBet,
  FlowUserStats,
  BlockchainInfo,
  LatestBlock,
} from "@/types/flow.types";

import { apiClient } from "@/lib/api-client";

export const flowService = {
  getFlowMarkets: async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) => {
    return apiClient.get<FlowMarket[]>(
      "/flow/markets",
      params as Record<string, string | number>,
    );
  },

  getFlowMarket: async (marketId: number) => {
    return apiClient.get<FlowMarket>(`/flow/markets/${marketId}`);
  },

  getFlowBets: async (params?: {
    limit?: number;
    offset?: number;
    market_id?: number;
    user?: string;
  }) => {
    return apiClient.get<FlowBet[]>(
      "/flow/bets",
      params as Record<string, string | number>,
    );
  },

  getFlowUserStats: async (address: string) => {
    return apiClient.get<FlowUserStats>(`/flow/users/${address}/stats`);
  },

  getFlowUserMarketBets: async (address: string, marketId: number) => {
    return apiClient.get<FlowBet[]>(
      `/flow/users/${address}/markets/${marketId}/bets`,
    );
  },

  getBlockchainInfo: async () => {
    return apiClient.get<BlockchainInfo>("/blockchain/info");
  },

  getBlockchainStatus: async () => {
    return apiClient.get<BlockchainInfo>("/blockchain/status");
  },

  getLatestBlock: async () => {
    return apiClient.get<LatestBlock>("/blockchain/latest-block");
  },
};
