import { EcoAction, OffsetProject, CarbonTransaction } from '../types';

export const INITIAL_PRESET_LOCATIONS = [
  'San Francisco, USA',
  'London, UK',
  'Tokyo, Japan',
  'Zurich, Switzerland',
  'Sydney, Australia',
  'São Paulo, Brazil',
  'Nairobi, Kenya',
  'Singapore',
  'New York, USA',
];

export const ECO_ACTION_ITEMS: EcoAction[] = [
  {
    id: 'solar-1',
    title: 'Log Solar Power Generation',
    category: 'energy',
    credits: 15,
    description: 'Generated 10kWh+ from residential or community rooftop solar panels.',
    iconName: 'sun',
  },
  {
    id: 'transit-1',
    title: 'Log Electric / Bicycle Commute',
    category: 'transit',
    credits: 10,
    description: 'Replaced a fossil-fuel vehicle commute with EV, cycling, or transit.',
    iconName: 'bike',
  },
  {
    id: 'tree-1',
    title: 'Plant a Native Urban Tree',
    category: 'forest',
    credits: 25,
    description: 'Planted and registered a native sapling to absorb CO₂ and boost biodiversity.',
    iconName: 'trees',
  },
  {
    id: 'recycle-1',
    title: 'Log Zero-Waste & Composting',
    category: 'recycling',
    credits: 8,
    description: 'Diverted organic waste to local compost or recycled high-density materials.',
    iconName: 'recycle',
  },
  {
    id: 'energy-2',
    title: 'Smart Thermostat Efficiency',
    category: 'conservation',
    credits: 12,
    description: 'Reduced grid peak heating/cooling power draw by 15% using automation.',
    iconName: 'zap',
  },
];

export const INITIAL_TRANSACTIONS: CarbonTransaction[] = [
  {
    id: 'tx-101',
    title: 'Solar Power Generation Logged',
    type: 'earn',
    amount: 15,
    date: '2026-08-08 14:22',
    details: 'Verified 12.4 kWh rooftop generation',
  },
  {
    id: 'tx-102',
    title: 'Eco Transit Commute',
    type: 'earn',
    amount: 10,
    date: '2026-08-07 09:15',
    details: '14 km Zero-Emission E-Bike commute',
  },
  {
    id: 'tx-103',
    title: 'Funded Amazonian Reforestation',
    type: 'redeem',
    amount: -50,
    date: '2026-08-05 18:30',
    details: 'Retired 0.5 tonnes CO₂e via Gold Standard',
  },
  {
    id: 'tx-104',
    title: 'Initial Atmosphere Welcome Bonus',
    type: 'earn',
    amount: 150,
    date: '2026-08-01 10:00',
    details: 'Verified station registration bonus',
  },
];

export const OFFSET_PROJECTS: OffsetProject[] = [
  {
    id: 'proj-1',
    title: 'Amazon Basin Canopy Protection',
    location: 'Madre de Dios, Peru',
    category: 'Forestry & Biodiversity',
    pricePerCredit: 12, // 12 credits per 100kg offset
    verifier: 'Verra VCS + CCB Gold',
    co2OffsetTonnes: 125000,
    description: 'Protecting 50,000 hectares of primary rainforest from illegal deforestation while empowering local indigenous guardians.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop',
    fundedPercentage: 84,
  },
  {
    id: 'proj-2',
    title: 'High-Altitude Andean Solar Microgrid',
    location: 'Arequipa, Peru',
    category: 'Clean Energy',
    pricePerCredit: 15,
    verifier: 'Gold Standard Certified',
    co2OffsetTonnes: 48000,
    description: 'Replacing diesel generators in remote mountain villages with 100% clean solar microgrids and battery storage.',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=800&auto=format&fit=crop',
    fundedPercentage: 62,
  },
  {
    id: 'proj-3',
    title: 'Kelp Forest Blue Carbon Restoration',
    location: 'Tasmania, Australia',
    category: 'Ocean & Blue Carbon',
    pricePerCredit: 20,
    verifier: 'American Carbon Registry',
    co2OffsetTonnes: 32000,
    description: 'Restoring giant kelp ecosystems that sequester carbon up to 20 times faster than terrestrial forests.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    fundedPercentage: 45,
  },
  {
    id: 'proj-4',
    title: 'Geothermal District Energy Network',
    location: 'Reykjanes, Iceland',
    category: 'Direct Air Capture & Thermal',
    pricePerCredit: 30,
    verifier: 'Puro.earth Carbon Removal',
    co2OffsetTonnes: 15000,
    description: 'Direct air capture technology powered by deep geothermal heat, permanently mineralization into basalt formations.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    fundedPercentage: 91,
  },
];

export const HISTORICAL_ATMOSPHERIC_DATA = [
  { month: 'Jan', co2: 418.2, temp: 14.2, aqi: 24, methane: 1895, creditsPrice: 14.5 },
  { month: 'Feb', co2: 418.9, temp: 14.8, aqi: 28, methane: 1902, creditsPrice: 15.2 },
  { month: 'Mar', co2: 419.5, temp: 15.4, aqi: 32, methane: 1908, creditsPrice: 16.0 },
  { month: 'Apr', co2: 420.1, temp: 16.2, aqi: 30, methane: 1910, creditsPrice: 15.8 },
  { month: 'May', co2: 421.3, temp: 17.5, aqi: 35, methane: 1915, creditsPrice: 17.1 },
  { month: 'Jun', co2: 420.8, temp: 18.9, aqi: 42, methane: 1912, creditsPrice: 18.4 },
  { month: 'Jul', co2: 420.2, temp: 20.1, aqi: 48, methane: 1909, creditsPrice: 19.2 },
  { month: 'Aug', co2: 421.4, temp: 19.8, aqi: 38, methane: 1912, creditsPrice: 21.0 },
];
