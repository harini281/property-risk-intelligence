import type { GeocodingApiResponse, PropertyRiskApiResponse } from '../types/risk';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getHealthStatus() {
  return request<{ status: string; service: string }>('/api/health');
}

export async function getPropertyRisk(latitude: number, longitude: number) {
  const query = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });

  return request<PropertyRiskApiResponse>(`/api/property-risk?${query.toString()}`);
}

export async function geocodeAddress(address: string) {
  return request<GeocodingApiResponse>(`/api/geocode?${new URLSearchParams({ address }).toString()}`);
}

export async function getWeather(latitude: number, longitude: number) {
  const query = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) });
  return request<PropertyRiskApiResponse['weather']>(`/api/weather?${query.toString()}`);
}

export const backendBaseUrl = DEFAULT_BASE_URL;
