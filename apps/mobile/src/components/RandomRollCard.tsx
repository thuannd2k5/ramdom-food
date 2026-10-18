import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Food } from '../types';

const { width } = Dimensions.get('window');

interface RandomRollCardProps {
  currentFood: Food | null;
  isRolling: boolean;
  isFavorited: boolean;
  onRoll: () => void;
  onFindPlaces: () => void;
  onToggleFavorite: () => void;
  onAcceptFood: () => void;
}

export function RandomRollCard({
  currentFood,
  isRolling,
  isFavorited,
  onRoll,
  onFindPlaces,
  onToggleFavorite,
  onAcceptFood,
}: RandomRollCardProps) {
  const [accepted, setAccepted] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRolling) {
      setAccepted(false);
      // Hiệu ứng nhịp đập & rung lắc khi quay
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.96,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRolling]);

  const handleAccept = () => {
    setAccepted(true);
    onAcceptFood();
  };

  return (
    <View style={styles.container}>
      {/* Thẻ hiển thị món ăn chính */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {isRolling ? (
          <View style={styles.rollingPlaceholder}>
            <Text style={styles.diceEmoji}>🎲</Text>
            <Text style={styles.rollingTitle}>Đang xáo trộn món ngon...</Text>
            <Text style={styles.rollingSubtitle}>
              Xúc xắc ẩm thực đang chọn món tốt nhất cho bạn!
            </Text>
            <ActivityIndicator
              size="large"
              color="#FF6B35"
              style={{ marginTop: 16 }}
            />
          </View>
        ) : currentFood ? (
          <>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: currentFood.imageUrl }}
                style={styles.foodImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={[
                  styles.favoriteBtn,
                  isFavorited && styles.favoriteBtnActive,
                ]}
                onPress={onToggleFavorite}
                activeOpacity={0.8}
              >
                <Text style={styles.favoriteIcon}>
                  {isFavorited ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>

              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>
                  {currentFood.priceMin?.toLocaleString()}đ -{' '}
                  {currentFood.priceMax?.toLocaleString()}đ
                </Text>
              </View>
            </View>

            <View style={styles.detailsContent}>
              <Text style={styles.foodName}>{currentFood.name}</Text>
              <Text style={styles.foodDesc} numberOfLines={2}>
                {currentFood.description ||
                  'Món ăn thơm ngon, hấp dẫn và tròn vị cho bữa ăn của bạn!'}
              </Text>

              {/* Tags nhãn đặc tính */}
              <View style={styles.tagList}>
                {currentFood.tags?.map((t) => (
                  <View key={t} style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>#{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.rollingPlaceholder}>
            <Text style={styles.diceEmoji}>🍲</Text>
            <Text style={styles.rollingTitle}>Bạn chưa biết ăn gì?</Text>
            <Text style={styles.rollingSubtitle}>
              Bấm nút "QUAY MÓN NGAY" bên dưới để nhận gợi ý ngẫu nhiên nhé!
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Thông báo chúc mừng khi chốt món */}
      {accepted && (
        <View style={styles.acceptedBanner}>
          <Text style={styles.acceptedText}>
            🎉 Tuyệt vời! Chúc bạn có một bữa ăn thật ngon miệng!
          </Text>
        </View>
      )}

      {/* Các nút bấm hành động */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.rollMainBtn, isRolling && styles.btnDisabled]}
          onPress={onRoll}
          disabled={isRolling}
          activeOpacity={0.85}
        >
          <Text style={styles.rollMainBtnText}>
            {isRolling ? 'Đang quay...' : '🎲 QUAY MÓN KHÁC'}
          </Text>
        </TouchableOpacity>

        {currentFood && !isRolling && (
          <View style={styles.secondaryBtnRow}>
            <TouchableOpacity
              style={styles.findPlacesBtn}
              onPress={onFindPlaces}
              activeOpacity={0.8}
            >
              <Text style={styles.findPlacesBtnText}>📍 Quán gần tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.acceptBtn, accepted && styles.acceptBtnDone]}
              onPress={handleAccept}
              disabled={accepted}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptBtnText}>
                {accepted ? '✅ Đã chốt' : '🎯 Chốt món này'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  favoriteBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  favoriteIcon: {
    fontSize: 20,
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceTagText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  detailsContent: {
    padding: 16,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  foodDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  rollingPlaceholder: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  diceEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  rollingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  rollingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  acceptedBanner: {
    marginTop: 12,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  acceptedText: {
    color: '#15803D',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    marginTop: 16,
    gap: 10,
  },
  rollMainBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  rollMainBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  findPlacesBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  findPlacesBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptBtnDone: {
    backgroundColor: '#94A3B8',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
