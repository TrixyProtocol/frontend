import type { User, UserStats } from "@/types/user.types";
import type { Bet } from "@/types/bet.types";
import type { ApiResponse } from "@/types/api.types";

import { apiClient } from "@/lib/api-client";

export const userService = {
  getUser: async (address: string) => {
    return apiClient.get<User>(`/users/${address}`);
  },

  getUserBets: async (
    address: string,
    params?: { limit?: number; offset?: number },
  ) => {
    return apiClient.get<ApiResponse<Bet[]>>(
      `/users/${address}/bets`,
      params as Record<string, string | number>,
    );
  },

  getUserStats: async (address: string) => {
    return apiClient.get<UserStats>(`/users/${address}/stats`);
  },
};
