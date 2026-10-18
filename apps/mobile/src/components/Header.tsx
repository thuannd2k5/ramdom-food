import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onPressProfile: () => void;
}

export function Header({ user, onPressProfile }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Chào buổi sáng ☀️';
    if (hour < 14) return 'Đến giờ ăn trưa rồi 🍱';
    if (hour < 18) return 'Giải lao xế chiều 🧋';
    return 'Tối nay ăn gì đây 🌙';
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subtext}>
          {user ? `Xin chào, ${user.fullName}!` : 'Chế độ khách (Chưa đăng nhập)'}
        </Text>
      </View>

      <TouchableOpacity style={styles.profileBtn} onPress={onPressProfile} activeOpacity={0.8}>
        <Text style={styles.profileEmoji}>{user ? '👤' : '🔑'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtext: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileEmoji: {
    fontSize: 20,
  },
});
