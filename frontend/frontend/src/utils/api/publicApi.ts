import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

export default api;

export const register = (email: string, password1: string, password2: string) =>
  api.post("api/auth/registration/", { email, password1, password2 });

export const login = (email: string, password: string) =>
  api.post("api/auth/login/", { email, password, method: "password" });

export const requestOTP = (email: string) =>
  api.post("api/auth/request-otp/", { email });

export const loginWithOTP = (email: string, otp: string) =>
  api.post("api/auth/login/", { email, otp, method: "otp" });
