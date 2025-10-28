import { useQuery } from "@tanstack/react-query";

import { statsService } from "@/services/stats.service";

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: () => statsService.getPlatformStats(),
  });
};

export const useLeaderboard = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: () => statsService.getLeaderboard(params),
  });
};
