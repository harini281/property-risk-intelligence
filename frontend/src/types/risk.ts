export interface PropertyRiskApiResponse {
  latitude: number;
  longitude: number;
  overallRiskLevel: string;
  generatedAt: string;
  weather: {
    temperatureCelsius: number | null;
    humidityPercent: number | null;
    windSpeedKph: number | null;
    condition: string | null;
    location: string | null;
    success: boolean;
    message: string | null;
  };
  flood: {
    floodRiskLevel: string | null;
    floodZone: string | null;
    activeWarnings: string[] | null;
    success: boolean;
    message: string | null;
  };
  airQuality: {
    aqi: number | null;
    dominantPollutant: string | null;
    healthCategory: string | null;
    success: boolean;
    message: string | null;
  };
}

export interface GeocodingApiResponse {
  displayName: string | null;
  latitude: number | null;
  longitude: number | null;
  success: boolean;
  message: string | null;
}
