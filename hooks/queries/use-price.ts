import { useQuery } from "@tanstack/react-query";

import { priceService } from "@/services/price.service";

export const useLatestPrice = (params?: { symbol?: string }) => {
  return useQuery({
    queryKey: ["price", "latest", params],
    queryFn: () => priceService.getLatestPrice(params),
    refetchInterval: 60000,
  });
};

export const usePriceHistory = (params?: {
  symbol?: string;
  limit?: number;
  hours?: number;
}) => {
  return useQuery({
    queryKey: ["price", "history", params],
    queryFn: () => priceService.getPriceHistory(params),
  });
};

export const usePriceStats = (params?: { symbol?: string; hours?: number }) => {
  return useQuery({
    queryKey: ["price", "stats", params],
    queryFn: () => priceService.getPriceStats(params),
  });
};

export const usePriceChart = (params?: {
  symbol?: string;
  interval?: string;
  hours?: number;
}) => {
  return useQuery({
    queryKey: ["price", "chart", params],
    queryFn: () => priceService.getPriceChart(params),
  });
};
