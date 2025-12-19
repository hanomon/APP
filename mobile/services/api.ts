import axios from 'axios';

// 백엔드 API URL - 개발 환경에 맞게 수정하세요
// iOS 시뮬레이터: http://localhost:3000/api
// Android 에뮬레이터: http://10.0.2.2:3000/api
// 실제 기기: 로컬 네트워크 IP 주소 사용 (예: http://192.168.0.10:3000/api)
const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 처리
      console.log('Unauthorized - token expired');
    }
    return Promise.reject(error);
  }
);

