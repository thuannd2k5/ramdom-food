import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface FilterBarProps {
  selectedMeal: string;
  onSelectMeal: (meal: string) => void;
  selectedPrice: number | undefined;
  onSelectPrice: (price: number | undefined) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const MEAL_OPTIONS = [
  { label: 'Tất cả bữa', value: '' },
  { label: 'Bữa sáng 🍳', value: 'breakfast' },
  { label: 'Bữa trưa 🍱', value: 'lunch' },
  { label: 'Bữa tối 🍲', value: 'dinner' },
  { label: 'Ăn vặt 🧋', value: 'snack' },
];

const PRICE_OPTIONS = [
  { label: 'Mọi giá', value: undefined },
  { label: '≤ 35.000đ 💰', value: 35000 },
  { label: '≤ 50.000đ 💳', value: 50000 },
  { label: '≤ 65.000đ ⭐', value: 65000 },
];

const TAG_OPTIONS = [
  { label: 'Mọi vị', value: '' },
  { label: 'Không cay 🥗', value: 'non_spicy' },
  { label: 'Cay tê 🌶️', value: 'spicy' },
  { label: 'Món nước 🍜', value: 'soup' },
  { label: 'Món khô 🍚', value: 'dry' },
  { label: 'Dân VP mê 💼', value: 'office_favorite' },
];

export function FilterBar({
  selectedMeal,
  onSelectMeal,
  selectedPrice,
  onSelectPrice,
  selectedTag,
  onSelectTag,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      {/* Hàng 1: Bữa ăn */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MEAL_OPTIONS.map((item) => {
          const isSelected = selectedMeal === item.value;
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onSelectMeal(item.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Hàng 2: Giá & Tag */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { marginTop: 6 }]}
      >
        {PRICE_OPTIONS.map((item) => {
          const isSelected = selectedPrice === item.value;
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.subChip, isSelected && styles.subChipActive]}
              onPress={() => onSelectPrice(item.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subChipText,
                  isSelected && styles.subChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {TAG_OPTIONS.map((item) => {
          const isSelected = selectedTag === item.value;
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.subChip, isSelected && styles.subChipActive]}
              onPress={() => onSelectTag(item.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subChipText,
                  isSelected && styles.subChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  subChipActive: {
    backgroundColor: '#334155',
  },
  subChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  subChipTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginHorizontal: 4,
  },
});
