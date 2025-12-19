# QR코드 기반 직원 근태관리 시스템

## 프로젝트 구조

```
company/
├── backend/          # NestJS + Prisma + PostgreSQL
├── mobile/           # React Native (Expo) - 직원용 앱
├── web-tablet/       # React - 출입구 태블릿 QR 스캔
├── web-admin/        # React - 관리자 대시보드
└── shared/           # 공통 타입 및 유틸리티
```

## 시스템 아키텍처

```
[직원 스마트폰 앱 - React Native]
         ↓
  QR 코드 생성 (employee_id + GPS + 타임스탬프 + HMAC)
         ↓
[출입구 태블릿 웹앱 - React]
         ↓
  카메라 QR 스캔 + GPS 위치 검증
         ↓
[백엔드 API - NestJS + PostgreSQL]
         ↓
  출퇴근 기록 + 실시간 알림
         ↓
[관리자 대시보드 - React]
```

## 주요 기능

### 1. 모바일 앱 (직원용)
- GPS 기반 동적 QR 코드 생성 (30초 갱신)
- 실시간 위치 정보 포함
- HMAC-SHA256 서명으로 위변조 방지
- 출퇴근 이력 조회

### 2. 태블릿 웹앱 (출입구)
- HTML5 카메라로 QR 스캔
- 위치 기반 검증 (회사 반경 150m)
- 실시간 출퇴근 기록
- 시각적 피드백 (성공/실패 표시)

### 3. 관리자 대시보드
- 실시간 근태 현황 모니터링
- 일별/월별 통계
- 직원 관리
- 출퇴근 기록 조회 및 수정
- 위치 로그 확인

### 4. 보안 기능
- QR 코드 30초 유효시간
- HMAC-SHA256 서명 검증
- GPS 정확도 검증 (50m 이내)
- 거리 기반 위치 검증 (150m 반경)
- 중복 체크인 방지 (5분 이내)
- JWT 인증

## 기술 스택

### 프론트엔드
- **모바일**: React Native + Expo + TypeScript
- **웹**: React + TypeScript + Vite
- **상태관리**: React Query + Zustand
- **UI**: TailwindCSS + shadcn/ui

### 백엔드
- **프레임워크**: NestJS + TypeScript
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma
- **인증**: JWT + Passport
- **검증**: class-validator

### DevOps
- **초기 배포**: Vercel (웹) + Railway (백엔드) + Supabase (DB)
- **확장**: AWS/GCP

## 시작하기

### 사전 요구사항
- Node.js 18+
- PostgreSQL 14+
- Expo CLI (모바일 개발용)

### 설치 및 실행

#### 1. 백엔드
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

#### 2. 모바일 앱
```bash
cd mobile
npm install
npx expo start
```

#### 3. 태블릿 웹앱
```bash
cd web-tablet
npm install
npm run dev
```

#### 4. 관리자 웹
```bash
cd web-admin
npm install
npm run dev
```

## 환경 변수 설정

각 프로젝트의 `.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

## 개발 가이드

### QR 코드 포맷
```json
{
  "employeeId": "string",
  "timestamp": "number",
  "latitude": "number",
  "longitude": "number",
  "accuracy": "number",
  "signature": "string (HMAC-SHA256)"
}
```

### API 엔드포인트
- `POST /auth/login` - 로그인
- `POST /attendance/check-in` - 출근
- `POST /attendance/check-out` - 퇴근
- `GET /attendance/records` - 근태 기록 조회
- `GET /employees` - 직원 목록
- `GET /dashboard/stats` - 통계

## 라이선스
MIT

## 기여
Pull Request 환영합니다!

