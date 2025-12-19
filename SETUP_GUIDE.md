# QR 근태관리 시스템 설치 가이드

## 목차
1. [사전 요구사항](#사전-요구사항)
2. [백엔드 설정](#백엔드-설정)
3. [데이터베이스 설정](#데이터베이스-설정)
4. [모바일 앱 설정](#모바일-앱-설정)
5. [웹 애플리케이션 설정](#웹-애플리케이션-설정)
6. [실행 방법](#실행-방법)
7. [문제 해결](#문제-해결)

---

## 사전 요구사항

### 필수 소프트웨어
- **Node.js** 18 이상 ([다운로드](https://nodejs.org/))
- **PostgreSQL** 14 이상 ([다운로드](https://www.postgresql.org/download/))
- **Git** ([다운로드](https://git-scm.com/))

### 모바일 개발용 (선택)
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go 앱** (iOS/Android 테스트용)

### 개발 도구
- **Cursor IDE** (권장) 또는 VS Code
- **Postman** 또는 Thunder Client (API 테스트용)

---

## 백엔드 설정

### 1. PostgreSQL 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE qr_attendance;

# 사용자 생성 (선택)
CREATE USER qr_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE qr_attendance TO qr_admin;

# 종료
\q
```

### 2. 환경 변수 설정

```bash
cd backend
copy .env.example .env
```

`.env` 파일을 열어 다음 내용을 수정하세요:

```env
# 데이터베이스 연결
DATABASE_URL="postgresql://postgres:password@localhost:5432/qr_attendance?schema=public"

# JWT 시크릿 (반드시 변경!)
JWT_SECRET="super-secret-jwt-key-change-this-in-production-12345"
JWT_EXPIRES_IN="7d"

# HMAC 시크릿 (QR 코드 서명용, 반드시 변경!)
HMAC_SECRET="super-secret-hmac-key-change-this-in-production-67890"

# 서버 설정
PORT=3000
NODE_ENV=development

# 회사 위치 설정 (Google Maps에서 좌표 확인)
COMPANY_LATITUDE=37.5666805
COMPANY_LONGITUDE=126.9784147
ALLOWED_RADIUS=150
REQUIRED_ACCURACY=50

# QR 코드 설정
QR_CODE_EXPIRY_SECONDS=30
DUPLICATE_CHECKIN_PREVENTION_MINUTES=5

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

### 3. 백엔드 설치 및 초기화

```bash
cd backend
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init

# 초기 데이터 생성 (테스트 계정 포함)
npm run prisma:seed
```

### 4. 백엔드 실행

```bash
npm run start:dev
```

서버가 `http://localhost:3000/api`에서 실행됩니다.

**테스트 계정:**
- 관리자: `admin@company.com` / `admin123`
- 직원: `kim@company.com` / `employee123`

---

## 모바일 앱 설정

### 1. 의존성 설치

```bash
cd mobile
npm install
```

### 2. API URL 설정

`mobile/services/api.ts` 파일을 열어 API URL을 수정하세요:

```typescript
// 개발 환경에 따라 선택
const API_URL = 'http://localhost:3000/api';        // iOS 시뮬레이터
// const API_URL = 'http://10.0.2.2:3000/api';       // Android 에뮬레이터
// const API_URL = 'http://192.168.0.10:3000/api';   // 실제 기기 (내 IP 주소)
```

**내 IP 주소 확인 방법:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

### 3. 모바일 앱 실행

```bash
npx expo start
```

이후 다음 중 선택:
- `i`: iOS 시뮬레이터
- `a`: Android 에뮬레이터
- QR 코드 스캔: Expo Go 앱으로 실제 기기에서 실행

---

## 웹 애플리케이션 설정

### 태블릿 웹앱 (QR 스캔)

```bash
cd web-tablet
npm install
npm run dev
```

브라우저에서 `http://localhost:3001` 접속

**참고:** 카메라 사용을 위해 HTTPS 또는 localhost가 필요합니다.

### 관리자 대시보드

```bash
cd web-admin
npm install
npm run dev
```

브라우저에서 `http://localhost:3002` 접속

---

## 실행 방법

### 전체 시스템 실행 순서

1. **백엔드 실행** (터미널 1)
```bash
cd backend
npm run start:dev
```

2. **태블릿 웹앱 실행** (터미널 2)
```bash
cd web-tablet
npm run dev
```

3. **관리자 웹 실행** (터미널 3)
```bash
cd web-admin
npm run dev
```

4. **모바일 앱 실행** (터미널 4)
```bash
cd mobile
npx expo start
```

### 워크스페이스 스크립트 사용

루트 폴더에서:

```bash
# 모든 패키지 설치
npm run install:all

# 개별 실행
npm run dev:backend
npm run dev:tablet
npm run dev:admin
npm run dev:mobile
```

---

## 테스트 시나리오

### 1. 관리자 로그인
1. `http://localhost:3002` 접속
2. `admin@company.com` / `admin123`로 로그인
3. 대시보드에서 실시간 통계 확인

### 2. 직원 QR 생성 (모바일 앱)
1. 모바일 앱 실행
2. `kim@company.com` / `employee123`로 로그인
3. 위치 권한 허용
4. QR 코드 자동 생성 확인 (30초마다 갱신)

### 3. 출퇴근 처리 (태블릿)
1. `http://localhost:3001` 접속
2. "출근" 버튼 선택
3. 모바일 앱의 QR 코드를 카메라에 비춤
4. 성공 메시지 확인

### 4. 근태 기록 확인
1. 관리자 대시보드 접속
2. "근태 기록" 메뉴 클릭
3. 방금 처리한 출근 기록 확인

---

## 주요 기능 설명

### QR 코드 보안
- **HMAC-SHA256 서명**: 위변조 방지
- **30초 유효시간**: 재사용 방지
- **타임스탬프 검증**: 시간 조작 방지

### 위치 검증
- **GPS 정확도**: 50m 이내 요구
- **회사 반경**: 150m 이내에서만 승인
- **거리 계산**: Haversine 공식 사용
- **이중 검증**: 직원 위치 + 태블릿 위치 모두 확인

### 중복 방지
- **5분 룰**: 동일 직원이 5분 이내 재출근 불가
- **당일 체크아웃**: 하루에 한 번만 퇴근 가능

---

## 문제 해결

### 백엔드 연결 실패
```bash
# 포트 사용 확인
netstat -ano | findstr :3000

# 프로세스 종료 (Windows, 관리자 권한 필요)
taskkill /PID [프로세스ID] /F
```

### 데이터베이스 연결 오류
```bash
# PostgreSQL 서비스 확인 (Windows)
services.msc

# 수동 시작
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

### 모바일 앱 위치 권한 오류
- iOS: 설정 > 개인정보 보호 > 위치 서비스
- Android: 설정 > 앱 > Expo Go > 권한

### 카메라 작동 안함 (태블릿 웹앱)
- HTTPS 사용 또는 localhost에서만 작동
- 브라우저 설정에서 카메라 권한 확인
- Chrome/Edge 권장 (Safari는 제한적)

### Prisma 마이그레이션 오류
```bash
# 마이그레이션 리셋 (주의: 모든 데이터 삭제)
npx prisma migrate reset

# 강제 마이그레이션
npx prisma migrate deploy
```

---

## 프로덕션 배포

### Vercel (웹앱)

**태블릿 웹앱:**
```bash
cd web-tablet
npm run build
vercel --prod
```

**관리자 웹:**
```bash
cd web-admin
npm run build
vercel --prod
```

### Railway (백엔드)

1. [Railway](https://railway.app/) 가입
2. New Project > Deploy from GitHub repo
3. 환경 변수 설정
4. PostgreSQL 플러그인 추가
5. 자동 배포

### Supabase (데이터베이스)

1. [Supabase](https://supabase.com/) 가입
2. New Project 생성
3. DATABASE_URL 복사
4. Prisma 마이그레이션:
```bash
npx prisma migrate deploy
```

### Expo EAS Build (모바일 앱)

```bash
cd mobile
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

---

## 보안 권장사항

### 프로덕션 배포 전 필수 변경사항

1. **환경 변수 변경**
   - `JWT_SECRET`: 최소 32자 랜덤 문자열
   - `HMAC_SECRET`: 최소 32자 랜덤 문자열
   - 데이터베이스 비밀번호 변경

2. **HTTPS 사용**
   - 모든 API 통신 HTTPS 필수
   - 카메라/위치 권한 HTTPS 필수

3. **CORS 설정**
   - 허용된 도메인만 명시
   - 와일드카드(*) 사용 금지

4. **Rate Limiting**
   - 로그인 시도 제한
   - API 요청 제한

5. **로깅 및 모니터링**
   - 출퇴근 기록 로그
   - 실패한 인증 시도 로그
   - 위치 이상 감지

---

## 추가 개발 아이디어

### 단기 확장
- [ ] 이메일/SMS 알림
- [ ] 직원별 근무 시간 통계
- [ ] 엑셀 내보내기
- [ ] 모바일 앱 푸시 알림

### 중기 확장
- [ ] 얼굴 인식 추가 인증
- [ ] 다중 사업장 지원
- [ ] 휴가/출장 관리
- [ ] 급여 연동

### 장기 확장
- [ ] 라즈베리파이 NFC 리더기
- [ ] IoT 센서 통합
- [ ] AI 이상 탐지
- [ ] 모바일 웹 PWA

---

## 지원 및 문의

문제가 발생하면 다음을 확인하세요:
1. 모든 서비스가 실행 중인지 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. 포트가 충돌하지 않는지 확인
4. 로그 파일 확인

**로그 확인:**
```bash
# 백엔드 로그
cd backend
npm run start:dev

# Prisma Studio (데이터베이스 GUI)
npx prisma studio
```

---

## 라이선스

MIT License - 자유롭게 사용 및 수정 가능합니다.

---

**즐거운 개발 되세요! 🚀**

