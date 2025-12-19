import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QrService } from './qr.service';
import { LocationService } from './location.service';
import { AttendanceStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AttendanceService {
  private readonly duplicatePreventionMinutes: number;

  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
    private locationService: LocationService,
    private configService: ConfigService,
  ) {
    this.duplicatePreventionMinutes = this.configService.get<number>(
      'DUPLICATE_CHECKIN_PREVENTION_MINUTES',
      5,
    );
  }

  /**
   * QR 코드 스캔으로 출근 처리
   */
  async checkIn(
    qrCodeData: string,
    tabletLatitude: number,
    tabletLongitude: number,
    tabletAccuracy: number,
  ) {
    // 1. QR 코드 검증 (서명, 만료시간)
    const qrPayload = this.qrService.verifyQRCode(qrCodeData);

    // 2. 직원 확인
    const user = await this.prisma.user.findUnique({
      where: { id: qrPayload.employeeId },
    });

    if (!user) {
      throw new NotFoundException('직원 정보를 찾을 수 없습니다.');
    }

    if (!user.isActive) {
      throw new BadRequestException('비활성화된 계정입니다.');
    }

    // 3. GPS 정확도 검증
    this.locationService.validateAccuracy(qrPayload.accuracy);
    this.locationService.validateAccuracy(tabletAccuracy);

    // 4. 위치 검증 (직원 위치와 태블릿 위치 모두 확인)
    const locationCheck = this.locationService.validateQRLocation(
      qrPayload.latitude,
      qrPayload.longitude,
      tabletLatitude,
      tabletLongitude,
    );

    if (!locationCheck.isValid) {
      throw new BadRequestException(locationCheck.message);
    }

    // 5. 중복 체크인 방지 (최근 5분 이내 기록 확인)
    const recentCheckIn = await this.prisma.attendanceRecord.findFirst({
      where: {
        userId: user.id,
        checkInTime: {
          gte: new Date(Date.now() - this.duplicatePreventionMinutes * 60 * 1000),
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    if (recentCheckIn) {
      throw new BadRequestException(
        `이미 출근 처리되었습니다. (${recentCheckIn.checkInTime.toLocaleTimeString('ko-KR')})`,
      );
    }

    // 6. 출근 기록 생성
    const record = await this.prisma.attendanceRecord.create({
      data: {
        userId: user.id,
        checkInTime: new Date(),
        checkInLatitude: qrPayload.latitude,
        checkInLongitude: qrPayload.longitude,
        checkInAccuracy: qrPayload.accuracy,
        status: AttendanceStatus.CHECKED_IN,
      },
      include: {
        user: {
          select: {
            name: true,
            employeeNumber: true,
            department: true,
            position: true,
          },
        },
      },
    });

    return {
      success: true,
      message: `${user.name}님 출근 처리되었습니다. ${locationCheck.message}`,
      record,
      distance: locationCheck.distance,
    };
  }

  /**
   * QR 코드 스캔으로 퇴근 처리
   */
  async checkOut(
    qrCodeData: string,
    tabletLatitude: number,
    tabletLongitude: number,
    tabletAccuracy: number,
  ) {
    // 1. QR 코드 검증
    const qrPayload = this.qrService.verifyQRCode(qrCodeData);

    // 2. 직원 확인
    const user = await this.prisma.user.findUnique({
      where: { id: qrPayload.employeeId },
    });

    if (!user) {
      throw new NotFoundException('직원 정보를 찾을 수 없습니다.');
    }

    // 3. GPS 정확도 검증
    this.locationService.validateAccuracy(qrPayload.accuracy);
    this.locationService.validateAccuracy(tabletAccuracy);

    // 4. 위치 검증
    const locationCheck = this.locationService.validateQRLocation(
      qrPayload.latitude,
      qrPayload.longitude,
      tabletLatitude,
      tabletLongitude,
    );

    if (!locationCheck.isValid) {
      throw new BadRequestException(locationCheck.message);
    }

    // 5. 오늘 출근 기록 찾기 (퇴근하지 않은 기록)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInRecord = await this.prisma.attendanceRecord.findFirst({
      where: {
        userId: user.id,
        checkInTime: {
          gte: today,
        },
        checkOutTime: null,
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    if (!checkInRecord) {
      throw new BadRequestException('출근 기록이 없습니다. 먼저 출근 처리를 해주세요.');
    }

    // 6. 퇴근 처리
    const record = await this.prisma.attendanceRecord.update({
      where: { id: checkInRecord.id },
      data: {
        checkOutTime: new Date(),
        checkOutLatitude: qrPayload.latitude,
        checkOutLongitude: qrPayload.longitude,
        checkOutAccuracy: qrPayload.accuracy,
        status: AttendanceStatus.CHECKED_OUT,
      },
      include: {
        user: {
          select: {
            name: true,
            employeeNumber: true,
            department: true,
            position: true,
          },
        },
      },
    });

    return {
      success: true,
      message: `${user.name}님 퇴근 처리되었습니다. ${locationCheck.message}`,
      record,
      distance: locationCheck.distance,
    };
  }

  /**
   * 특정 직원의 근태 기록 조회
   */
  async getRecordsByUserId(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.checkInTime = {};
      if (startDate) where.checkInTime.gte = startDate;
      if (endDate) where.checkInTime.lte = endDate;
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            employeeNumber: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });
  }

  /**
   * 전체 근태 기록 조회 (관리자용)
   */
  async getAllRecords(startDate?: Date, endDate?: Date) {
    const where: any = {};

    if (startDate || endDate) {
      where.checkInTime = {};
      if (startDate) where.checkInTime.gte = startDate;
      if (endDate) where.checkInTime.lte = endDate;
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            employeeNumber: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });
  }

  /**
   * 오늘의 통계
   */
  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await this.prisma.user.count({
      where: { isActive: true, role: 'EMPLOYEE' },
    });

    const todayRecords = await this.prisma.attendanceRecord.findMany({
      where: {
        checkInTime: {
          gte: today,
        },
      },
      include: {
        user: true,
      },
    });

    const presentToday = todayRecords.filter(
      (r) => r.status === AttendanceStatus.CHECKED_IN || r.status === AttendanceStatus.CHECKED_OUT,
    ).length;

    const checkedOut = todayRecords.filter(
      (r) => r.status === AttendanceStatus.CHECKED_OUT,
    ).length;

    const currentlyPresent = presentToday - checkedOut;

    return {
      totalEmployees,
      presentToday,
      absentToday: totalEmployees - presentToday,
      currentlyPresent,
      checkedOut,
    };
  }

  /**
   * QR 코드 생성을 위한 HMAC 키 제공 엔드포인트
   */
  async generateQRPayload(
    userId: string,
    latitude: number,
    longitude: number,
    accuracy: number,
  ) {
    return this.qrService.createPayload(userId, latitude, longitude, accuracy);
  }
}

