export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  image: string;
  overallRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  risks: {
    flood: number;
    hail: number;
    wind: number;
    hurricane: number;
    wildfire: number;
  };
  yearBuilt: number;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  lastStormEvent: string;
  stormEventCount: number;
  aiSummary: string;
  recommendations: string[];
}

export interface StormEvent {
  id: string;
  date: string;
  type: 'Hail' | 'Tornado' | 'Flood' | 'Hurricane' | 'Thunderstorm' | 'Wildfire' | 'Wind';
  windSpeed: number;
  hailSize: string;
  damageEstimate: string;
  description: string;
  lat: number;
  lng: number;
  location: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Tornado Warning' | 'Flood Watch' | 'Severe Thunderstorm' | 'Heat Advisory' | 'Wind Advisory';
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  area: string;
  expires: string;
  description: string;
}

export interface AIPrediction {
  id: string;
  label: string;
  probability: number;
  confidence: number;
  timeframe: string;
  description: string;
  trend: number[];
}

export interface ContractorDemand {
  id: string;
  area: string;
  roofDamage: number;
  floodDamage: number;
  treeDamage: number;
  estimatedRepairCost: string;
  demandIndex: number;
  lat: number;
  lng: number;
}

export const properties: Property[] = [
  {
    id: 'p1',
    address: '123 Main Street',
    city: 'Ann Arbor',
    state: 'MI',
    zip: '48104',
    lat: 42.2808,
    lng: -83.7430,
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    overallRisk: 92,
    riskLevel: 'critical',
    risks: { flood: 35, hail: 78, wind: 62, hurricane: 5, wildfire: 8 },
    yearBuilt: 1998,
    propertyType: 'Single Family',
    beds: 4,
    baths: 2.5,
    sqft: 2450,
    lastStormEvent: '2024-06-15',
    stormEventCount: 6,
    aiSummary:
      'This property has experienced 6 severe weather events since 2008, including 3 hailstorms causing roof damage. Elevated hail and wind risk with aging roof materials (26+ years old).',
    recommendations: [
      'Inspect and replace aging roof shingles (26+ years old)',
      'Install impact-resistant roofing for hail mitigation',
      'Clean gutters and add gutter guards',
      'Upgrade sump pump with battery backup system',
      'Trim trees near power lines and structure',
    ],
  },
  {
    id: 'p2',
    address: '456 Oak Drive',
    city: 'Traverse City',
    state: 'MI',
    zip: '49684',
    lat: 44.7631,
    lng: -85.6206,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    overallRisk: 64,
    riskLevel: 'medium',
    risks: { flood: 72, hail: 40, wind: 55, hurricane: 2, wildfire: 15 },
    yearBuilt: 2005,
    propertyType: 'Single Family',
    beds: 3,
    baths: 2,
    sqft: 1850,
    lastStormEvent: '2024-04-22',
    stormEventCount: 3,
    aiSummary:
      'Property located in FEMA Zone AE with moderate flood risk. Recent storm events primarily wind-related. Basement flooding reported in 2019.',
    recommendations: [
      'Install backflow prevention valve',
      'Elevate HVAC equipment above base flood elevation',
      'Apply waterproof sealant to foundation',
    ],
  },
  {
    id: 'p3',
    address: '890 River Road',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49503',
    lat: 42.9634,
    lng: -85.6681,
    image: 'https://images.pexels.com/photos/1439093/pexels-photo-1439093.jpeg',
    overallRisk: 78,
    riskLevel: 'high',
    risks: { flood: 81, hail: 45, wind: 68, hurricane: 3, wildfire: 10 },
    yearBuilt: 1992,
    propertyType: 'Single Family',
    beds: 4,
    baths: 3,
    sqft: 3100,
    lastStormEvent: '2024-05-30',
    stormEventCount: 5,
    aiSummary:
      'High flood risk due to proximity to Grand River. 5 storm events since 2008 with 2 significant flood events. Property has elevated foundation but lacks flood vents.',
    recommendations: [
      'Install flood vents in crawl space',
      'Relocate water heater to upper floor',
      'Build landscape berms for water diversion',
      'Purchase flood insurance (NFIP or private)',
    ],
  },
  {
    id: 'p4',
    address: '271 Lakeshore Blvd',
    city: 'Lansing',
    state: 'MI',
    zip: '48910',
    lat: 42.7325,
    lng: -84.5555,
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',
    overallRisk: 45,
    riskLevel: 'low',
    risks: { flood: 22, hail: 35, wind: 48, hurricane: 1, wildfire: 12 },
    yearBuilt: 2015,
    propertyType: 'Single Family',
    beds: 3,
    baths: 2,
    sqft: 1600,
    lastStormEvent: '2023-08-10',
    stormEventCount: 2,
    aiSummary:
      'Newer construction (2015) with modern building codes. Low overall risk. Minor wind exposure. No significant flood or hail history.',
    recommendations: [
      'Maintain current roof condition',
      'Consider wind-resistant landscaping',
    ],
  },
  {
    id: 'p5',
    address: '5340 Pine Crest Lane',
    city: 'Kalamazoo',
    state: 'MI',
    zip: '49009',
    lat: 42.2917,
    lng: -85.5869,
    image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg',
    overallRisk: 71,
    riskLevel: 'high',
    risks: { flood: 28, hail: 82, wind: 65, hurricane: 2, wildfire: 20 },
    yearBuilt: 2001,
    propertyType: 'Single Family',
    beds: 4,
    baths: 2.5,
    sqft: 2200,
    lastStormEvent: '2024-06-28',
    stormEventCount: 4,
    aiSummary:
      'Elevated hail risk in Kalamazoo corridor. 4 hail events since 2015 with 2 producing 1.5"+ hail. Roof approaching end of lifespan.',
    recommendations: [
      'Replace roof with Class 4 impact-resistant shingles',
      'Install hail guards on AC units',
      'Add protective skylight covers',
    ],
  },
];

