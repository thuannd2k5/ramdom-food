import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Category, Food, NearbyPlace, User } from '../types';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.3:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function saveAuthToken(token: string) {
  if (Platform.OS !== 'web') {
    await SecureStore.setItemAsync('access_token', token);
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS !== 'web') {
    return SecureStore.getItemAsync('access_token');
  }
  return null;
}

export async function removeAuthToken() {
  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync('access_token');
  }
}

// Request Interceptor: Tự động gán JWT Bearer Token
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Lỗi đọc auth token:', err);
  }
  return config;
});

// API calls

export async function fetchHealthStatus() {
  const res = await apiClient.get('/health');
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.get('/categories');
  return res.data?.data || [];
}

export async function fetchRandomFood(params?: {
  mealType?: string;
  maxPrice?: number;
  tag?: string;
  excludeIds?: string;
}): Promise<Food> {
  const res = await apiClient.get('/foods/random', { params });
  return res.data?.data;
}

export async function fetchNearbyPlaces(params: {
  lat: number;
  lng: number;
  foodName: string;
  radius?: number;
}): Promise<{ directGoogleSearchUrl: string; places: NearbyPlace[] }> {
  const res = await apiClient.get('/places/nearby', { params });
  return res.data?.data;
}

export async function apiLogin(email: string, password: string): Promise<{ user: User; accessToken: string }> {
  const res = await apiClient.post('/auth/login', { email, password });
  const data = res.data?.data;
  if (data?.accessToken) {
    await saveAuthToken(data.accessToken);
  }
  return data;
}

export async function apiRegister(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: User; accessToken: string }> {
  const res = await apiClient.post('/auth/register', { email, password, fullName });
  const data = res.data?.data;
  if (data?.accessToken) {
    await saveAuthToken(data.accessToken);
  }
  return data;
}

export async function apiGetProfile(): Promise<User | null> {
  try {
    const res = await apiClient.get('/users/me');
    return res.data?.data || null;
  } catch {
    return null;
  }
}

export async function apiGetFavorites(): Promise<Food[]> {
  const res = await apiClient.get('/users/favorites');
  return res.data?.data || [];
}

export async function apiToggleFavorite(foodId: string): Promise<{ isFavorited: boolean; message: string }> {
  const res = await apiClient.post(`/users/favorites/${foodId}`);
  return res.data?.data;
}
