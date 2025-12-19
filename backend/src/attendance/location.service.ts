import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocationService {
  private readonly companyLatitude: number;
  private readonly companyLongitude: number;
  private readonly allowedRadius: number;
  private readonly requiredAccuracy: number;

  constructor(private configService: ConfigService) {
    this.companyLatitude = parseFloat(
      this.configService.get<string>('COMPANY_LATITUDE', '37.5666805')
    );
    this.companyLongitude = parseFloat(
      this.configService.get<string>('COMPANY_LONGITUDE', '126.9784147')
    );
    this.allowedRadius = parseFloat(
      this.configService.get<string>('ALLOWED_RADIUS', '150')
    );
    this.requiredAccuracy = parseFloat(
      this.configService.get<string>('REQUIRED_ACCURACY', '50')
    );
  }

  /**
   * Haversine 공식을 사용한 두 GPS 좌표 간 거리 계산 (미터)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
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

    return R * c;
  }

  /**
   * GPS 정확도 검증
   */
  validateAccuracy(accuracy: number): void {
    if (accuracy > this.requiredAccuracy) {
      throw new BadRequestException(
        `GPS 정확도가 충분하지 않습니다. (현재: ${accuracy.toFixed(0)}m, 필요: ${this.requiredAccuracy}m 이하)`
      );
    }
  }

  /**
   * 위치가 회사 반경 내에 있는지 확인
   */
  validateLocation(latitude: number, longitude: number): {
    isValid: boolean;
    distance: number;
    message: string;
  } {
    const distance = this.calculateDistance(
      this.companyLatitude,
      this.companyLongitude,
      latitude,
      longitude,
    );

    const isValid = distance <= this.allowedRadius;

    return {
      isValid,
      distance: Math.round(distance),
      message: isValid
        ? `위치 확인 성공 (회사로부터 ${Math.round(distance)}m)`
        : `회사 위치에서 너무 멀리 떨어져 있습니다. (${Math.round(distance)}m, 허용: ${this.allowedRadius}m)`,
    };
  }

  /**
   * 직원의 QR 생성 위치와 태블릿 스캔 위치 간 거리 확인
   */
  validateQRLocation(
    qrLatitude: number,
    qrLongitude: number,
    tabletLatitude: number,
    tabletLongitude: number,
  ): { isValid: boolean; distance: number; message: string } {
    // 1. 직원의 QR 위치가 회사 반경 내에 있는지 확인
    const employeeLocationCheck = this.validateLocation(qrLatitude, qrLongitude);
    
    if (!employeeLocationCheck.isValid) {
      return {
        isValid: false,
        distance: employeeLocationCheck.distance,
        message: `직원 위치 오류: ${employeeLocationCheck.message}`,
      };
    }

    // 2. 태블릿 위치가 회사 반경 내에 있는지 확인
    const tabletLocationCheck = this.validateLocation(tabletLatitude, tabletLongitude);
    
    if (!tabletLocationCheck.isValid) {
      return {
        isValid: false,
        distance: tabletLocationCheck.distance,
        message: `태블릿 위치 오류: ${tabletLocationCheck.message}`,
      };
    }

    // 3. 직원과 태블릿 간 거리 확인 (너무 멀면 안됨)
    const distanceBetween = this.calculateDistance(
      qrLatitude,
      qrLongitude,
      tabletLatitude,
      tabletLongitude,
    );

    // 직원과 태블릿이 50m 이상 떨어져 있으면 거부 (원격 스캔 방지)
    if (distanceBetween > 50) {
      return {
        isValid: false,
        distance: Math.round(distanceBetween),
        message: `직원과 태블릿 간 거리가 너무 멉니다. (${Math.round(distanceBetween)}m)`,
      };
    }

    return {
      isValid: true,
      distance: Math.round(distanceBetween),
      message: '위치 검증 성공',
    };
  }

  getCompanyLocation() {
    return {
      latitude: this.companyLatitude,
      longitude: this.companyLongitude,
      allowedRadius: this.allowedRadius,
      requiredAccuracy: this.requiredAccuracy,
    };
  }
}

