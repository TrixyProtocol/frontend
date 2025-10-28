export interface Bet {
  id: string;
  marketId: string;
  userAddress: string;
  position: boolean;
  amount: string;
  odds: number;
  status: string;
  createdAt: string;
}

export interface BetStats {
  totalBets: number;
  totalVolume: string;
  activeMarkets: number;
  winRate?: number;
}
