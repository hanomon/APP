import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class CheckInOutDto {
  qrCodeData: string;
  tabletLatitude: number;
  tabletLongitude: number;
  tabletAccuracy: number;
}

class GenerateQRDto {
  latitude: number;
  longitude: number;
  accuracy: number;
}

@Controller('attendance')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private locationService: LocationService,
  ) {}

  /**
   * 출근 처리
   */
  @Post('check-in')
  async checkIn(@Body() dto: CheckInOutDto) {
    return this.attendanceService.checkIn(
      dto.qrCodeData,
      dto.tabletLatitude,
      dto.tabletLongitude,
      dto.tabletAccuracy,
    );
  }

  /**
   * 퇴근 처리
   */
  @Post('check-out')
  async checkOut(@Body() dto: CheckInOutDto) {
    return this.attendanceService.checkOut(
      dto.qrCodeData,
      dto.tabletLatitude,
      dto.tabletLongitude,
      dto.tabletAccuracy,
    );
  }

  /**
   * QR 코드 생성용 페이로드 받기 (모바일 앱용)
   */
  @UseGuards(JwtAuthGuard)
  @Post('generate-qr')
  async generateQR(@Request() req, @Body() dto: GenerateQRDto) {
    return this.attendanceService.generateQRPayload(
      req.user.userId,
      dto.latitude,
      dto.longitude,
      dto.accuracy,
    );
  }

  /**
   * 내 근태 기록 조회
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-records')
  async getMyRecords(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getRecordsByUserId(
      req.user.userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * 전체 근태 기록 조회 (관리자용)
   */
  @UseGuards(JwtAuthGuard)
  @Get('records')
  async getAllRecords(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAllRecords(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * 오늘의 통계
   */
  @UseGuards(JwtAuthGuard)
  @Get('stats/today')
  async getTodayStats() {
    return this.attendanceService.getTodayStats();
  }

  /**
   * 회사 위치 정보 가져오기
   */
  @Get('location/company')
  getCompanyLocation() {
    return this.locationService.getCompanyLocation();
  }
}

