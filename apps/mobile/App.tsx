import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Header } from './src/components/Header';
import { FilterBar } from './src/components/FilterBar';
import { RandomRollCard } from './src/components/RandomRollCard';
import { NearbyModal } from './src/components/NearbyModal';
import { AuthModal } from './src/components/AuthModal';
import { FavoritesView } from './src/components/FavoritesView';
import {
  fetchRandomFood,
  apiGetFavorites,
  apiToggleFavorite,
  apiGetProfile,
} from './src/services/api';
import { Food, User } from './src/types';

const queryClient = new QueryClient();

function MainContent() {
  const qc = useQueryClient();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'roll' | 'favorites'>('roll');

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  // Filters state
  const [selectedMeal, setSelectedMeal] = useState<string>('lunch');
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Roll state
  const [currentFood, setCurrentFood] = useState<Food | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [nearbyModalVisible, setNearbyModalVisible] = useState(false);

  // Lấy profile nếu đã có token
  useEffect(() => {
    apiGetProfile().then((userData) => {
      if (userData) setUser(userData);
    });
  }, []);

  // Lấy danh sách favorites
  const { data: favorites = [], isLoading: loadingFavorites, refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: apiGetFavorites,
    enabled: !!user,
  });

  // Tải món đầu tiên khi mở app
  useEffect(() => {
    handleRollFood();
  }, [selectedMeal, selectedPrice, selectedTag]);

  // Logic quay món ngẫu nhiên
  const handleRollFood = async () => {
    setIsRolling(true);

    try {
      // Giả lập thời gian xáo trộn slot 700ms tạo cảm giác hồi hộp
      const [food] = await Promise.all([
        fetchRandomFood({
          mealType: selectedMeal || undefined,
          maxPrice: selectedPrice,
          tag: selectedTag || undefined,
          excludeIds: currentFood?._id,
        }),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      setCurrentFood(food);
    } catch (err: any) {
      console.warn('Lỗi khi quay món:', err);
      // Nếu bộ lọc quá khắt khe, thử nới lỏng
      try {
        const fallback = await fetchRandomFood();
        setCurrentFood(fallback);
      } catch {
        Alert.alert(
          'Lưu ý',
          'Không tìm thấy món ăn phù hợp với bộ lọc hiện tại. Vui lòng chọn lại bộ lọc!',
        );
      }
    } finally {
      setIsRolling(false);
    }
  };

  // Logic Bookmark yêu thích
  const isFavorited = Boolean(
    currentFood && favorites.some((f) => f._id === currentFood._id),
  );

  const toggleFavoriteMutation = useMutation({
    mutationFn: (foodId: string) => apiToggleFavorite(foodId),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
      Alert.alert('Yêu thích', res.message);
    },
    onError: () => {
      Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để lưu danh sách món yêu thích!', [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => setAuthModalVisible(true) },
      ]);
    },
  });

  const handleToggleFavorite = () => {
    if (!currentFood) return;
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để lưu danh sách món yêu thích!', [
        { text: 'Để sau', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => setAuthModalVisible(true) },
      ]);
      return;
    }
    toggleFavoriteMutation.mutate(currentFood._id);
  };

  const handleRemoveFavorite = (foodId: string) => {
    toggleFavoriteMutation.mutate(foodId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <Header
        user={user}
        onPressProfile={() => setAuthModalVisible(true)}
      />

      {currentTab === 'roll' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollBody}
        >
          {/* Bộ lọc nhanh */}
          <FilterBar
            selectedMeal={selectedMeal}
            onSelectMeal={setSelectedMeal}
            selectedPrice={selectedPrice}
            onSelectPrice={setSelectedPrice}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />

          {/* Thẻ Quay Món Lõi */}
          <RandomRollCard
            currentFood={currentFood}
            isRolling={isRolling}
            isFavorited={isFavorited}
            onRoll={handleRollFood}
            onFindPlaces={() => setNearbyModalVisible(true)}
            onToggleFavorite={handleToggleFavorite}
            onAcceptFood={() => {}}
          />
        </ScrollView>
      ) : (
        <FavoritesView
          favorites={favorites}
          loading={loadingFavorites}
          onSelectFood={(f) => {
            setCurrentFood(f);
            setCurrentTab('roll');
          }}
          onRemoveFavorite={handleRemoveFavorite}
          onFindPlaces={(foodName) => {
            if (currentFood) {
              setNearbyModalVisible(true);
            }
          }}
        />
      )}

      {/* Thanh điều hướng dưới cùng (Bottom Navigation Bar) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, currentTab === 'roll' && styles.navItemActive]}
          onPress={() => setCurrentTab('roll')}
        >
          <Text style={styles.navIcon}>🎲</Text>
          <Text
            style={[
              styles.navText,
              currentTab === 'roll' && styles.navTextActive,
            ]}
          >
            Quay món
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navItem,
            currentTab === 'favorites' && styles.navItemActive,
          ]}
          onPress={() => {
            if (!user) {
              Alert.alert(
                'Yêu cầu đăng nhập',
                'Hãy đăng nhập để đồng bộ và xem các món ăn yêu thích của bạn!',
                [
                  { text: 'Để sau', style: 'cancel' },
                  { text: 'Đăng nhập', onPress: () => setAuthModalVisible(true) },
                ],
              );
            }
            setCurrentTab('favorites');
          }}
        >
          <Text style={styles.navIcon}>❤️</Text>
          <Text
            style={[
              styles.navText,
              currentTab === 'favorites' && styles.navTextActive,
            ]}
          >
            Yêu thích ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal tìm quán theo GPS */}
      <NearbyModal
        visible={nearbyModalVisible}
        foodName={currentFood?.name || ''}
        onClose={() => setNearbyModalVisible(false)}
      />

      {/* Modal Đăng nhập / Đăng ký */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={(u) => {
          setUser(u);
          refetchFavorites();
        }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContent />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollBody: {
    paddingBottom: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#FFF7ED',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  navTextActive: {
    color: '#FF6B35',
    fontWeight: '700',
  },
});
