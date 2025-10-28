import type { PlatformStats, LeaderboardEntry } from "@/types/stats.types";

import { apiClient } from "@/lib/api-client";

export const statsService = {
  getPlatformStats: async () => {
    return apiClient.get<PlatformStats>("/stats/platform");
  },

  getLeaderboard: async (params?: { limit?: number }) => {
    return apiClient.get<LeaderboardEntry[]>(
      "/stats/leaderboard",
      params as Record<string, string | number>,
    );
  },
};
