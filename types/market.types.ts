import { Protocol } from "./protocol.types";

export interface Market {
  ID: string;
  BlockchainMarketID?: number;
  MarketID?: string;
  AdjTicker?: string;
  Platform: string;
  Question?: string;
  Description?: string;
  Rules?: string;
  Status: string;
  Probability: number;
  Volume: string;
  OpenInterest: string;
  EndDate: string;
  ResolutionDate?: string | null;
  Result?: boolean | null;
  Link?: string;
  ImageURL?: string;
  TotalPoolSize: string;
  YesPoolSize: string;
  NoPoolSize: string;
  CountYes: number;
  CountNo: number;
  CurrentYield: string;
  TotalYieldEarned: string;
  TotalYieldUntilEnd?: string | null;
  Options?: string[];
  yieldProtocol?: Protocol;
  WinningOption?: string;
  CreatorAddress?: string;
  OptionStats?: Record<string, OptionStats>;
  MarketCreatedAt: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface OptionStats {
  OptionName: string;
  TotalStaked: string;
  ParticipantCount: number;
  Percentage: number;
}

export interface CreateMarketRequest {
  question: string;
  description: string;
  duration: number;
  options: string[];
  yieldProtocol: string;
  imageUrl?: string;
}

export interface UpdateMarketImageRequest {
  imageUrl: string | null;
}