export const stormEvents: StormEvent[] = [
  { id: 's1', date: '2024-06-28', type: 'Hail', windSpeed: 65, hailSize: '1.75"', damageEstimate: '$45,000', description: 'Severe hailstorm producing 1.75 inch hail across Kalamazoo County. Significant roof and vehicle damage reported.', lat: 42.2917, lng: -85.5869, location: 'Kalamazoo, MI' },
  { id: 's2', date: '2024-06-15', type: 'Thunderstorm', windSpeed: 72, hailSize: '0.75"', damageEstimate: '$12,000', description: 'Linear winds downed trees and power lines across Washtenaw County.', lat: 42.2808, lng: -83.7430, location: 'Ann Arbor, MI' },
  { id: 's3', date: '2024-05-30', type: 'Flood', windSpeed: 35, hailSize: 'N/A', damageEstimate: '$85,000', description: 'Flash flooding along Grand River. 500-year flood event affecting 200+ properties.', lat: 42.9634, lng: -85.6681, location: 'Grand Rapids, MI' },
  { id: 's4', date: '2024-04-22', type: 'Wind', windSpeed: 81, hailSize: 'N/A', damageEstimate: '$22,000', description: 'High wind event with gusts to 81 mph. Widespread tree damage and power outages.', lat: 44.7631, lng: -85.6206, location: 'Traverse City, MI' },
  { id: 's5', date: '2023-08-10', type: 'Tornado', windSpeed: 120, hailSize: '1.0"', damageEstimate: '$340,000', description: 'EF1 tornado touched down near Lansing. Path length 4.2 miles, max width 150 yards.', lat: 42.7325, lng: -84.5555, location: 'Lansing, MI' },
  { id: 's6', date: '2023-07-04', type: 'Hail', windSpeed: 55, hailSize: '2.0"', damageEstimate: '$120,000', description: 'Supercell produced 2-inch hail across Ingham County. Extensive crop and property damage.', lat: 42.7325, lng: -84.5555, location: 'Lansing, MI' },
  { id: 's7', date: '2022-09-15', type: 'Thunderstorm', windSpeed: 68, hailSize: '1.0"', damageEstimate: '$18,000', description: 'Squall line produced widespread wind damage across western Michigan.', lat: 43.1566, lng: -86.2280, location: 'Muskegon, MI' },
  { id: 's8', date: '2022-06-20', type: 'Flood', windSpeed: 30, hailSize: 'N/A', damageEstimate: '$95,000', description: 'Slow-moving thunderstorms dumped 6+ inches of rain in 4 hours over Grand Rapids metro.', lat: 42.9634, lng: -85.6681, location: 'Grand Rapids, MI' },
  { id: 's9', date: '2021-08-25', type: 'Hail', windSpeed: 60, hailSize: '1.5"', damageEstimate: '$67,000', description: 'Hailstorm across Oakland County. 1.5 inch hail damaged roofs and vehicles.', lat: 42.6535, lng: -83.2099, location: 'Pontiac, MI' },
  { id: 's10', date: '2020-06-10', type: 'Tornado', windSpeed: 135, hailSize: '1.25"', damageEstimate: '$580,000', description: 'EF2 tornado near Monroe County. 8-mile path, significant structural damage.', lat: 41.9164, lng: -83.5378, location: 'Monroe, MI' },
  { id: 's11', date: '2019-07-19', type: 'Wind', windSpeed: 88, hailSize: 'N/A', damageEstimate: '$34,000', description: 'Derecho swept across Lower Michigan with winds exceeding 85 mph.', lat: 43.4529, lng: -85.5869, location: 'Greenville, MI' },
  { id: 's12', date: '2018-09-20', type: 'Flood', windSpeed: 40, hailSize: 'N/A', damageEstimate: '$150,000', description: 'Major flooding in Traverse City area after 8 inches of rainfall over 48 hours.', lat: 44.7631, lng: -85.6206, location: 'Traverse City, MI' },
];

