import { useQuery } from "@tanstack/react-query";

import { betService } from "@/services/bet.service";

export const useBets = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ["bets", params],
    queryFn: () => betService.getBets(params),
  });
};

export const useBet = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["bet", id],
    queryFn: () => betService.getBetById(id),
    enabled: enabled && !!id,
  });
};

export const useUserBets = (
  address: string,
  params?: { limit?: number; offset?: number },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["user", address, "bets", params],
    queryFn: () => betService.getUserBets(address, params),
    enabled: enabled && !!address,
  });
};

export const useMarketBets = (
  marketId: string,
  params?: { limit?: number; offset?: number },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["market", marketId, "bets", params],
    queryFn: () => betService.getMarketBets(marketId, params),
    enabled: enabled && !!marketId,
  });
};

export const useBetStats = (userAddress?: string) => {
  return useQuery({
    queryKey: ["bet-stats", userAddress],
    queryFn: () => betService.getBetStats(userAddress),
  });
};

export const useMarketActivity = (
  marketId: number,
  params?: { limit?: number; offset?: number },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["market", marketId, "activity", params],
    queryFn: () => betService.getFlowMarketBets(marketId, params),
    enabled: enabled && !!marketId,
    refetchInterval: 10000,
  });
};

export const useFlowBets = (
  params?: { limit?: number; offset?: number; user?: string },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["flow", "bets", params],
    queryFn: () => betService.getFlowBets(params),
    enabled,
    refetchInterval: 10000,
  });
};
