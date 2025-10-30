import type { Market, CreateMarketRequest } from "@/types/market.types";
import type { Bet } from "@/types/bet.types";
import type { ApiResponse } from "@/types/api.types";

import { apiClient } from "@/lib/api-client";

export const marketService = {
  /**
   * Get all markets with optional filtering and pagination
   * @param params - Query parameters for filtering markets
   * @returns List of markets with pagination metadata
   */
  getMarkets: async (params?: {
    limit?: number;
    offset?: number;
    status?: "active" | "resolved" | "all";
    sort_by?:
      | "end_time"
      | "transaction_version"
      | "tvl"
      | "created_at"
      | "question";
    order?: "asc" | "desc";
  }) => {
    return apiClient.get<ApiResponse<Market[]>>(
      "/markets",
      params as Record<string, string | number>,
    );
  },

  /**
   * Get a specific market by ID
   * @deprecated Use getFlowMarket instead
   * @param id - Market ID
   * @returns Market details
   */
  getMarketById: async (id: string) => {
    return apiClient.get<ApiResponse<Market>>(`/markets/${id}`);
  },

  /**
   * Get all bets for a specific market
   * @param id - Market ID
   * @param params - Pagination parameters
   * @returns List of bets with pagination metadata
   */
  getMarketBets: async (
    id: string,
    params?: { limit?: number; offset?: number },
  ) => {
    return apiClient.get<ApiResponse<Bet[]>>(
      `/markets/${id}/bets`,
      params as Record<string, string | number>,
    );
  },

  /**
   * Update market image URL
   * @param id - Market ID
   * @param imageUrl - New image URL or null to remove
   * @returns Success message
   */
  updateMarketImage: async (id: string, imageUrl: string | null) => {
    return apiClient.put<{ message: string }>(`/markets/${id}/image`, {
      imageUrl,
    });
  },

  /**
   * Create a new market on the blockchain
   * @param data - Market creation data
   * @returns Market creation response
   */
  createBlockchainMarket: async (data: CreateMarketRequest) => {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: {
        question: string;
        description: string;
        duration: number;
      };
    }>("/markets/create-blockchain", data);
  },

  /**
   * Get Flow blockchain markets
   * @param marketId - Optional specific market ID
   * @returns Flow market data
   */
  getFlowMarkets: async () => {
    return apiClient.get<ApiResponse<Market[]>>("/flow/markets");
  },

  /**
   * Get a specific Flow blockchain market
   * @param marketId - Market ID
   * @returns Flow market details
   */
  getFlowMarket: async (marketId: string) => {
    return apiClient.get<ApiResponse<Market>>(`/flow/markets/${marketId}`);
  },
};
