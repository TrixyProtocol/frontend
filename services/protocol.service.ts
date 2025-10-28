import type { Protocol } from "@/types/protocol.types";

import { apiClient } from "@/lib/api-client";

export const protocolService = {
  getProtocols: async () => {
    return apiClient.get<Protocol[]>("/protocols");
  },

  getProtocolById: async (id: string) => {
    return apiClient.get<Protocol>(`/protocols/${id}`);
  },

  getProtocolByAddress: async (address: string) => {
    return apiClient.get<Protocol>(`/protocols/address/${address}`);
  },
};
