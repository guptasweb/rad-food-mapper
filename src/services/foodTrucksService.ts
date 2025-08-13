import axios, { AxiosInstance } from 'axios';

// Config & caching
const SODA_BASE = 'https://data.sfgov.org/resource/rqzj-sfat.json';
const DEFAULT_TTL_MS = 60_000; // 1 minute
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const APP_TOKEN = process.env.SFGOV_APP_TOKEN; // optional, but helps with rate limits

const responseCache = new Map<string, { data: any; ts: number }>();

// Build a stable cache key from URL and sorted params
function cacheKey(url: string, params: Record<string, unknown>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = params[k]!;
      return acc;
    }, {});
  return `${url}?${JSON.stringify(sorted)}`;
}

let sharedClient: AxiosInstance | null = null;
// Lazily create and reuse a single Socrata axios client
function getClient(): AxiosInstance {
  // In tests, always create a fresh client so jest mocks are picked up
  if (process.env.NODE_ENV === 'test') {
    const headers: Record<string, string> = {};
    if (APP_TOKEN) headers['X-App-Token'] = APP_TOKEN;
    return axios.create({ baseURL: SODA_BASE, headers, timeout: 10000 });
  }
  // Reuse a single client instance in non-test environments
  if (sharedClient && typeof (sharedClient as any).get === 'function') return sharedClient;
  const headers: Record<string, string> = {};
  if (APP_TOKEN) headers['X-App-Token'] = APP_TOKEN;
  sharedClient = axios.create({ baseURL: SODA_BASE, headers, timeout: 10000 });
  return sharedClient;
}

// Escape single quotes for safe embedding into Socrata $where strings
function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

// Case-insensitive LIKE condition helper (wraps with upper(...))
function likeInsensitive(field: string, value: string): string {
  return `upper(${field}) like upper('%${escapeSql(value)}%')`;
}

// Build a status filter clause or empty string for ALL/undefined
function buildStatusFilter(status?: string): string {
  const s = (status || '').toUpperCase();
  if (!s || s === 'ALL') return '';
  return `status = '${escapeSql(s)}' AND `;
}

// Clamp requested limit to a safe inclusive range
function clampLimit(limit: number): number {
  return Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, Number(limit) || MIN_LIMIT));
}

// Fetch trucks from Socrata with simple in-memory caching
async function fetchTrucks(params: {
  select?: string;
  where?: string;
  order?: string;
  limit?: number | string;
}) {
  const client = getClient();
  const $params: Record<string, string> = {};
  if (params.select) $params.$select = params.select;
  if (params.where) $params.$where = params.where;
  if (params.order) $params.$order = params.order;
  $params.$limit = String(clampLimit(Number(params.limit ?? 1000)));

  const key = cacheKey(SODA_BASE, $params);
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.ts < DEFAULT_TTL_MS) return cached.data as FoodTruck[];
  const response = await client.get<FoodTruck[]>('', { params: $params });
  responseCache.set(key, { data: response.data, ts: Date.now() });
  return response.data;
}

export type FoodTruck = {
  objectid?: string;
  applicant?: string;
  status?: string;
  address?: string;
  locationdescription?: string;
  fooditems?: string;
  latitude?: string;
  longitude?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  } | string;
  [key: string]: unknown;
};

// Normalize status to uppercase or return undefined
function normalizeStatus(status?: string): string | undefined {
  if (!status) return undefined;
  return status.toUpperCase();
}

// Search trucks by applicant name with optional status filter
export async function searchByApplicant(params: { name: string; status?: string }): Promise<FoodTruck[]> {
  const statusFilter = buildStatusFilter(params.status);
  const where = `${statusFilter}${likeInsensitive('applicant', params.name)}`;
  return fetchTrucks({ where, limit: 1000 });
}

// Search trucks by street fragment (address-only, case-insensitive)
export async function searchByStreet(params: { query: string }): Promise<FoodTruck[]> {
  const where = likeInsensitive('address', params.query);
  return fetchTrucks({ where, limit: 1000 });
}

type NearestParams = { lat: number; lng: number; limit: number; status?: string };
// Find trucks within the same integer degree band for lat/lng with optional status
export async function findNearest(params: NearestParams): Promise<FoodTruck[]> {
  const normalizedStatus = normalizeStatus(params.status) || 'APPROVED';
  const statusFilter = normalizedStatus === 'ALL' ? '' : `status = '${escapeSql(normalizedStatus)}' AND `;
  const limit = clampLimit(params.limit);

  // Geospatial degree band using within_box on the location field (1° box)
  const latTrunc = Math.trunc(params.lat);
  const lngTrunc = Math.trunc(params.lng);
  const latLower = params.lat >= 0 ? latTrunc : latTrunc - 1;
  const latUpper = params.lat >= 0 ? latTrunc + 1 : latTrunc;
  const lngLower = params.lng >= 0 ? lngTrunc : lngTrunc - 1;
  const lngUpper = params.lng >= 0 ? lngTrunc + 1 : lngTrunc;
  const where = `${statusFilter}within_box(location, ${latUpper}, ${lngLower}, ${latLower}, ${lngUpper})`;
  return fetchTrucks({ where, order: 'applicant ASC', limit });
}

