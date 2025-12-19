import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface QRScannerProps {
  mode: 'checkIn' | 'checkOut';
  onScanComplete: (result: any) => void;
}

function QRScanner({ mode, onScanComplete }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    getLocation();
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (location && !scanning) {
      startScanning();
    }
  }, [location]);

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          setError('위치 정보를 가져올 수 없습니다: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
    }
  };

  const startScanning = async () => {
    if (!videoRef.current || !location) return;

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScan(result.getText());
          }
          if (error && !(error.name === 'NotFoundException')) {
            console.error('Scan error:', error);
          }
        }
      );

      setScanning(true);
      setError('');
    } catch (err: any) {
      setError('카메라에 접근할 수 없습니다: ' + err.message);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setScanning(false);
  };

  const handleScan = async (qrData: string) => {
    if (!location) {
      setError('위치 정보가 없습니다.');
      return;
    }

    // 스캔 일시 중지
    stopScanning();

    try {
      const endpoint = mode === 'checkIn' ? '/attendance/check-in' : '/attendance/check-out';
      
      const response = await axios.post(`${API_URL}${endpoint}`, {
        qrCodeData: qrData,
        tabletLatitude: location.latitude,
        tabletLongitude: location.longitude,
        tabletAccuracy: location.accuracy,
      });

      onScanComplete(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '처리 중 오류가 발생했습니다.';
      onScanComplete({
        success: false,
        message: errorMessage,
      });
    }

    // 3초 후 다시 스캔 시작
    setTimeout(() => {
      if (location) {
        startScanning();
      }
    }, 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-96 bg-black rounded-lg object-cover"
          playsInline
        />
        
        {!scanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
              <p className="text-xl font-bold">카메라 초기화 중...</p>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 right-4">
          <div className={`px-4 py-2 rounded-lg text-white font-bold text-center ${
            mode === 'checkIn' ? 'bg-blue-600' : 'bg-red-600'
          }`}>
            {mode === 'checkIn' ? '출근 모드' : '퇴근 모드'}
          </div>
        </div>

        {scanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-4 border-green-500 rounded-lg w-64 h-64 animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-bold">⚠️ 오류</p>
          <p>{error}</p>
        </div>
      )}

      {location && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-bold">📍 태블릿 위치:</span>
            <br />
            위도: {location.latitude.toFixed(6)}, 
            경도: {location.longitude.toFixed(6)}
            <br />
            정확도: {location.accuracy.toFixed(0)}m
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-lg">
          {scanning ? '📱 QR 코드를 카메라에 비춰주세요' : '⏳ 준비 중...'}
        </p>
      </div>
    </div>
  );
}

export default QRScanner;

