export interface Protocol {
  id: string;
  name: string;
  displayName: string;
  protocolType: number;
  address: string;
  baseApy: string;
  tvl: string;
  riskLevel: number;
  isActive: boolean;
  description?: string;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
}