export const weatherAlerts: WeatherAlert[] = [
  { id: 'w1', type: 'Tornado Warning', severity: 'extreme', area: 'Washtenaw County, MI', expires: 'Until 8:30 PM EDT', description: 'At 7:45 PM, a confirmed tornado was located near Ann Arbor, moving northeast at 35 mph. Take shelter immediately.' },
  { id: 'w2', type: 'Severe Thunderstorm', severity: 'severe', area: 'Kent County, MI', expires: 'Until 10:00 PM EDT', description: 'Severe thunderstorm with 70 mph wind gusts and quarter-size hail. Tree and power line damage likely.' },
  { id: 'w3', type: 'Flood Watch', severity: 'moderate', area: 'Grand Traverse County, MI', expires: 'Through Thursday morning', description: 'Heavy rainfall expected. 2-4 inches possible. Flash flooding possible in low-lying areas.' },
  { id: 'w4', type: 'Heat Advisory', severity: 'minor', area: 'Ingham County, MI', expires: 'Until 8:00 PM EDT', description: 'Heat index values up to 100 expected. Stay hydrated and limit outdoor activity.' },
];

export const aiPredictions: AIPrediction[] = [
  { id: 'a1', label: 'Flood Probability (12 mo)', probability: 34, confidence: 87, timeframe: 'Next 12 months', description: 'Based on historical flood patterns, watershed proximity, and climate models.', trend: [12, 18, 22, 28, 30, 34] },
  { id: 'a2', label: 'Roof Replacement Probability', probability: 72, confidence: 91, timeframe: 'Next 24 months', description: 'Roof age (26 years), hail exposure, and material degradation analysis.', trend: [45, 52, 58, 65, 69, 72] },
  { id: 'a3', label: 'Insurance Claim Probability', probability: 58, confidence: 83, timeframe: 'Next 18 months', description: 'Combined risk model across all perils with claim frequency analysis.', trend: [30, 38, 42, 48, 53, 58] },
  { id: 'a4', label: 'Tree Failure Risk', probability: 41, confidence: 78, timeframe: 'Next storm season', description: 'Tree species, age, soil moisture, and wind exposure analysis.', trend: [25, 28, 32, 36, 39, 41] },
  { id: 'a5', label: 'Power Outage Probability', probability: 63, confidence: 85, timeframe: 'Next 6 months', description: 'Grid infrastructure, storm frequency, and vegetation proximity model.', trend: [40, 45, 50, 55, 60, 63] },
  { id: 'a6', label: 'Foundation Movement Risk', probability: 28, confidence: 74, timeframe: 'Next 36 months', description: 'Soil composition, freeze-thaw cycles, and drainage assessment.', trend: [15, 18, 20, 23, 26, 28] },
];

