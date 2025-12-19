# QR 근태관리 시스템 아키텍처 문서

## 시스템 개요

이 시스템은 QR 코드 기반의 직원 근태 관리 솔루션으로, 다음과 같은 구성 요소로 이루어져 있습니다:

```
┌─────────────────────────────────────────────────────────────┐
│                       전체 시스템 구조                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  모바일 앱    │         │ 태블릿 웹앱   │         │  관리자 웹    │
│ (React Native)│         │  (React)     │         │   (React)    │
│              │         │              │         │              │
│ - QR 생성    │         │ - QR 스캔    │         │ - 대시보드    │
│ - 위치 추적  │         │ - 출퇴근 처리│         │ - 통계       │
│ - 기록 조회  │         │ - 위치 검증  │         │ - 직원 관리  │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                │
                                │ REST API
                                │
                    ┌───────────▼───────────┐
                    │   백엔드 서버           │
                    │   (NestJS)            │
                    │                       │
                    │ - JWT 인증            │
                    │ - QR 검증             │
                    │ - 위치 검증           │
                    │ - HMAC 서명           │
                    │ - 비즈니스 로직       │
                    └───────────┬───────────┘
                                │
                                │ Prisma ORM
                                │
                    ┌───────────▼───────────┐
                    │   데이터베이스          │
                    │   (PostgreSQL)        │
                    │                       │
                    │ - 사용자 정보         │
                    │ - 근태 기록           │
                    │ - 시스템 설정         │
                    └───────────────────────┘
```

---

## 기술 스택

### 프론트엔드

#### 모바일 앱
- **프레임워크**: React Native + Expo
- **언어**: TypeScript
- **주요 라이브러리**:
  - `expo-location`: GPS 위치 추적
  - `react-native-qrcode-svg`: QR 코드 생성
  - `axios`: API 통신
  - `expo-secure-store`: 토큰 보안 저장
  - `@react-native-async-storage`: 로컬 데이터 저장

#### 웹 애플리케이션 (태블릿 & 관리자)
- **프레임워크**: React 18
- **빌드 도구**: Vite
- **언어**: TypeScript
- **스타일링**: TailwindCSS
- **주요 라이브러리**:
  - `@zxing/library`: QR 코드 스캔 (태블릿)
  - `@tanstack/react-query`: 데이터 페칭 (관리자)
  - `recharts`: 차트 및 통계 (관리자)
  - `framer-motion`: 애니메이션 (태블릿)
  - `zustand`: 상태 관리 (관리자)
  - `date-fns`: 날짜 처리

### 백엔드

- **프레임워크**: NestJS 10
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma 5
- **인증**: JWT + Passport
- **주요 라이브러리**:
  - `@nestjs/jwt`: JWT 토큰 관리
  - `@nestjs/passport`: 인증 전략
  - `bcrypt`: 비밀번호 해싱
  - `class-validator`: 요청 검증
  - `crypto` (Node.js): HMAC 서명

---

## 데이터베이스 스키마

### ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────┐
│           User                  │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ email: String (Unique)          │
│ password: String (Hashed)       │
│ name: String                    │
│ employeeNumber: String (Unique) │
│ department: String?             │
│ position: String?               │
│ phoneNumber: String?            │
│ role: UserRole                  │
│ isActive: Boolean               │
│ createdAt: DateTime             │
│ updatedAt: DateTime             │
└────────────┬────────────────────┘
             │
             │ 1:N
             │
┌────────────▼────────────────────┐
│    AttendanceRecord             │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ userId: UUID (FK)               │
│ checkInTime: DateTime           │
│ checkOutTime: DateTime?         │
│ checkInLatitude: Float          │
│ checkInLongitude: Float         │
│ checkInAccuracy: Float          │
│ checkOutLatitude: Float?        │
│ checkOutLongitude: Float?       │
│ checkOutAccuracy: Float?        │
│ status: AttendanceStatus        │
│ notes: String?                  │
│ createdAt: DateTime             │
│ updatedAt: DateTime             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│       SystemConfig              │
├─────────────────────────────────┤
│ id: UUID (PK)                   │
│ key: String (Unique)            │
│ value: String                   │
│ description: String?            │
│ createdAt: DateTime             │
│ updatedAt: DateTime             │
└─────────────────────────────────┘
```

---

## API 엔드포인트

### 인증 (Auth)

```
POST /api/auth/login
- 로그인
- Body: { email, password }
- Response: { accessToken, user }

POST /api/auth/validate
- 토큰 검증
- Body: { token }
- Response: { valid, user }
```

### 사용자 (Users)

```
GET /api/users
- 전체 사용자 조회 (관리자)
- Headers: Authorization: Bearer {token}
- Response: User[]

