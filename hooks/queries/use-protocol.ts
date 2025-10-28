import { useQuery } from "@tanstack/react-query";

import { protocolService } from "@/services/protocol.service";

export const useProtocols = () => {
  return useQuery({
    queryKey: ["protocols"],
    queryFn: () => protocolService.getProtocols(),
  });
};

export const useProtocol = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["protocol", id],
    queryFn: () => protocolService.getProtocolById(id),
    enabled: enabled && !!id,
  });
};

export const useProtocolByAddress = (address: string, enabled = true) => {
  return useQuery({
    queryKey: ["protocol", "address", address],
    queryFn: () => protocolService.getProtocolByAddress(address),
    enabled: enabled && !!address,
  });
};
