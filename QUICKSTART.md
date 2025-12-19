# 🚀 빠른 시작 가이드

5분 안에 QR 근태관리 시스템을 실행해보세요!

---

## 📋 사전 준비

시작하기 전에 다음이 설치되어 있는지 확인하세요:
- ✅ Node.js 18+ ([다운로드](https://nodejs.org/))
- ✅ PostgreSQL 14+ ([다운로드](https://www.postgresql.org/))

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

```bash
# 1. 백엔드 폴더로 이동
cd backend

# 2. 패키지 설치
npm install

# 3. 환경 변수 복사 (Windows)
copy .env.example .env

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
- 직원: `kim@company.com` / `employee123`

---

## ⚡ 3단계: 웹 애플리케이션 실행 (2분)

### 관리자 대시보드 (새 터미널)
```bash
cd web-admin
npm install
npm run dev
```
👉 `http://localhost:3002` 접속

### 태블릿 QR 스캔 (새 터미널)
```bash
cd web-tablet
npm install
npm run dev
```
👉 `http://localhost:3001` 접속

---

## 🎉 완료! 이제 테스트해보세요

### 1️⃣ 관리자 로그인
1. `http://localhost:3002` 접속
2. `admin@company.com` / `admin123` 입력
3. 실시간 대시보드 확인!

### 2️⃣ 모바일 앱 (선택사항)
```bash
cd mobile
npm install
npx expo start
```
- Expo Go 앱으로 QR 스캔
- 또는 `w`를 눌러 웹에서 실행

---

## 🔧 문제 해결

### 포트가 이미 사용 중?
```bash
# Windows에서 포트 3000 확인
netstat -ano | findstr :3000

# 프로세스 종료 (관리자 권한)
taskkill /PID [프로세스ID] /F
```

### 데이터베이스 연결 실패?
`.env` 파일에서 `DATABASE_URL` 확인:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/qr_attendance?schema=public"
```

### Prisma 오류?
```bash
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