GET /api/users/:id
- 특정 사용자 조회
- Headers: Authorization: Bearer {token}
- Response: User

POST /api/users
- 사용자 생성 (관리자)
- Headers: Authorization: Bearer {token}
- Body: { email, password, name, ... }
- Response: User

PUT /api/users/:id
- 사용자 수정
- Headers: Authorization: Bearer {token}
- Body: { name, department, ... }
- Response: User

DELETE /api/users/:id
- 사용자 삭제 (관리자)
- Headers: Authorization: Bearer {token}
- Response: { success }
```

### 근태 (Attendance)

```
POST /api/attendance/check-in
- 출근 처리
- Body: {
    qrCodeData: string,
    tabletLatitude: number,
    tabletLongitude: number,
    tabletAccuracy: number
  }
- Response: {
    success: boolean,
    message: string,
    record: AttendanceRecord,
    distance: number
  }

POST /api/attendance/check-out
- 퇴근 처리
- Body: (check-in과 동일)
- Response: (check-in과 동일)

POST /api/attendance/generate-qr
- QR 코드 생성 (모바일 앱용)
- Headers: Authorization: Bearer {token}
- Body: {
    latitude: number,
    longitude: number,
    accuracy: number
  }
- Response: QRCodePayload {
    employeeId: string,
    timestamp: number,
    latitude: number,
    longitude: number,
    accuracy: number,
    signature: string (HMAC)
  }

GET /api/attendance/my-records
- 내 근태 기록 조회
- Headers: Authorization: Bearer {token}
- Query: ?startDate=...&endDate=...
- Response: AttendanceRecord[]

GET /api/attendance/records
- 전체 근태 기록 조회 (관리자)
- Headers: Authorization: Bearer {token}
- Query: ?startDate=...&endDate=...
- Response: AttendanceRecord[]

GET /api/attendance/stats/today
- 오늘의 통계
- Headers: Authorization: Bearer {token}
- Response: {
    totalEmployees: number,
    presentToday: number,
    absentToday: number,
    currentlyPresent: number,
    checkedOut: number
  }

GET /api/attendance/location/company
- 회사 위치 정보
- Response: {
    latitude: number,
    longitude: number,
    allowedRadius: number,
    requiredAccuracy: number
  }
```

---

## 보안 메커니즘

### 1. QR 코드 보안

#### QR 코드 구조
```json
{
  "employeeId": "uuid-string",
  "timestamp": 1234567890000,
  "latitude": 37.5666805,
  "longitude": 126.9784147,
  "accuracy": 15.5,
  "signature": "hmac-sha256-hash"
}
```

#### HMAC 서명 생성
```typescript
// 서명 대상 데이터
const payload = `${employeeId}|${timestamp}|${latitude}|${longitude}|${accuracy}`;

// HMAC-SHA256 서명
const signature = crypto
  .createHmac('sha256', HMAC_SECRET)
  .update(payload)
  .digest('hex');
