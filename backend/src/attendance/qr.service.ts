import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface QRCodePayload {
  employeeId: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  signature: string;
}

@Injectable()
export class QrService {
  private readonly hmacSecret: string;
  private readonly expirySeconds: number;

  constructor(private configService: ConfigService) {
    this.hmacSecret = this.configService.get<string>('HMAC_SECRET');
    this.expirySeconds = this.configService.get<number>('QR_CODE_EXPIRY_SECONDS', 30);
  }

  /**
   * QR 코드 생성을 위한 서명 생성
   */
  generateSignature(data: Omit<QRCodePayload, 'signature'>): string {
    const payload = `${data.employeeId}|${data.timestamp}|${data.latitude}|${data.longitude}|${data.accuracy}`;
    return crypto.createHmac('sha256', this.hmacSecret).update(payload).digest('hex');
  }

  /**
   * QR 코드 데이터 검증
   */
  verifyQRCode(qrData: string): QRCodePayload {
    let payload: QRCodePayload;

    try {
      payload = JSON.parse(qrData);
    } catch (error) {
      throw new UnauthorizedException('잘못된 QR 코드 형식입니다.');
    }

    // 필수 필드 확인
    if (
      !payload.employeeId ||
      !payload.timestamp ||
      payload.latitude === undefined ||
      payload.longitude === undefined ||
      !payload.signature
    ) {
      throw new UnauthorizedException('QR 코드 데이터가 불완전합니다.');
    }

    // 만료 시간 확인
    const now = Date.now();
    const ageSeconds = (now - payload.timestamp) / 1000;
    
    if (ageSeconds > this.expirySeconds) {
      throw new UnauthorizedException(
        `QR 코드가 만료되었습니다. (${Math.floor(ageSeconds)}초 경과)`
      );
    }

    if (ageSeconds < -5) {
      // 시간이 미래인 경우 (5초 여유)
      throw new UnauthorizedException('QR 코드 타임스탬프가 올바르지 않습니다.');
    }

    // 서명 검증
    const expectedSignature = this.generateSignature({
      employeeId: payload.employeeId,
      timestamp: payload.timestamp,
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy,
    });

    if (payload.signature !== expectedSignature) {
      throw new UnauthorizedException('QR 코드 서명이 유효하지 않습니다.');
    }

    return payload;
  }

  /**
   * QR 코드 생성용 페이로드 생성 (클라이언트에서 사용할 데이터 구조)
   */
  createPayload(
    employeeId: string,
    latitude: number,
    longitude: number,
    accuracy: number,
  ): QRCodePayload {
    const timestamp = Date.now();
    const signature = this.generateSignature({
      employeeId,
      timestamp,
      latitude,
      longitude,
      accuracy,
    });

    return {
      employeeId,
      timestamp,
      latitude,
      longitude,
      accuracy,
      signature,
    };
  }
}

