// 공유 타입 정의 - 모든 프로젝트에서 사용

export interface Employee {
  id: string;
  email: string;
  name: string;
  employeeNumber: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRCodePayload {
  employeeId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  signature: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  checkInLatitude: number;
  checkInLongitude: number;
  checkInAccuracy: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  checkOutAccuracy?: number;
  status: AttendanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendanceStatus {
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  LATE = 'LATE',
  EARLY_LEAVE = 'EARLY_LEAVE',
  ABSENT = 'ABSENT',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
}

export interface LocationConfig {
  companyLatitude: number;
  companyLongitude: number;
  allowedRadius: number; // 미터 단위 (기본값: 150)
  requiredAccuracy: number; // 미터 단위 (기본값: 50)
}

export interface AttendanceCheckRequest {
  qrCodeData: string;
  tabletLatitude: number;
  tabletLongitude: number;
  tabletAccuracy: number;
}

export interface AttendanceCheckResponse {
  success: boolean;
  message: string;
  record?: AttendanceRecord;
  employee?: {
    name: string;
    employeeNumber: string;
    department?: string;
  };
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onBreak: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

// 위치 계산 유틸리티 함수
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위 거리
}

// QR 코드 검증
export function isQRCodeExpired(timestamp: number, maxAgeSeconds: number = 30): boolean {
  const now = Date.now();
  const age = (now - timestamp) / 1000;
  return age > maxAgeSeconds;
}

