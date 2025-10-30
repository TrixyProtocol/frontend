import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { marketService } from "@/services/market.service";

export const useMarkets = (params?: {
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
  return useQuery({
    queryKey: ["markets", params],
    queryFn: () => marketService.getMarkets(params),
  });
};

export const useMarket = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["market", id],
    queryFn: () => marketService.getMarketById(id),
    enabled: enabled && !!id,
  });
};

export const useMarketBets = (
  id: string,
  params?: { limit?: number; offset?: number },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["market", id, "bets", params],
    queryFn: () => marketService.getMarketBets(id, params),
    enabled: enabled && !!id,
  });
};

export const useUpdateMarketImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }: { id: string; imageUrl: string | null }) =>
      marketService.updateMarketImage(id, imageUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["market", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });
};
