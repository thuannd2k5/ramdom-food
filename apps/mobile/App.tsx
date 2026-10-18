import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { fetchHealthStatus, API_BASE_URL } from './src/services/api';

const queryClient = new QueryClient();

function HealthCheckScreen() {
  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealthStatus,
    retry: 1,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Text style={styles.appEmoji}>🍲🎲</Text>
        <Text style={styles.title}>Random Food App</Text>
        <Text style={styles.subtitle}>
          Hôm nay ăn gì? Hãy để AI và xúc xắc quyết định!
        </Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Kết nối Backend Server:</Text>
          <Text style={styles.apiUrlText}>{API_BASE_URL}</Text>

          {isLoading || isFetching ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#FF6B35" />
              <Text style={styles.loadingText}>Đang kiểm tra kết nối...</Text>
            </View>
          ) : error ? (
            <View style={[styles.badge, styles.badgeError]}>
              <Text style={styles.badgeErrorText}>
                ❌ Chưa kết nối được ({error instanceof Error ? error.message : 'Lỗi mạng'})
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeSuccessText}>
                ✅ Đã kết nối NestJS & MongoDB Atlas!
              </Text>
              <Text style={styles.dbText}>
                Database: {data?.data?.database || 'OK'} | Uptime: {Math.round(data?.data?.uptime || 0)}s
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => refetch()}
          disabled={isFetching}
        >
          <Text style={styles.buttonText}>
            {isFetching ? 'Đang thử lại...' : 'Kiểm tra lại kết nối'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HealthCheckScreen />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  appEmoji: {
    fontSize: 54,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#F1F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  apiUrlText: {
    fontSize: 11,
    color: '#868E96',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#495057',
  },
  badge: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgeSuccess: {
    backgroundColor: '#D3F9D8',
  },
  badgeSuccessText: {
    color: '#2B8A3E',
    fontWeight: '700',
    fontSize: 13,
  },
  dbText: {
    fontSize: 11,
    color: '#2B8A3E',
    marginTop: 4,
  },
  badgeError: {
    backgroundColor: '#FFE3E3',
  },
  badgeErrorText: {
    color: '#C92A2A',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
