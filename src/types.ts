export interface TelemetryData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  pressure: number;
  aqi: number;
  aqiCategory: string;
  co2: string;
  methane: number;
  ozone: number;
  pollen: string;
  pm25: string;
  pm10: string;
  lastUpdated: string;
}

export interface EcoAction {
  id: string;
  title: string;
  category: 'energy' | 'transit' | 'forest' | 'recycling' | 'conservation';
  credits: number;
  description: string;
  iconName: string;
}

export interface CarbonTransaction {
  id: string;
  title: string;
  type: 'earn' | 'redeem' | 'buy' | 'sell';
  amount: number;
  date: string;
  details: string;
}

export interface OffsetProject {
  id: string;
  title: string;
  location: string;
  category: string;
  pricePerCredit: number; // in $ or credits
  verifier: string;
  co2OffsetTonnes: number;
  description: string;
  image: string;
  fundedPercentage: number;
}

export type MapLayerType = 'satellite' | 'wind' | 'temp' | 'aqi' | 'co2';

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface CarbonCertificate {
  certificateId: string;
  serialNumber: string;
  beneficiaryName: string;
  projectTitle: string;
  location: string;
  verifier: string;
  co2RetiredKg: number;
  creditsRetired: number;
  issueDate: string;
  verificationHash: string;
  status: 'ACTIVE_RETIRED' | 'VERIFIED';
}
