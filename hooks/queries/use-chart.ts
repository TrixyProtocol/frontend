import { useQuery } from "@tanstack/react-query";

import { chartService } from "@/services/chart.service";

export const useMarketChart = (
  marketId: string,
  params?: {
    interval?: string;
    from?: number;
    to?: number;
    series?: string;
  },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["chart", "market", marketId, params],
    queryFn: () => chartService.getMarketChart(marketId, params),
    enabled: enabled && !!marketId,
  });
};

export const usePlatformChart = (params?: { days?: number }) => {
  return useQuery({
    queryKey: ["chart", "platform", params],
    queryFn: () => chartService.getPlatformChart(params),
  });
};
