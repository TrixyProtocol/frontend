export interface PlatformStats {
  totalMarkets: number;
  activeMarkets: number;
  totalVolume: string;
  totalUsers: number;
  totalBets: number;
}

export interface LeaderboardEntry {
  address: string;
  totalVolume: string;
  winRate: number;
  totalBets: number;
  rank: number;
}
