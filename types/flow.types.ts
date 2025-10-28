export interface FlowMarket {
  marketId: number;
  question: string;
  description?: string;
  endTime: number;
  resolved: boolean;
  outcome?: boolean;
  yesPool: string;
  noPool: string;
  createdAt: number;
}

export interface FlowBet {
  betId: number;
  marketId: number;
  user: string;
  position: boolean;
  amount: string;
  odds: number;
  timestamp: number;
}

export interface FlowUserStats {
  address: string;
  totalBets: number;
  totalAmount: string;
  marketsParticipated: number;
}

export interface BlockchainInfo {
  network: string;
  chainId: string;
  contracts: {
    trixyProtocol: string;
  };
}

export interface LatestBlock {
  blockNumber: number;
  timestamp: number;
  network: string;
}
