# 배포 가이드

이 문서는 QR 근태관리 시스템을 프로덕션 환경에 배포하는 방법을 설명합니다.

---

## 목차
1. [배포 옵션](#배포-옵션)
2. [백엔드 배포 (Railway)](#백엔드-배포-railway)
3. [데이터베이스 배포 (Supabase)](#데이터베이스-배포-supabase)
4. [웹 배포 (Vercel)](#웹-배포-vercel)
5. [모바일 앱 배포 (Expo EAS)](#모바일-앱-배포-expo-eas)
6. [환경 변수 설정](#환경-변수-설정)
7. [도메인 및 SSL](#도메인-및-ssl)
8. [모니터링 및 유지보수](#모니터링-및-유지보수)

---

## 배포 옵션

### 권장 스택 (비용 효율적)

| 컴포넌트 | 플랫폼 | 월 비용 (추정) | 특징 |
|---------|--------|---------------|-----|
| 백엔드 | Railway | $5-20 | 자동 배포, 간편한 설정 |
| 데이터베이스 | Supabase | $0-25 | PostgreSQL, 500MB 무료 |
| 웹 (태블릿/관리자) | Vercel | $0 | Hobby 플랜 무료 |
| 모바일 앱 | Expo EAS | $0-29 | Build 서비스 |

**총 비용**: $5-74/월 (소규모 운영 시 $5-20/월 가능)

### 대안 스택 (고성능)

| 컴포넌트 | 플랫폼 | 월 비용 (추정) | 특징 |
|---------|--------|---------------|-----|
| 백엔드 | AWS EC2 | $10-50 | 완전한 제어 |
| 데이터베이스 | AWS RDS | $15-100 | 관리형 PostgreSQL |
| 웹 | AWS S3 + CloudFront | $1-10 | 정적 호스팅 |
| 모바일 앱 | App Store + Play Store | $99+$25/년 | 네이티브 앱 |

---

## 백엔드 배포 (Railway)

### 1. Railway 계정 생성
1. [Railway.app](https://railway.app/) 방문
2. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성
```bash
# 로컬에서 Railway CLI 설치
npm install -g @railway/cli

# Railway 로그인
railway login

# 프로젝트 초기화
cd backend
railway init
```

### 3. PostgreSQL 추가
1. Railway 대시보드에서 "New" 클릭
2. "Database" > "PostgreSQL" 선택
3. 자동으로 DATABASE_URL 환경 변수 생성됨

### 4. 환경 변수 설정
Railway 대시보드에서:
```env
DATABASE_URL=[자동생성됨]
JWT_SECRET=your-production-jwt-secret-min-32-characters
HMAC_SECRET=your-production-hmac-secret-min-32-characters
PORT=3000
NODE_ENV=production
COMPANY_LATITUDE=37.5666805
COMPANY_LONGITUDE=126.9784147
ALLOWED_RADIUS=150
REQUIRED_ACCURACY=50
QR_CODE_EXPIRY_SECONDS=30
DUPLICATE_CHECKIN_PREVENTION_MINUTES=5
CORS_ORIGIN=https://your-tablet-app.vercel.app,https://your-admin-app.vercel.app
```

### 5. 배포
```bash
# Railway에 배포
railway up

# 또는 GitHub 연동 후 자동 배포
# Railway 대시보드 > Settings > Connect to GitHub
```

### 6. 데이터베이스 마이그레이션
```bash
# Railway 터미널에서 실행
railway run npx prisma migrate deploy
railway run npm run prisma:seed
```

### 7. 배포 확인
```bash
# Railway에서 제공하는 URL 확인
railway domain

# API 테스트
curl https://your-app.railway.app/api/attendance/location/company
```

---

## 데이터베이스 배포 (Supabase)

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com/) 가입
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (Seoul 권장)

### 2. 연결 정보 획득
1. Settings > Database
2. Connection string 복사:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Prisma 마이그레이션
```bash
# .env 파일 업데이트
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# 마이그레이션 실행
npx prisma migrate deploy

# 초기 데이터 생성
npm run prisma:seed
```

### 4. 연결 풀링 설정 (권장)
```env
# Direct connection (마이그레이션용)
DATABASE_URL="postgresql://..."

# Pooled connection (애플리케이션용)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
```

---

## 웹 배포 (Vercel)

### 태블릿 웹앱 배포

#### 1. Vercel CLI 설치
```bash
npm install -g vercel
```

#### 2. 환경 변수 설정
`web-tablet/.env.production` 생성:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

#### 3. 배포
```bash
cd web-tablet

# 프로덕션 빌드
npm run build

# Vercel 배포
vercel --prod

# 또는 GitHub 연동 후 자동 배포
```

#### 4. Vercel 설정 (vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Permissions-Policy",
          "value": "camera=*, geolocation=*"
        }
      ]
    }
  ]
}
```

### 관리자 웹 배포

```bash
cd web-admin

# 환경 변수 설정
echo "VITE_API_URL=https://your-backend.railway.app/api" > .env.production

# 빌드 및 배포
npm run build
vercel --prod
```

---

## 모바일 앱 배포 (Expo EAS)

### 1. EAS CLI 설치
```bash
npm install -g eas-cli
```

### 2. Expo 계정 로그인
```bash
eas login
```

### 3. 프로젝트 설정
```bash
cd mobile

# EAS 초기화
eas build:configure
```

`eas.json` 생성됨:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "release"
      },
      "env": {
        "API_URL": "https://your-backend.railway.app/api"
      }
    },
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 4. Android 빌드
```bash
# APK 빌드 (테스트용)
eas build --platform android --profile production

# AAB 빌드 (Play Store 제출용)
eas build --platform android --profile production --auto-submit
```

### 5. iOS 빌드
```bash
# iOS 빌드 (Apple Developer 계정 필요, $99/년)
eas build --platform ios --profile production

# App Store 제출
eas submit --platform ios
```

### 6. OTA 업데이트 (Over-The-Air)
```bash
# 코드 변경 후 즉시 업데이트 (앱스토어 재심사 불필요)
eas update --branch production --message "버그 수정"
```

---

## 환경 변수 설정

### 프로덕션 환경 변수 체크리스트

#### 백엔드
- [ ] `DATABASE_URL`: 프로덕션 데이터베이스
- [ ] `JWT_SECRET`: 32자 이상 랜덤 문자열
- [ ] `HMAC_SECRET`: 32자 이상 랜덤 문자열
- [ ] `CORS_ORIGIN`: 실제 도메인으로 변경
- [ ] `NODE_ENV`: `production`
- [ ] 회사 위치 좌표 실제 값으로 변경

#### 웹 앱
- [ ] `VITE_API_URL`: 백엔드 프로덕션 URL
- [ ] HTTPS 사용 확인

#### 모바일 앱
- [ ] `API_URL`: 백엔드 프로덕션 URL
- [ ] 앱 버전 업데이트 (`app.json`)

### 시크릿 생성 방법
```bash
# Node.js로 랜덤 시크릿 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 또는 OpenSSL 사용
openssl rand -hex 32
```

---

## 도메인 및 SSL

### 커스텀 도메인 설정

#### Vercel (웹앱)
1. Vercel 프로젝트 > Settings > Domains
2. 도메인 추가: `tablet.yourcompany.com`
3. DNS 레코드 설정:
```
Type: CNAME
Name: tablet
Value: cname.vercel-dns.com
```

#### Railway (백엔드)
1. Railway 프로젝트 > Settings > Domains
2. 커스텀 도메인 추가: `api.yourcompany.com`
3. DNS 레코드:
```
Type: CNAME
Name: api
Value: [railway-provided-domain]
```

### SSL 인증서
- Vercel, Railway, Supabase 모두 자동으로 Let's Encrypt SSL 제공
- 추가 설정 불필요

---

## 모니터링 및 유지보수

### 로그 모니터링

#### Railway
```bash
# 실시간 로그 확인
railway logs

# 또는 Railway 대시보드에서 확인
```

#### Vercel
- Vercel 대시보드 > Deployments > [배포] > Logs

### 에러 추적 (Sentry)

#### 1. Sentry 설정
```bash
npm install @sentry/node @sentry/react
```

#### 2. 백엔드 통합 (`backend/src/main.ts`)
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### 3. 프론트엔드 통합
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: 'production',
});
```

### 성능 모니터링

#### Prisma Pulse (데이터베이스)
- 실시간 쿼리 모니터링
- 느린 쿼리 감지

#### Vercel Analytics
- 웹 앱 성능 추적
- Core Web Vitals

### 백업 전략

#### 데이터베이스 백업 (Supabase)
1. Dashboard > Database > Backups
2. 자동 백업: 7일 보관 (무료 플랜)
3. 수동 백업:
```bash
# pg_dump 사용
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

#### 정기 백업 스크립트
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > backups/backup_$DATE.sql
# S3 또는 클라우드 스토리지에 업로드
```

---

## 배포 체크리스트

### 배포 전
- [ ] 모든 환경 변수 설정 완료
- [ ] 프로덕션 시크릿 생성 및 적용
- [ ] CORS 설정 업데이트
- [ ] 회사 위치 좌표 실제 값으로 변경
- [ ] 데이터베이스 마이그레이션 테스트
- [ ] API 엔드포인트 테스트

### 배포 후
- [ ] API 연결 확인
- [ ] 로그인 테스트
- [ ] QR 생성/스캔 테스트
- [ ] 위치 검증 테스트
- [ ] 관리자 대시보드 접속 확인
- [ ] 모바일 앱 다운로드 및 테스트

### 모니터링 설정
- [ ] Sentry 에러 추적 활성화
- [ ] 로그 모니터링 설정
- [ ] 알림 설정 (이메일/Slack)
- [ ] 데이터베이스 백업 자동화

---

## 트러블슈팅

### CORS 에러
```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://tablet.yourcompany.com',
    'https://admin.yourcompany.com',
  ],
  credentials: true,
});
```

### 데이터베이스 연결 실패
```bash
# 연결 테스트
npx prisma db push

# 연결 풀링 설정 확인
DATABASE_URL="postgresql://...?connection_limit=5"
```

### 모바일 앱 빌드 실패
```bash
# 캐시 삭제 후 재시도
eas build:clear
eas build --platform android --profile production
```

---

## 비용 최적화 팁

1. **Railway**: Hobby 플랜($5/월)으로 시작
2. **Supabase**: 무료 플랜으로 시작 (500MB DB)
3. **Vercel**: 무료 Hobby 플랜 사용
4. **Expo**: 무료 빌드 사용 (월 30회 제한)

**총 초기 비용**: $5-10/월로 시작 가능!

---

## 추가 리소스

- [Railway 문서](https://docs.railway.app/)
- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Expo EAS 문서](https://docs.expo.dev/eas/)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

---

**배포 성공을 기원합니다! 🚀**

