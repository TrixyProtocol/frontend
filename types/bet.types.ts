export interface Bet {
  id: string;
  blockchainBetId?: number | null;
  userId: string;
  marketId?: string | null;
  selectedOption?: string | null;
  position?: boolean | null;
  amount?: string | null;
  shares?: string | null;
  odds: string;
  status: string;
  payout?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BetStats {
  totalBets: number;
  activeBets: number;
  wonBets: number;
  lostBets: number;
  winRate: number;
  totalAmount: string;
  totalPayout: string;
  profit: string;
}

export interface PlaceBetRequest {
  marketIdentifier: string;
  selectedOption: string;
  position?: boolean;
  amount: string;
  userAddress: string;
}

export interface PlaceBetResult {
  betId: string;
  blockchainBetId?: number;
  marketId: string;
  blockchainMarketId?: number;
  position: boolean;
  amount: string;
  txHash: string;
  userAddress: string;
}
