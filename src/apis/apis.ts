import axios from "axios";

export const KAKAO_TOKEN_API = axios.create({
    baseURL: "https://kauth.kakao.com",
    headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
  })