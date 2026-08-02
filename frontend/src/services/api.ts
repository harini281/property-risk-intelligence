import type { GeocodingApiResponse, PropertyRiskApiResponse } from '../types/risk';
import { supabase } from '../lib/supabase';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PUBLIC_PATHS = new Set(['/api/health']);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');

  if (!PUBLIC_PATHS.has(path)) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
    throw new Error('Your session has expired. Please sign in again.');
  }

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
