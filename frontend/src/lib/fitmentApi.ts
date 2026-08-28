export interface Fitment {
  id: number;
  partNumber: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  trim: string | null;
  engine: string | null;
  driveType: string | null;
  bodyType: string | null;
  isActive: boolean;
}

export interface FitmentSearchResult {
  items: Fitment[];
  total: number;
  page: number;
  pageSize: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export interface FitmentSearchQuery {
  make?: string;
  model?: string;
  year?: number;
  partNumber?: string;
  page?: number;
  pageSize?: number;
}

export async function searchFitments(query: FitmentSearchQuery): Promise<FitmentSearchResult> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });

  const res = await fetch(`${API_BASE_URL}/fitments?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch fitments: ${res.status}`);
  }
  return res.json();
}
