export interface Market {
  id: string;
  question: string;
  description: string;
  imageUrl?: string;
  endTime: string;
  status: string;
  yesOdds: number;
  noOdds: number;
  totalVolume: string;
  createdAt: string;
}
