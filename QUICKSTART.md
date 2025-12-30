# 🚀 빠른 시작 가이드

5분 안에 QR 근태관리 시스템을 실행해보세요!

---

## 📋 사전 준비

시작하기 전에 다음이 설치되어 있는지 확인하세요:
- ✅ **Node.js 18-20 LTS** ⚠️ ([다운로드](https://nodejs.org/))
  - **중요**: v21+ (특히 v24)는 호환되지 않습니다!
  - 버전 확인: `node --version`
- ✅ PostgreSQL 14+ ([다운로드](https://www.postgresql.org/))

### 🪟 Windows 사용자 주의사항

**1. Node.js 버전 확인**
```powershell
node --version
# v20.x.x 여야 함 (v18-v20 권장)
# v21 이상이면 v20 LTS로 다운그레이드!
```

**2. 회사 네트워크 SSL 인증서 문제**
```powershell
# npm install 실패 시 (개발 환경만)
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
```

---

## ⚡ 1단계: 데이터베이스 생성 (1분)

```bash
# PostgreSQL 실행 후
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE qr_attendance;

# 종료
\q
```

---

## ⚡ 2단계: 백엔드 실행 (2분)

```powershell
# 1. 백엔드 폴더로 이동
cd backend

# 2. 패키지 설치 (Windows 회사 네트워크)
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm install --legacy-peer-deps

# 3. 환경 변수 파일 생성 (수동)
# backend\.env 파일을 생성하고 아래 내용 복사:
```

**.env 파일 내용** (PostgreSQL 비밀번호 수정 필수!):
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/qr_attendance?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-12345"
JWT_EXPIRES_IN="7d"
HMAC_SECRET="your-super-secret-hmac-key-change-this-in-production-67890"
PORT=3000
NODE_ENV=development
COMPANY_LATITUDE=37.5666805
COMPANY_LONGITUDE=126.9784147
ALLOWED_RADIUS=150
REQUIRED_ACCURACY=50
QR_CODE_EXPIRY_SECONDS=30
DUPLICATE_CHECKIN_PREVENTION_MINUTES=5
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

```powershell
# 4. Prisma 설정
npx prisma generate
npx prisma migrate dev --name init

# 5. 테스트 데이터 생성
npm run prisma:seed

# 6. 서버 실행
npm run start:dev
```

✅ 서버가 `http://localhost:3000/api`에서 실행됩니다!

**테스트 계정:**
- 관리자: `admin@company.com` / `admin123`
- 직원: `kim@company.com` / `password123`
- 직원: `park@company.com` / `password123`

---

## ⚡ 3단계: 웹 애플리케이션 실행 (2분)

### 관리자 대시보드 (새 터미널)
```powershell
cd web-admin
npm install
npm run dev
```
👉 **http://localhost:3002** 접속  
📧 로그인: `admin@company.com` / `admin123`

### 태블릿 QR 스캔 (새 터미널)
```powershell
cd web-tablet
npm install
npm run dev
```
👉 **http://localhost:3003** 접속 (포트 3001/3002가 사용 중이면 자동으로 3003)  
📱 QR 코드 스캐너가 자동 실행됩니다!

---

## 🎉 완료! 이제 테스트해보세요

### 1️⃣ 관리자 로그인
1. `http://localhost:3002` 접속
2. `admin@company.com` / `admin123` 입력
3. 실시간 대시보드 확인!

### 2️⃣ 모바일 앱 실행 방법

#### 🌐 옵션 1: 웹 브라우저 (가장 빠름!)
```powershell
cd mobile
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm install expo-linking --legacy-peer-deps
npx expo start --web
```
👉 **http://localhost:8081** 자동 실행  
📧 로그인: `kim@company.com` / `password123`

#### 📱 옵션 2: 실제 스마트폰 (권장!)
```powershell
cd mobile
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm install expo-linking --legacy-peer-deps
npx expo start --lan
```
1. 스마트폰에서 **Expo Go** 앱 설치 ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. 터미널의 QR 코드를 Expo Go 앱으로 스캔
3. 앱이 폰에 로드됩니다! 🎉

> ⚠️ **Windows 주의**: `--tunnel` 모드는 회사 방화벽에서 차단될 수 있습니다.  
> `--lan` (같은 Wi-Fi) 또는 `--web` (브라우저) 모드를 사용하세요!

---

## 🔧 문제 해결

### 1. Node.js 버전 호환성 에러
```
Error: ENOENT: no such file or directory, mkdir '...node:sea'
```
**원인**: Node.js v21+ (특히 v24)가 Expo SDK 50과 호환되지 않음  
**해결**: Node.js v20.x LTS로 다운그레이드
```powershell
# 버전 확인
node --version

# NVM 사용 시
nvm install 20
nvm use 20
```

### 2. npm install SSL 인증서 에러
```
reason: self-signed certificate in certificate chain
```
**원인**: 회사 네트워크 방화벽  
**해결**: 임시로 SSL 검증 비활성화 (개발 환경만)
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm install --legacy-peer-deps
```

### 3. 데이터베이스 연결 실패
```
Error: P1000: Authentication failed
```
**원인**: `.env` 파일의 PostgreSQL 비밀번호 오류  
**해결**: `.env` 파일 확인 및 수정
```env
DATABASE_URL="postgresql://postgres:실제비밀번호@localhost:5432/qr_attendance?schema=public"
```

### 4. 포트가 이미 사용 중
```powershell
# Windows에서 포트 확인
netstat -ano | findstr :3000

# 프로세스 종료 (관리자 권한)
taskkill /PID [프로세스ID] /F
```

### 5. Expo 모바일 앱 에러
```
Unable to resolve "expo-linking"
```
**해결**:
```powershell
npm install expo-linking --legacy-peer-deps
```

### 6. Prisma 마이그레이션 오류
```powershell
# 캐시 삭제 후 재시도
npx prisma generate --force
npx prisma migrate reset
```

---

## 📚 다음 단계

- 📖 [전체 설치 가이드](SETUP_GUIDE.md)
- 🏗️ [아키텍처 문서](ARCHITECTURE.md)
- 🚢 [배포 가이드](DEPLOYMENT.md)
- 📘 [API 문서](backend/README.md)

---

## 🆘 도움이 필요하신가요?

1. 로그 확인하기
2. [문제 해결 가이드](SETUP_GUIDE.md#문제-해결) 읽기
3. GitHub Issues에 질문하기

**즐거운 개발 되세요! 💪**

