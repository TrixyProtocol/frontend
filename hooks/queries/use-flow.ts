import { useQuery } from "@tanstack/react-query";

import { flowService } from "@/services/flow.service";

export const useFlowMarkets = (params?: {
  limit?: number;
  offset?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["flow", "markets", params],
    queryFn: () => flowService.getFlowMarkets(params),
  });
};

export const useFlowMarket = (marketId: number, enabled = true) => {
  return useQuery({
    queryKey: ["flow", "market", marketId],
    queryFn: () => flowService.getFlowMarket(marketId),
    enabled: enabled && !!marketId,
  });
};

export const useFlowBets = (params?: {
  limit?: number;
  offset?: number;
  market_id?: number;
  user?: string;
}) => {
  return useQuery({
    queryKey: ["flow", "bets", params],
    queryFn: () => flowService.getFlowBets(params),
  });
};

export const useFlowUserStats = (address: string, enabled = true) => {
  return useQuery({
    queryKey: ["flow", "user", address, "stats"],
    queryFn: () => flowService.getFlowUserStats(address),
    enabled: enabled && !!address,
  });
};

export const useFlowUserMarketBets = (
  address: string,
  marketId: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["flow", "user", address, "market", marketId, "bets"],
    queryFn: () => flowService.getFlowUserMarketBets(address, marketId),
    enabled: enabled && !!address && !!marketId,
  });
};

export const useBlockchainInfo = () => {
  return useQuery({
    queryKey: ["blockchain", "info"],
    queryFn: () => flowService.getBlockchainInfo(),
  });
};

export const useBlockchainStatus = () => {
  return useQuery({
    queryKey: ["blockchain", "status"],
    queryFn: () => flowService.getBlockchainStatus(),
  });
};

export const useLatestBlock = () => {
  return useQuery({
    queryKey: ["blockchain", "latest-block"],
    queryFn: () => flowService.getLatestBlock(),
    refetchInterval: 5000,
  });
};
