import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { api } from '../services/api';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [qrData, setQrData] = useState<string>('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    requestLocationPermission();
  }, [isAuthenticated]);

  useEffect(() => {
    if (location && countdown === 30) {
      generateQRCode();
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generateQRCode();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location, countdown]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 오류', '위치 권한이 필요합니다.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (error) {
      Alert.alert('오류', '위치 정보를 가져올 수 없습니다.');
    }
  };

  const generateQRCode = async () => {
    if (!location || !user) return;

    setLoading(true);
    try {
      const response = await api.post('/attendance/generate-qr', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 50,
      });

      setQrData(JSON.stringify(response.data));
      setCountdown(30);
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.message || 'QR 코드 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
      await generateQRCode();
    } catch (error) {
      Alert.alert('오류', '위치 갱신 실패');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>환영합니다, {user?.name}님</Text>
        <Text style={styles.subText}>
          {user?.department} · {user?.position}
        </Text>
      </View>

      <View style={styles.qrContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : qrData ? (
          <>
            <QRCode value={qrData} size={250} />
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                {countdown}초 후 갱신
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.noQrText}>QR 코드 생성 중...</Text>
        )}
      </View>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            📍 위도: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            📍 경도: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            🎯 정확도: {location.coords.accuracy?.toFixed(0)}m
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={refreshLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>🔄 위치 갱신</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.historyButton]}
          onPress={() => router.push('/history')}
        >
          <Text style={styles.buttonText}>📋 근태 기록</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ 사용 방법</Text>
        <Text style={styles.infoText}>
          1. QR 코드는 30초마다 자동 갱신됩니다{'\n'}
          2. 출입구 태블릿에 QR 코드를 스캔하세요{'\n'}
          3. 회사 반경 150m 이내에서만 사용 가능합니다
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 5,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 320,
  },
  noQrText: {
    fontSize: 16,
    color: '#6b7280',
  },
  countdownContainer: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  countdownText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  refreshButton: {
    backgroundColor: '#10b981',
  },
  historyButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },
});