export const contractorDemand: ContractorDemand[] = [
  { id: 'c1', area: 'Kalamazoo, MI', roofDamage: 85, floodDamage: 20, treeDamage: 45, estimatedRepairCost: '$2.4M', demandIndex: 92, lat: 42.2917, lng: -85.5869 },
  { id: 'c2', area: 'Grand Rapids, MI', roofDamage: 55, floodDamage: 90, treeDamage: 60, estimatedRepairCost: '$5.1M', demandIndex: 88, lat: 42.9634, lng: -85.6681 },
  { id: 'c3', area: 'Ann Arbor, MI', roofDamage: 70, floodDamage: 30, treeDamage: 75, estimatedRepairCost: '$3.2M', demandIndex: 81, lat: 42.2808, lng: -83.7430 },
  { id: 'c4', area: 'Lansing, MI', roofDamage: 65, floodDamage: 40, treeDamage: 50, estimatedRepairCost: '$2.8M', demandIndex: 74, lat: 42.7325, lng: -84.5555 },
  { id: 'c5', area: 'Traverse City, MI', roofDamage: 40, floodDamage: 75, treeDamage: 55, estimatedRepairCost: '$1.9M', demandIndex: 68, lat: 44.7631, lng: -85.6206 },
  { id: 'c6', area: 'Monroe, MI', roofDamage: 78, floodDamage: 35, treeDamage: 82, estimatedRepairCost: '$3.7M', demandIndex: 85, lat: 41.9164, lng: -83.5378 },
];

export const climateTrends = {
  rainfall: [
    { year: 1995, value: 32.1 },
    { year: 2000, value: 34.5 },
    { year: 2005, value: 36.2 },
    { year: 2010, value: 38.8 },
    { year: 2015, value: 37.4 },
    { year: 2020, value: 41.2 },
    { year: 2024, value: 43.6 },
  ],
  stormFrequency: [
    { year: 1995, value: 18 },
    { year: 2000, value: 22 },
    { year: 2005, value: 25 },
    { year: 2010, value: 28 },
    { year: 2015, value: 31 },
    { year: 2020, value: 35 },
    { year: 2024, value: 39 },
  ],
  floodEvents: [
    { year: 1995, value: 3 },
    { year: 2000, value: 4 },
    { year: 2005, value: 5 },
    { year: 2010, value: 7 },
    { year: 2015, value: 6 },
    { year: 2020, value: 9 },
    { year: 2024, value: 11 },
  ],
  hailEvents: [
    { year: 1995, value: 8 },
    { year: 2000, value: 10 },
    { year: 2005, value: 12 },
    { year: 2010, value: 15 },
    { year: 2015, value: 14 },
    { year: 2020, value: 18 },
    { year: 2024, value: 22 },
  ],
  heatWaves: [
    { year: 1995, value: 2 },
    { year: 2000, value: 3 },
    { year: 2005, value: 4 },
    { year: 2010, value: 5 },
    { year: 2015, value: 6 },
    { year: 2020, value: 8 },
    { year: 2024, value: 10 },
  ],
  freezeDates: [
    { year: 1995, value: 185 },
    { year: 2000, value: 180 },
    { year: 2005, value: 175 },
    { year: 2010, value: 170 },
    { year: 2015, value: 168 },
    { year: 2020, value: 162 },
    { year: 2024, value: 158 },
  ],
};

export const currentWeather = {
  location: 'Ann Arbor, MI',
  temperature: 74,
  condition: 'Partly Cloudy',
  windSpeed: 12,
  windDirection: 'SW',
  humidity: 62,
  pressure: 29.92,
  visibility: 10,
  uvIndex: 5,
  feelsLike: 76,
  forecast: [
    { day: 'Today', high: 78, low: 62, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', high: 82, low: 65, condition: 'Sunny' },
    { day: 'Wednesday', high: 75, low: 68, condition: 'Thunderstorms' },
    { day: 'Thursday', high: 70, low: 60, condition: 'Rain' },
    { day: 'Friday', high: 73, low: 58, condition: 'Partly Cloudy' },
  ],
};

export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-risk-high';
  if (score >= 60) return 'text-risk-medium';
  if (score >= 30) return 'text-brand-500';
  return 'text-risk-low';
}

export function getRiskBg(score: number): string {
  if (score >= 80) return 'bg-risk-high';
  if (score >= 60) return 'bg-risk-medium';
  if (score >= 30) return 'bg-brand-500';
  return 'bg-risk-low';
}

export function getRiskLabel(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function searchProperties(query: string): Property[] {
  if (!query.trim()) return properties;
  const q = query.toLowerCase();
  return properties.filter(
    (p) =>
      p.address.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.zip.includes(q),
  );
}
