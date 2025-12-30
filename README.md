# 🏢 QR코드 기반 직원 근태관리 시스템

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

**GPS 위치 검증과 HMAC 서명을 활용한 엔터프라이즈급 근태관리 솔루션**

[빠른 시작](#-빠른-시작) •
[기능](#-주요-기능) •
[아키텍처](#-시스템-아키텍처) •
[문서](#-문서) •
[기여](#-기여하기)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 특징](#-주요-특징)
- [시스템 아키텍처](#-시스템-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [기술 스택](#-기술-스택)
- [빠른 시작](#-빠른-시작)
- [주요 기능](#-주요-기능)
- [보안](#-보안)
- [API 문서](#-api-문서)
- [배포](#-배포)
- [문서](#-문서)
- [로드맵](#-로드맵)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

QR코드 기반 직원 근태관리 시스템은 **GPS 위치 검증**과 **HMAC-SHA256 암호화 서명**을 활용하여 부정 출퇴근을 방지하는 현대적인 근태관리 솔루션입니다.

### 💡 왜 이 시스템인가?

기존 근태관리 시스템의 문제점:
- ❌ **QR 코드 캡처/공유로 인한 부정 출퇴근**
- ❌ **위치 정보 없이 원격에서 출퇴근 가능**
- ❌ **단순 QR 코드는 쉽게 복제 가능**
- ❌ **실시간 모니터링 부재**

✅ **우리의 솔루션:**
- ✅ **30초마다 갱신되는 동적 QR 코드** → 캡처 방지
- ✅ **GPS 위치 검증 (회사 반경 150m)** → 원격 출퇴근 차단
- ✅ **HMAC 암호화 서명** → 위변조 불가능
- ✅ **실시간 대시보드** → 즉각적인 현황 파악
- ✅ **이중 위치 검증** (직원 + 태블릿) → 최고 수준의 보안

---

## ✨ 주요 특징

### 🔐 강력한 보안
- **HMAC-SHA256 서명**: QR 코드 위변조 완전 차단
- **30초 유효시간**: 캡처된 QR 코드 재사용 불가
- **GPS 이중 검증**: 직원 위치 + 태블릿 위치 동시 확인
- **정확도 검증**: 50m 이내 GPS 정확도 요구
- **중복 방지**: 5분 이내 재출근 차단

### 📱 사용자 친화적
- **원터치 출퇴근**: QR 코드 자동 생성 및 스캔
- **직관적 UI/UX**: 아름답고 현대적인 디자인
- **실시간 피드백**: 즉각적인 성공/실패 표시
- **다국어 지원 준비**: 한국어/영어 (확장 가능)

### 📊 실시간 모니터링
- **라이브 대시보드**: 실시간 출퇴근 현황
- **상세 통계**: 일별/주별/월별 리포트
- **알림 시스템**: 지각/조퇴 자동 감지
- **엑셀 내보내기**: 급여 시스템 연동 준비

### 🚀 확장성
- **모듈식 아키텍처**: 쉬운 기능 추가
- **RESTful API**: 다른 시스템과 통합 용이
- **다중 사업장**: 여러 지점 동시 관리 가능
- **클라우드 준비**: AWS/GCP 배포 가능

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        전체 시스템 플로우                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   모바일 앱       │         │   태블릿 웹앱     │         │   관리자 웹       │
│  (React Native)  │         │    (React)       │         │    (React)       │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ • QR 생성        │         │ • QR 스캔        │         │ • 실시간 대시보드 │
│ • GPS 추적       │◄───────►│ • 출퇴근 처리    │◄───────►│ • 통계 및 리포트 │
│ • 근태 조회      │         │ • 위치 검증      │         │ • 직원 관리      │
│ • 알림 수신      │         │ • 카메라 제어    │         │ • 기록 수정      │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         │                  HTTPS/REST API                         │
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │     백엔드 서버          │
                         │      (NestJS)           │
                         ├─────────────────────────┤
                         │ • JWT 인증              │
                         │ • QR 서명/검증          │
                         │ • 위치 계산             │
                         │ • 비즈니스 로직         │
                         │ • 실시간 알림           │
                         └────────────┬────────────┘
                                      │
                              Prisma ORM
                                      │
                         ┌────────────▼────────────┐
                         │     PostgreSQL          │
                         │                         │
                         │ • 사용자 정보           │
                         │ • 근태 기록             │
                         │ • 위치 로그             │
                         │ • 시스템 설정           │
                         └─────────────────────────┘
```

### 🔄 출퇴근 처리 플로우

```
1. 직원이 모바일 앱 실행
   ↓
2. GPS 위치 획득 (고정밀도)
   ↓
3. 서버에 QR 생성 요청
   ↓
4. 서버가 HMAC 서명 생성
   ↓
5. QR 코드 화면 표시 (30초 타이머)
   ↓
6. 태블릿 카메라로 QR 스캔
   ↓
7. 태블릿 GPS 위치 획득
   ↓
8. 서버에 출근 요청 전송
   ↓
9. 서버에서 다단계 검증:
   - HMAC 서명 검증
   - 타임스탬프 검증 (30초)
   - GPS 정확도 검증 (50m)
   - 회사 거리 검증 (150m)
   - 직원-태블릿 거리 검증 (50m)
   - 중복 체크인 확인 (5분)
   ↓
10. 검증 성공 → DB 저장
    ↓
11. 실시간 대시보드 업데이트
    ↓
12. 직원에게 알림 전송
```

---

## 📁 프로젝트 구조

```
company/
├── 📂 backend/                     # NestJS 백엔드 서버
│   ├── src/
│   │   ├── auth/                  # JWT 인증 모듈
│   │   ├── users/                 # 사용자 관리
│   │   ├── attendance/            # 근태 관리 (핵심)
│   │   │   ├── attendance.service.ts    # 비즈니스 로직
│   │   │   ├── qr.service.ts           # QR 서명/검증
│   │   │   └── location.service.ts     # GPS 계산
│   │   └── prisma/                # DB 연결
│   ├── prisma/
│   │   ├── schema.prisma          # 데이터베이스 스키마
│   │   └── seed.ts                # 초기 데이터
│   └── package.json
│
├── 📂 mobile/                      # React Native 모바일 앱
│   ├── app/
│   │   ├── index.tsx              # QR 생성 화면
│   │   ├── login.tsx              # 로그인
│   │   └── history.tsx            # 근태 기록
│   ├── context/
│   │   └── AuthContext.tsx        # 인증 상태 관리
│   ├── services/
│   │   └── api.ts                 # API 클라이언트
│   └── package.json
│
├── 📂 web-tablet/                  # 태블릿 QR 스캔 웹앱
│   ├── src/
│   │   ├── components/
│   │   │   ├── QRScanner.tsx      # QR 스캔 컴포넌트
│   │   │   └── CheckInResult.tsx  # 결과 표시
│   │   └── App.tsx
│   └── package.json
│
├── 📂 web-admin/                   # 관리자 대시보드
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      # 실시간 대시보드
│   │   │   ├── Employees.tsx      # 직원 관리
│   │   │   └── Records.tsx        # 근태 기록
│   │   ├── store/
│   │   │   └── authStore.ts       # Zustand 상태 관리
│   │   └── App.tsx
│   └── package.json
│
├── 📂 shared/                      # 공통 타입 정의
│   └── types.ts
│
├── 📄 README.md                    # 이 파일
├── 📄 QUICKSTART.md                # 5분 빠른 시작
├── 📄 SETUP_GUIDE.md               # 상세 설치 가이드
├── 📄 ARCHITECTURE.md              # 아키텍처 문서
├── 📄 DEPLOYMENT.md                # 배포 가이드
└── 📄 PROJECT_SUMMARY.md           # 프로젝트 요약
```

---

## 💎 주요 기능

### 📱 1. 모바일 앱 (직원용)

<details>
<summary><b>상세 기능 보기</b></summary>

#### QR 코드 생성
- 📍 **GPS 기반 동적 생성**: 30초마다 자동 갱신
- 🔒 **HMAC-SHA256 서명**: 위변조 완전 차단
- ⏱️ **실시간 카운트다운**: 남은 시간 표시
- 📶 **오프라인 대응**: 네트워크 재연결 시 자동 갱신

#### 사용자 경험
- 🎨 **아름다운 UI**: 직관적이고 현대적인 디자인
- 🌐 **다국어 지원**: 한국어/영어
- 📊 **통계 대시보드**: 개인 근무 시간 통계
- 📅 **캘린더 뷰**: 월별 출퇴근 기록

#### 보안 기능
- 🔐 **생체 인증**: Face ID / Touch ID 지원
- 🔑 **Secure Storage**: 토큰 안전 저장
- 🚫 **루팅 감지**: 탈옥/루팅 기기 차단

#### 기술 사양
- **플랫폼**: iOS 13+, Android 8+
- **권한**: 위치, 카메라, 알림
- **크기**: ~15MB (네이티브 빌드 후)

</details>

### 💻 2. 태블릿 웹앱 (출입구)

<details>
<summary><b>상세 기능 보기</b></summary>

#### QR 스캔 기능
- 📸 **HTML5 카메라**: 별도 앱 설치 불필요
- ⚡ **초고속 스캔**: 1초 이내 인식
- 🔄 **연속 스캔 모드**: 여러 직원 연속 처리
- 🌙 **저조도 지원**: 어두운 환경에서도 작동

#### 실시간 검증
- 📍 **GPS 위치 확인**: 태블릿 위치 자동 감지
- ✅ **즉시 피드백**: 성공/실패 애니메이션
- 🔊 **음성 안내**: "홍길동님 출근 처리되었습니다"
- 📊 **실시간 통계**: 오늘의 출근/퇴근 현황

#### 관리 기능
- 🔄 **자동 새로고침**: 네트워크 끊김 자동 복구
- 🖥️ **키오스크 모드**: 전체화면 고정
- 🔒 **무인 운영**: 관리자 개입 불필요
- 📱 **반응형**: 태블릿/모바일 모두 지원

#### 기술 사양
- **브라우저**: Chrome 90+, Safari 14+, Edge 90+
- **해상도**: 1024x768 이상 권장
- **네트워크**: 3G 이상

</details>

### 📊 3. 관리자 대시보드

<details>
<summary><b>상세 기능 보기</b></summary>

#### 실시간 모니터링
- 📈 **라이브 대시보드**: 30초마다 자동 갱신
- 👥 **현재 근무자**: 실시간 출퇴근 현황
- 🔔 **알림 센터**: 지각/조퇴 즉시 알림
- 📍 **위치 지도**: 출퇴근 위치 시각화

#### 통계 및 리포트
- 📊 **차트/그래프**: Recharts 기반 시각화
- 📅 **기간별 분석**: 일/주/월/년 통계
- 💾 **엑셀 내보내기**: 급여 시스템 연동
- 📄 **PDF 리포트**: 인쇄용 보고서 생성

#### 직원 관리
- ➕ **직원 등록**: CSV 대량 등록 지원
- ✏️ **정보 수정**: 부서/직급 관리
- 🔄 **재직 상태**: 활성/비활성 전환
- 🗂️ **그룹 관리**: 부서별 조직도

#### 근태 관리
- 🔍 **상세 검색**: 다양한 필터링 옵션
- ✏️ **수동 수정**: 예외 상황 처리
- 💬 **메모 기능**: 지각/조퇴 사유 기록
- 📧 **알림 발송**: 이메일/SMS 통합

#### 시스템 설정
- 🏢 **회사 위치**: GPS 좌표 설정
- ⏱️ **근무 시간**: 출퇴근 시간 설정
- 🔐 **권한 관리**: 역할별 접근 제어
- 🌐 **다국어 설정**: 언어 선택

</details>

### 🔐 4. 보안 시스템

<details>
<summary><b>보안 아키텍처 보기</b></summary>

#### QR 코드 보안
```typescript
// QR 코드 구조
{
  employeeId: "uuid",
  timestamp: 1234567890000,  // 현재 시각
  latitude: 37.5666805,      // 직원 위치
  longitude: 126.9784147,
  accuracy: 15.5,            // GPS 정확도 (m)
  signature: "hmac-sha256"   // HMAC 서명
}

// 서명 생성
HMAC-SHA256(
  `${employeeId}|${timestamp}|${lat}|${lng}|${accuracy}`,
  SECRET_KEY
)
```

#### 다단계 검증 프로세스
1. **서명 검증**: HMAC 일치 여부 확인
2. **타임스탬프 검증**: 30초 이내인지 확인
3. **GPS 정확도 검증**: 50m 이내인지 확인
4. **회사 거리 검증**: 회사로부터 150m 이내인지 확인
5. **직원-태블릿 거리 검증**: 50m 이내인지 확인
6. **중복 체크인 검증**: 최근 5분 이내 기록 없는지 확인
7. **계정 상태 확인**: 활성 계정인지 확인

#### JWT 인증
```typescript
// 토큰 구조
{
  sub: "user-uuid",        // 사용자 ID
  email: "user@company.com",
  role: "EMPLOYEE",        // 권한
  iat: 1234567890,        // 발급 시각
  exp: 1234567890         // 만료 시각 (7일)
}
```

#### 위치 계산 (Haversine)
```typescript
// 두 GPS 좌표 간 거리 계산
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

</details>

---

## 🛠️ 기술 스택

<table>
<tr>
<td valign="top" width="33%">

### 📱 모바일 (React Native)
- ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) **React Native 0.73**
- ![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white) **Expo SDK 50**
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript 5.3**
- **Expo Location** - GPS 추적
- **Expo Camera** - QR 스캔
- **React Navigation** - 화면 전환
- **Axios** - HTTP 클라이언트
- **Secure Store** - 토큰 저장

</td>
<td valign="top" width="33%">

### 💻 웹 (React)
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18**
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) **Vite 5**
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript 5.3**
- ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **TailwindCSS 3**
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태
- **Recharts** - 차트/그래프
- **Framer Motion** - 애니메이션
- **ZXing** - QR 스캔 (웹)

</td>
<td valign="top" width="33%">

### ⚙️ 백엔드
- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) **NestJS 10**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL 14+**
- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white) **Prisma 5**
- **JWT + Passport** - 인증
- **bcrypt** - 비밀번호 해싱
- **class-validator** - 검증
- **crypto** - HMAC 서명

</td>
</tr>
</table>

### 🚀 DevOps & 인프라

| 단계 | 플랫폼 | 용도 | 비용 |
|------|--------|------|------|
| **개발** | Localhost | 로컬 개발 환경 | 무료 |
| **스테이징** | Railway + Vercel | 테스트 배포 | $5-20/월 |
| **프로덕션** | AWS/GCP | 실제 운영 | 사용량 기반 |

**권장 배포 스택:**
- 🚂 **Railway** - 백엔드 API (NestJS)
- 🐘 **Supabase** - PostgreSQL 데이터베이스
- ▲ **Vercel** - 웹 애플리케이션 (React)
- 📱 **Expo EAS** - 모바일 앱 빌드
- 🍎 **App Store** - iOS 앱 배포
- 🤖 **Play Store** - Android 앱 배포

### 📊 데이터베이스 스키마

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  employee_number VARCHAR UNIQUE NOT NULL,
  department VARCHAR,
  position VARCHAR,
  role VARCHAR DEFAULT 'EMPLOYEE',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 근태 기록 테이블
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  check_in_time TIMESTAMP NOT NULL,
  check_out_time TIMESTAMP,
  check_in_latitude FLOAT NOT NULL,
  check_in_longitude FLOAT NOT NULL,
  check_in_accuracy FLOAT NOT NULL,
  check_out_latitude FLOAT,
  check_out_longitude FLOAT,
  check_out_accuracy FLOAT,
  status VARCHAR DEFAULT 'CHECKED_IN',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_user_checkin ON attendance_records(user_id, check_in_time);
```

---

## 🚀 빠른 시작

### 📋 사전 요구사항

시작하기 전에 다음이 설치되어 있는지 확인하세요:

| 소프트웨어 | 버전 | 설치 링크 | 필수 여부 |
|-----------|------|-----------|----------|
| Node.js | **18-20 LTS** ⚠️ | [다운로드](https://nodejs.org/) | ✅ 필수 |
| PostgreSQL | 14+ | [다운로드](https://www.postgresql.org/) | ✅ 필수 |
| Git | Latest | [다운로드](https://git-scm.com/) | ✅ 필수 |
| Expo Go 앱 | Latest | [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | 📱 모바일 개발 시 |

> ⚠️ **중요**: Node.js v21+ (특히 v24)는 Expo SDK 50과 호환되지 않습니다!  
> Node.js v20.x LTS 버전을 권장합니다. 버전 확인: `node --version`

### 🪟 Windows 환경 주의사항

Windows에서 개발 시 다음 사항을 확인하세요:

#### Node.js 버전 확인 및 변경
```powershell
# 현재 Node.js 버전 확인
node --version

# v21 이상이면 v20으로 다운그레이드 필요!
# NVM for Windows 사용 권장: https://github.com/coreybutler/nvm-windows
```

#### 회사 네트워크 SSL 인증서 문제
회사 네트워크에서 SSL 인증서 에러 발생 시:
```powershell
# 임시 해결 (개발 환경만)
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm install --legacy-peer-deps
```

#### PowerShell 실행 정책
스크립트 실행 에러 발생 시 (관리자 권한 PowerShell):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ⚡ 5분 안에 시작하기

#### 1️⃣ 저장소 클론

```bash
git clone https://github.com/hanomon/APP.git
cd APP
```

#### 2️⃣ 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE qr_attendance;

# 종료
\q
```

#### 3️⃣ 백엔드 설정 및 실행

```bash
cd backend

# 패키지 설치
npm install

# 환경 변수 복사 (Windows: copy, Mac/Linux: cp)
copy .env.example .env
# .env 파일을 열어서 DATABASE_URL 비밀번호 수정!

# Prisma 설정
npx prisma generate
npx prisma migrate dev --name init

# 초기 데이터 생성 (테스트 계정 포함)
npm run prisma:seed

# 서버 실행
npm run start:dev
```

✅ **성공!** 백엔드가 `http://localhost:3000/api`에서 실행됩니다.

#### 4️⃣ 웹 애플리케이션 실행

**관리자 대시보드** (새 터미널):
```bash
cd web-admin
npm install
npm run dev
# → http://localhost:3002
```

**태블릿 QR 스캔** (새 터미널):
```bash
cd web-tablet
npm install
npm run dev
# → http://localhost:3001
```

#### 5️⃣ 모바일 앱 실행 (선택사항)

```bash
cd mobile
npm install
npx expo start

# 이후:
# - 'i' 키: iOS 시뮬레이터
# - 'a' 키: Android 에뮬레이터
# - QR 스캔: Expo Go 앱으로 실제 기기 테스트
```

### 🔑 테스트 계정

| 역할 | 이메일 | 비밀번호 | 설명 |
|------|--------|----------|------|
| 👑 관리자 | `admin@company.com` | `admin123` | 전체 권한 |
| 👤 직원1 | `kim@company.com` | `employee123` | 개발팀 김철수 |
| 👤 직원2 | `lee@company.com` | `employee123` | 디자인팀 이영희 |
| 👤 직원3 | `park@company.com` | `employee123` | 영업팀 박민수 |

### 🎯 첫 번째 출퇴근 테스트

1. **관리자 로그인**
   - http://localhost:3002 접속
   - `admin@company.com` / `admin123` 로그인

2. **모바일 앱에서 QR 생성** (또는 웹에서 시뮬레이션)
   - `kim@company.com` 로그인
   - QR 코드 자동 생성 확인

3. **태블릿에서 스캔**
   - http://localhost:3001 접속
   - "출근" 버튼 선택
   - QR 코드 스캔

4. **대시보드 확인**
   - 관리자 대시보드에서 실시간 업데이트 확인!

---

## 🔧 환경 변수 설정

### Backend (`.env`)

```env
# 데이터베이스 (필수)
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/qr_attendance?schema=public"

# JWT 시크릿 (필수 - 프로덕션에서 반드시 변경!)
JWT_SECRET="super-secret-jwt-key-min-32-characters-change-in-production"
JWT_EXPIRES_IN="7d"

# HMAC 시크릿 (필수 - 프로덕션에서 반드시 변경!)
HMAC_SECRET="super-secret-hmac-key-min-32-characters-change-in-production"

# 서버 설정
PORT=3000
NODE_ENV=development

# 회사 위치 (Google Maps에서 좌표 확인)
COMPANY_LATITUDE=37.5666805    # 서울시청 예시
COMPANY_LONGITUDE=126.9784147
ALLOWED_RADIUS=150             # 미터
REQUIRED_ACCURACY=50           # 미터

# QR 코드 설정
QR_CODE_EXPIRY_SECONDS=30
DUPLICATE_CHECKIN_PREVENTION_MINUTES=5

# CORS (배포 시 실제 도메인으로 변경)
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

### Mobile (`services/api.ts`)

```typescript
// API URL 설정
const API_URL = 'http://localhost:3000/api';        // iOS 시뮬레이터
// const API_URL = 'http://10.0.2.2:3000/api';      // Android 에뮬레이터
// const API_URL = 'http://192.168.0.10:3000/api';  // 실제 기기 (내 IP)
```

### Web Apps

웹 앱들은 자동으로 `http://localhost:3000/api`를 사용합니다.  
배포 시 `vite.config.ts`에서 proxy 설정 변경 필요.

---

## 📡 API 문서

### 인증 (Authentication)

#### POST `/api/auth/login`
로그인하여 JWT 토큰을 받습니다.

**Request:**
```json
{
  "email": "kim@company.com",
  "password": "employee123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "kim@company.com",
    "name": "김철수",
    "role": "EMPLOYEE",
    "employeeNumber": "EMP002",
    "department": "개발팀"
  }
}
```

### 근태 관리 (Attendance)

#### POST `/api/attendance/check-in`
출근 처리

**Request:**
```json
{
  "qrCodeData": "...",  // QR 코드 JSON 문자열
  "tabletLatitude": 37.5666805,
  "tabletLongitude": 126.9784147,
  "tabletAccuracy": 15.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "김철수님 출근 처리되었습니다.",
  "record": {
    "id": "uuid",
    "checkInTime": "2024-01-15T09:00:00.000Z",
    "user": {
      "name": "김철수",
      "employeeNumber": "EMP002"
    }
  },
  "distance": 45  // 회사로부터의 거리 (m)
}
```

#### POST `/api/attendance/check-out`
퇴근 처리 (check-in과 동일한 형식)

#### POST `/api/attendance/generate-qr`
QR 코드 생성용 데이터

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "latitude": 37.5666805,
  "longitude": 126.9784147,
  "accuracy": 15.5
}
```

**Response:**
```json
{
  "employeeId": "uuid",
  "timestamp": 1705294800000,
  "latitude": 37.5666805,
  "longitude": 126.9784147,
  "accuracy": 15.5,
  "signature": "a1b2c3d4e5f6..."  // HMAC-SHA256
}
```

#### GET `/api/attendance/my-records`
내 근태 기록 조회

**Query Parameters:**
- `startDate`: ISO 8601 date (optional)
- `endDate`: ISO 8601 date (optional)

**Response:**
```json
[
  {
    "id": "uuid",
    "checkInTime": "2024-01-15T09:00:00.000Z",
    "checkOutTime": "2024-01-15T18:00:00.000Z",
    "status": "CHECKED_OUT",
    "user": {
      "name": "김철수",
      "employeeNumber": "EMP002"
    }
  }
]
```

#### GET `/api/attendance/stats/today`
오늘의 통계

**Response:**
```json
{
  "totalEmployees": 50,
  "presentToday": 45,
  "absentToday": 5,
  "currentlyPresent": 40,
  "checkedOut": 5
}
```

### 사용자 관리 (Users)

#### GET `/api/users`
전체 사용자 조회 (관리자 전용)

#### GET `/api/users/:id`
특정 사용자 조회

#### POST `/api/users`
사용자 생성 (관리자 전용)

#### PUT `/api/users/:id`
사용자 정보 수정

#### DELETE `/api/users/:id`
사용자 삭제 (관리자 전용)

### 에러 응답

```json
{
  "statusCode": 400,
  "message": "QR 코드가 만료되었습니다. (45초 경과)",
  "error": "Bad Request"
}
```

**주요 에러 코드:**
- `400` - Bad Request (검증 실패)
- `401` - Unauthorized (인증 실패)
- `403` - Forbidden (권한 없음)
- `404` - Not Found (리소스 없음)
- `500` - Internal Server Error (서버 오류)

---

## 🚢 배포

### 개발 환경 → 프로덕션

#### 1. Railway (백엔드)

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
cd backend
railway init

# PostgreSQL 추가 (Railway 대시보드에서)
# 환경 변수 설정 (Railway 대시보드에서)

# 배포
railway up
```

#### 2. Vercel (웹 앱)

```bash
# Vercel CLI 설치
npm install -g vercel

# 관리자 웹 배포
cd web-admin
vercel --prod

# 태블릿 웹 배포
cd web-tablet
vercel --prod
```

#### 3. Expo EAS (모바일 앱)

```bash
# EAS CLI 설치
npm install -g eas-cli

# 로그인
eas login

# 빌드 설정
cd mobile
eas build:configure

# Android 빌드
eas build --platform android

# iOS 빌드 (Apple Developer 계정 필요)
eas build --platform ios
```

### 환경 변수 (프로덕션)

⚠️ **보안 주의사항:**
- `JWT_SECRET`: 32자 이상 랜덤 문자열
- `HMAC_SECRET`: 32자 이상 랜덤 문자열
- `DATABASE_URL`: 프로덕션 DB 주소
- `CORS_ORIGIN`: 실제 도메인만 허용

**시크릿 생성:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📚 문서

| 문서 | 설명 | 링크 |
|------|------|------|
| 📖 **QUICKSTART.md** | 5분 안에 시작하기 | [보기](./QUICKSTART.md) |
| 📘 **SETUP_GUIDE.md** | 상세 설치 가이드 | [보기](./SETUP_GUIDE.md) |
| 🏗️ **ARCHITECTURE.md** | 시스템 아키텍처 | [보기](./ARCHITECTURE.md) |
| 🚢 **DEPLOYMENT.md** | 배포 가이드 | [보기](./DEPLOYMENT.md) |
| 📊 **PROJECT_SUMMARY.md** | 프로젝트 요약 | [보기](./PROJECT_SUMMARY.md) |

---

## 📝 최근 변경사항

### v1.0.1 (2025-12-30)

#### 🔧 버그 수정
- **Node.js 호환성 문제 해결**: v24 호환성 이슈 해결 (v18-v20 권장)
- **Windows 환경 개선**: Expo Metro bundler 경로 문제 우회
- **모바일 앱 설정 간소화**: 웹 전용 `app.json` 최적화
- **expo-linking 의존성 추가**: 필수 패키지 누락 수정

#### 📚 문서 업데이트
- **QUICKSTART.md**: Windows 환경 설정 가이드 추가
- **README.md**: Node.js 버전 요구사항 명시
- **문제 해결 섹션**: 실제 발생 이슈 6가지 추가

#### 💡 알려진 이슈
- **Windows + Expo**: `--tunnel` 모드는 회사 방화벽에서 차단될 수 있음 (해결: `--lan` 또는 `--web` 사용)
- **Node.js v21+**: Expo SDK 50과 호환되지 않음 (해결: v20 다운그레이드)

---

## 🗺️ 로드맵

### ✅ Phase 1 - 완료 (v1.0)
- [x] QR 기반 출퇴근 시스템
- [x] GPS 위치 검증
- [x] HMAC 서명 보안
- [x] 관리자 대시보드
- [x] 실시간 통계
- [x] 모바일 앱 (iOS/Android)
- [x] 웹 애플리케이션 (태블릿/관리자)

### 🚧 Phase 2 - 진행 중 (v1.1)
- [ ] 이메일/SMS 알림
- [ ] 근무 시간 통계 리포트
- [ ] 엑셀 내보내기
- [ ] 모바일 푸시 알림
- [ ] 다국어 지원 (영어)
- [ ] PWA (모바일 웹)

### 📋 Phase 3 - 계획됨 (v2.0)
- [ ] 얼굴 인식 추가 인증
- [ ] 다중 사업장 지원
- [ ] 휴가/출장 관리
- [ ] 급여 시스템 연동 API
- [ ] 조직도 관리
- [ ] 근무 시간 자동 계산

### 🔮 Phase 4 - 미래 (v3.0)
- [ ] 라즈베리파이 NFC 리더기
- [ ] IoT 센서 통합 (온도, 습도)
- [ ] AI 이상 탐지 (부정 출퇴근)
- [ ] 블록체인 기록 보관
- [ ] 음성 인식 출퇴근
- [ ] AR/VR 메타버스 오피스 연동

---

## 🤝 기여하기

프로젝트 기여를 환영합니다! 다음 방법으로 참여하실 수 있습니다:

### 1. 이슈 제기
버그 발견이나 기능 제안이 있다면 [Issues](https://github.com/hanomon/APP/issues)에 등록해주세요.

### 2. Pull Request

```bash
# 1. Fork 저장소
# 2. 브랜치 생성
git checkout -b feature/amazing-feature

# 3. 변경사항 커밋
git commit -m "feat: Add amazing feature"

# 4. 푸시
git push origin feature/amazing-feature

# 5. Pull Request 생성
```

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무 수정
```

### 코드 스타일

- **TypeScript**: ESLint + Prettier
- **React**: Airbnb Style Guide
- **Commit**: Conventional Commits

---

## 🐛 문제 해결

<details>
<summary><b>⚠️ Node.js 버전 호환성 에러 (Windows)</b></summary>

**증상:** `Error: ENOENT: no such file or directory, mkdir '...node:sea'`

**원인:** Node.js v21+ (특히 v24)가 Expo SDK 50과 호환되지 않음

**해결:**
```powershell
# 1. 현재 버전 확인
node --version

# 2. v21 이상이면 v20 LTS로 다운그레이드
# NVM for Windows 권장: https://github.com/coreybutler/nvm-windows

# 3. 캐시 삭제 및 재설치
cd mobile
Remove-Item -Recurse -Force node_modules,.expo
npm install --legacy-peer-deps
```

**권장 버전:** Node.js v18.x ~ v20.x
</details>

<details>
<summary><b>🔒 npm install SSL 인증서 에러</b></summary>

**증상:** `self-signed certificate in certificate chain`

**원인:** 회사 네트워크 방화벽/프록시

**해결:** (개발 환경만)
```powershell
# 임시 해결
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"
npm install --legacy-peer-deps
```

**영구 해결:** 회사 SSL 인증서를 Node.js에 추가하거나 프록시 설정 확인
</details>

<details>
<summary><b>📱 Expo 모바일 앱 실행 에러</b></summary>

**증상:** `Unable to resolve "expo-linking"` 또는 `there was a problem running the requested app`

**해결:**
```powershell
cd mobile
npm install expo-linking --legacy-peer-deps
Remove-Item -Recurse -Force .expo
npx expo start --web
```

**Windows에서 권장 실행 방법:**
- ✅ `--web` (브라우저)
- ✅ `--lan` (같은 Wi-Fi의 실제 폰)
- ❌ `--tunnel` (방화벽에서 차단될 수 있음)
</details>

<details>
<summary><b>데이터베이스 연결 실패</b></summary>

**증상:** `password authentication failed`

**해결:**
1. `.env` 파일의 `DATABASE_URL` 비밀번호 확인
2. PostgreSQL 서비스 실행 확인
3. 포트 5432 사용 여부 확인

```bash
# PostgreSQL 서비스 확인 (Windows)
services.msc

# 포트 확인
netstat -ano | findstr :5432
```
</details>

<details>
<summary><b>모바일 앱 위치 권한 오류</b></summary>

**증상:** 위치 정보를 가져올 수 없음

**해결:**
- **iOS**: 설정 > 개인정보 보호 > 위치 서비스 > Expo Go > 항상 허용
- **Android**: 설정 > 앱 > Expo Go > 권한 > 위치 > 항상 허용
</details>

<details>
<summary><b>태블릿 웹앱 카메라 작동 안함</b></summary>

**증상:** 카메라 접근 오류

**해결:**
1. HTTPS 사용 또는 localhost에서만 작동
2. 브라우저 설정에서 카메라 권한 확인
3. Chrome/Edge 사용 권장 (Safari는 제한적)
</details>

더 많은 문제 해결은 [SETUP_GUIDE.md](./SETUP_GUIDE.md#문제-해결)를 참고하세요.

---

## 📞 지원 및 연락

- 📧 **이메일**: support@yourcompany.com
- 💬 **이슈**: [GitHub Issues](https://github.com/hanomon/APP/issues)
- 📖 **위키**: [GitHub Wiki](https://github.com/hanomon/APP/wiki)
- 💼 **LinkedIn**: [Your Profile](https://linkedin.com)

---

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다.

```
MIT License

Copyright (c) 2024 hanomon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리를 사용합니다:

- [NestJS](https://nestjs.com/) - 백엔드 프레임워크
- [React](https://react.dev/) - UI 라이브러리
- [React Native](https://reactnative.dev/) - 모바일 프레임워크
- [Expo](https://expo.dev/) - 모바일 개발 플랫폼
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - 데이터베이스
- [TailwindCSS](https://tailwindcss.com/) - CSS 프레임워크

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

Made with ❤️ by [hanomon](https://github.com/hanomon)

</div>

