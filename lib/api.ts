import type {
  StaffMember,
  StaffSearchResult,
  VerifyResponse,
  NominationPayload,
  NominationResponse,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }

  return data as T;
}

export function getMaleStaff(): Promise<StaffMember[]> {
  return request('/api/staff/male');
}

export function getFemaleStaff(): Promise<StaffMember[]> {
  return request('/api/staff/female');
}

export function getAllStaff(): Promise<StaffMember[]> {
  return request('/api/staff/all');
}

export function verifyStaff(name: string): Promise<VerifyResponse> {
  return request('/api/verify', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export function searchStaff(query: string, signal?: AbortSignal): Promise<StaffSearchResult[]> {
  return request(`/api/verify/search?q=${encodeURIComponent(query)}`, { signal });
}

export function checkNominator(nominatorId: number): Promise<{ hasNominated: boolean }> {
  return request(`/api/nominations/check/${nominatorId}`);
}

export function submitNomination(payload: NominationPayload): Promise<NominationResponse> {
  return request('/api/nominate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
