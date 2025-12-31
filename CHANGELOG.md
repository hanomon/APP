# 변경 이력 (Changelog)

이 프로젝트의 모든 주요 변경사항은 이 파일에 문서화됩니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 기반으로 하며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

---

## [1.0.1] - 2025-12-30

### 🔧 수정됨 (Fixed)
- **Node.js 호환성**: Node.js v24 호환성 문제 해결 (v18-v20 권장)
- **Windows Expo**: Metro bundler `node:sea` 경로 에러 우회
- **모바일 앱 설정**: `app.json`을 웹 전용으로 간소화하여 불필요한 asset 요구사항 제거
- **의존성**: `expo-linking` 패키지 누락 문제 해결

### 📚 문서화 (Documentation)
- **EXECUTIVE_SUMMARY.md**: 경영진/관리자용 비즈니스 가치 및 ROI 분석 보고서 신규 작성
  - 비용 절감 효과 분석
  - 투자 수익률(ROI) 계산
  - 도입 효과 사례
  - 경쟁 우위 분석
- **QUICKSTART.md**: Windows 환경 설정 가이드 및 주의사항 추가
- **README.md**: 
  - Node.js 버전 요구사항 명시 (v18-v20 LTS)
  - Windows 환경 주의사항 섹션 추가
  - 문제 해결 가이드 확장 (6가지 일반적인 문제)
  - 최근 변경사항 섹션 추가
  - 경영진 보고서 링크 추가
- **CHANGELOG.md**: 변경 이력 파일 생성

### ⚠️ 알려진 이슈 (Known Issues)
- **Node.js v21+**: Expo SDK 50과 호환되지 않음 → v20 LTS 사용 권장
- **Windows Expo Tunnel**: 회사 방화벽에서 차단될 수 있음 → `--lan` 또는 `--web` 모드 사용
- **회사 네트워크**: SSL 인증서 에러 발생 가능 → 임시 해결: `NODE_TLS_REJECT_UNAUTHORIZED="0"`

### 🎯 실행 확인됨 (Verified)
- ✅ 백엔드 API (http://localhost:3000/api)
- ✅ 관리자 웹 대시보드 (http://localhost:3002)
- ✅ 태블릿 QR 스캐너 (http://localhost:3003)
- ✅ 모바일 앱 웹 모드 (http://localhost:8081)

---

## [1.0.0] - 2025-12-29

### 🎉 추가됨 (Added)
- **백엔드 API**: NestJS + PostgreSQL + Prisma
  - JWT 인증 시스템
  - HMAC-SHA256 QR 코드 서명
  - GPS 위치 검증
  - RESTful API 엔드포인트
  
- **모바일 앱**: React Native (Expo)
  - 직원 로그인
  - QR 코드 생성 (30초 유효시간)
  - 출퇴근 기록 조회
  - GPS 위치 자동 전송

- **태블릿 웹앱**: React (Vite)
  - QR 코드 스캐너
  - 실시간 출퇴근 처리
  - 성공/실패 피드백

- **관리자 대시보드**: React (Vite)
  - 실시간 출퇴근 현황
  - 직원 관리 (CRUD)
  - 근태 기록 조회
  - 통계 대시보드

### 🔐 보안 (Security)
- HMAC-SHA256 서명으로 QR 코드 위변조 방지
- JWT 기반 인증 및 권한 관리
- GPS 이중 검증 (직원 + 태블릿)
- bcrypt 비밀번호 암호화
- CORS 정책 설정

### 📚 문서 (Documentation)
- README.md (전체 프로젝트 문서)
- QUICKSTART.md (빠른 시작 가이드)
- SETUP_GUIDE.md (상세 설치 가이드)
- ARCHITECTURE.md (시스템 아키텍처)
- DEPLOYMENT.md (배포 가이드)
- PROJECT_SUMMARY.md (프로젝트 요약)

---

## 버전 관리 규칙

- **MAJOR** (x.0.0): 하위 호환성이 없는 API 변경
- **MINOR** (0.x.0): 하위 호환되는 기능 추가
- **PATCH** (0.0.x): 하위 호환되는 버그 수정

## 링크

- [GitHub 저장소](https://github.com/hanomon/APP)
- [이슈 트래커](https://github.com/hanomon/APP/issues)

