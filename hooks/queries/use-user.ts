import { useQuery } from "@tanstack/react-query";

import { userService } from "@/services/user.service";

export const useUser = (address: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", address],
    queryFn: () => userService.getUser(address),
    enabled: enabled && !!address,
  });
};

export const useUserBets = (
  address: string,
  params?: { limit?: number; offset?: number },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["user", address, "bets", params],
    queryFn: () => userService.getUserBets(address, params),
    enabled: enabled && !!address,
  });
};

export const useUserStats = (address: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", address, "stats"],
    queryFn: () => userService.getUserStats(address),
    enabled: enabled && !!address,
  });
};
