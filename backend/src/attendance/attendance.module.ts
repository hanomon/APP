import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { QrService } from './qr.service';
import { LocationService } from './location.service';

@Module({
  providers: [AttendanceService, QrService, LocationService],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}

