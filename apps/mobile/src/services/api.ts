import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Lấy URL từ biến môi trường hoặc fallback về IP Wi-Fi dev máy tính
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.3:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor tự động gắn Bearer Token nếu người dùng đã đăng nhập
apiClient.interceptors.request.use(async (config) => {
  try {
    if (Platform.OS !== 'web') {
      const token = await SecureStore.getItemAsync('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn('Lỗi khi đọc access_token từ SecureStore:', err);
  }
  return config;
});

// Hàm kiểm tra kết nối tới Backend
export async function fetchHealthStatus() {
  const response = await apiClient.get('/health');
  return response.data;
}
