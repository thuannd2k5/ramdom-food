import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from 'react-native';
import * as Location from 'expo-location';
import { fetchNearbyPlaces } from '../services/api';
import { NearbyPlace } from '../types';

interface NearbyModalProps {
  visible: boolean;
  foodName: string;
  onClose: () => void;
}

export function NearbyModal({ visible, foodName, onClose }: NearbyModalProps) {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [directSearchUrl, setDirectSearchUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (visible && foodName) {
      loadNearbyRestaurants();
    }
  }, [visible, foodName]);

  const loadNearbyRestaurants = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      let lat = 21.028511; // Mặc định Hà Nội nếu không có quyền GPS
      let lng = 105.854444;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      } else {
        setErrorMsg('Chưa cấp quyền GPS, ứng dụng sẽ dùng vị trí ước lượng.');
      }

      const res = await fetchNearbyPlaces({
        lat,
        lng,
        foodName,
        radius: 4000,
      });

      setPlaces(res.places || []);
      setDirectSearchUrl(res.directGoogleSearchUrl);
    } catch (err: any) {
      console.warn('Lỗi tải quán ăn lân cận:', err);
      setErrorMsg('Không thể tải danh sách quán lúc này.');
    } finally {
      setLoading(false);
    }
  };

  const openMaps = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.warn('Không thể mở Google Maps:', err),
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Quán gần bạn 📍</Text>
            <Text style={styles.subTitle}>Món: {foodName}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errorMsg}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>
              Đang dò tìm các quán xung quanh tọa độ của bạn...
            </Text>
          </View>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyText}>
                  Chưa tìm thấy quán nào trong bán kính gần.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.placeCard}>
                <View style={styles.placeInfo}>
                  <Text style={styles.placeName}>{item.name}</Text>
                  <Text style={styles.placeAddress}>{item.address}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.distanceBadge}>
                      📍 {item.distanceText}
                    </Text>
                    <Text style={styles.ratingBadge}>⭐ {item.rating}</Text>
                    <Text style={styles.priceBadge}>💰 {item.priceLevel}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.navigateBtn}
                  onPress={() => openMaps(item.googleMapsUrl)}
                >
                  <Text style={styles.navigateBtnText}>Chỉ đường</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.googleMapsBtn}
            onPress={() => openMaps(directSearchUrl)}
          >
            <Text style={styles.googleMapsBtnText}>
              🗺️ Mở tìm kiếm toàn diện trên Google Maps
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  errorBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorBannerText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  placeInfo: {
    flex: 1,
    paddingRight: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priceBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  navigateBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navigateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  googleMapsBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  googleMapsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
