import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://12-adboost-api.vercel.app",
  headers: { "Content-Type": "application/json" },
  timeout: 120000
});
