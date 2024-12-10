// src/axiosConfig.js
import axios from 'axios';

// Axios 기본 설정
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Bearer 토큰 형식으로 설정
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