```

#### 검증 프로세스
1. **서명 검증**: HMAC 서명 일치 여부 확인
2. **만료 시간 검증**: 30초 이내 QR 코드만 유효
3. **타임스탬프 검증**: 미래 시간 QR 코드 거부

### 2. 위치 검증

#### Haversine 공식 (거리 계산)
```typescript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 미터 단위
}
```

#### 검증 단계
1. **GPS 정확도**: 50m 이내 요구
2. **직원 위치**: 회사로부터 150m 이내
3. **태블릿 위치**: 회사로부터 150m 이내
4. **직원-태블릿 거리**: 50m 이내 (원격 스캔 방지)

### 3. JWT 인증

#### 토큰 구조
```json
{
  "email": "user@company.com",
  "sub": "user-uuid",
  "role": "EMPLOYEE",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### 인증 플로우
```
1. 사용자 로그인
   ↓
2. 비밀번호 bcrypt 검증
   ↓
3. JWT 토큰 발급 (7일 유효)
   ↓
4. 클라이언트에 저장 (SecureStore/LocalStorage)
   ↓
5. 이후 요청 시 Authorization 헤더에 포함
   ↓
6. 서버에서 JWT 검증
```

### 4. 중복 방지

- **5분 룰**: 최근 5분 이내 출근 기록 차단
- **당일 체크아웃**: 하루 한 번만 퇴근 가능
- **데이터베이스 인덱스**: `userId + checkInTime`으로 빠른 조회

---

## 워크플로우

### 출근 프로세스

```
[직원 스마트폰]
    │
    ├─ 1. 앱 실행 및 로그인
    ├─ 2. GPS 위치 획득 (고정밀도)
    ├─ 3. QR 코드 생성 요청 (POST /attendance/generate-qr)
    │     └─ 서버에서 HMAC 서명 생성
    ├─ 4. QR 코드 화면에 표시 (30초 갱신)
    │
    ▼
[출입구 태블릿]
    │
    ├─ 5. 카메라로 QR 스캔
    ├─ 6. 태블릿의 GPS 위치 획득
    ├─ 7. 출근 처리 요청 (POST /attendance/check-in)
    │     ├─ qrCodeData
    │     ├─ tabletLatitude
    │     ├─ tabletLongitude
    │     └─ tabletAccuracy
    │
    ▼
[백엔드 서버]
    │
    ├─ 8. QR 코드 검증
    │     ├─ JSON 파싱
    │     ├─ HMAC 서명 검증
    │     └─ 만료 시간 검증 (30초)
    │
    ├─ 9. 직원 정보 조회
    │     └─ 활성 계정 확인
    │
    ├─10. GPS 정확도 검증
    │     ├─ 직원 GPS 정확도 < 50m
    │     └─ 태블릿 GPS 정확도 < 50m
    │
    ├─11. 위치 검증
    │     ├─ 직원 위치 < 150m (회사로부터)
    │     ├─ 태블릿 위치 < 150m (회사로부터)
    │     └─ 직원-태블릿 거리 < 50m
    │
    ├─12. 중복 체크인 방지
    │     └─ 최근 5분 이내 기록 확인
    │
    ├─13. 데이터베이스 기록
    │     └─ AttendanceRecord 생성
    │
    ▼
[태블릿 화면]
    │
    └─14. 성공/실패 메시지 표시
          ├─ 직원 이름
          ├─ 출근 시간
          └─ 거리 정보
```

---

## 성능 최적화

### 백엔드
- **데이터베이스 인덱스**: `userId`, `checkInTime`
- **쿼리 최적화**: Prisma의 `select`로 필요한 필드만 조회
- **비동기 처리**: async/await 패턴

### 프론트엔드
- **React Query**: 자동 캐싱, 재시도, 갱신
- **코드 분할**: Vite의 lazy loading
- **이미지 최적화**: SVG 사용 (QR 코드)

### 모바일
- **위치 캐싱**: 불필요한 GPS 재요청 방지
- **QR 재생성 최적화**: 30초 타이머로 제어
- **메모리 관리**: useEffect cleanup

---

## 확장성 고려사항

### 수평 확장 (Scale Out)
- **백엔드**: 로드 밸런서 + 여러 인스턴스
- **데이터베이스**: 읽기 복제본 (Read Replica)
- **캐싱**: Redis 도입 (세션, 통계)

### 다중 사업장 지원
```typescript
// 데이터베이스 스키마 확장
model Location {
  id        String   @id @default(uuid())
  name      String
  latitude  Float
  longitude Float
  radius    Float
  
  attendanceRecords AttendanceRecord[]
}

model AttendanceRecord {
  // ... 기존 필드
  locationId String
  location   Location @relation(fields: [locationId], references: [id])
}
```

### 실시간 알림
- **WebSocket**: Socket.io 통합
- **푸시 알림**: FCM (Firebase Cloud Messaging)
- **이메일**: Nodemailer + SMTP

---

## 모니터링 및 로깅

### 권장 도구
- **애플리케이션 모니터링**: Sentry
- **로그 수집**: Winston + Elasticsearch
- **성능 모니터링**: New Relic / Datadog
- **데이터베이스 모니터링**: Prisma Pulse

### 로깅 전략
```typescript
// 중요 이벤트 로깅
logger.info('출근 성공', {
  userId,
  timestamp,
  location: { latitude, longitude },
  distance,
});

logger.warn('위치 검증 실패', {
  userId,
  distance,
  allowedRadius,
});

logger.error('QR 코드 검증 실패', {
  reason: 'expired',
  qrTimestamp,
  currentTime,
});
```

---

## 향후 개발 로드맵

### Phase 1 (현재)
✅ QR 기반 출퇴근  
✅ 위치 검증  
✅ 관리자 대시보드  
✅ 실시간 통계

### Phase 2 (단기)
- [ ] 얼굴 인식 추가 인증
- [ ] 이메일/SMS 알림
- [ ] 근무 시간 통계 및 리포트
- [ ] 엑셀 내보내기

### Phase 3 (중기)
- [ ] 휴가/출장 관리
- [ ] 다중 사업장 지원
- [ ] 모바일 웹 PWA
- [ ] 급여 연동 API

### Phase 4 (장기)
- [ ] 라즈베리파이 NFC 리더기
- [ ] IoT 센서 통합 (온도, 습도)
- [ ] AI 이상 탐지 (부정 출퇴근)
- [ ] 블록체인 기록 보관

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024-12-18

