import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Food } from '../types';

interface FavoritesViewProps {
  favorites: Food[];
  loading: boolean;
  onSelectFood: (food: Food) => void;
  onRemoveFavorite: (foodId: string) => void;
  onFindPlaces: (foodName: string) => void;
}

export function FavoritesView({
  favorites,
  loading,
  onSelectFood,
  onRemoveFavorite,
  onFindPlaces,
}: FavoritesViewProps) {
  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Đang tải danh sách món yêu thích...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyEmoji}>❤️</Text>
        <Text style={styles.emptyTitle}>Chưa có món ăn yêu thích nào</Text>
        <Text style={styles.emptySubtitle}>
          Khi quay trúng món ngon, hãy bấm icon trái tim để lưu lại nhé!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              {item.priceMin?.toLocaleString()}đ - {item.priceMax?.toLocaleString()}đ
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.findBtn}
                onPress={() => onFindPlaces(item.name)}
              >
                <Text style={styles.findBtnText}>Tìm quán 📍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onRemoveFavorite(item._id)}
              >
                <Text style={styles.removeBtnText}>Bỏ lưu ✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B35',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  findBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  findBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  removeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});
