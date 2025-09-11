import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

type AuthHeaders = {
  Authorization?: string;
  [key: string]: string | undefined;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (typeof window === 'undefined') return config;
  const session = await getSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;
  if (!token) return config;

  const mergedHeaders: AuthHeaders = {
    ...((config.headers as Record<string, string>) || {}),
    Authorization: `Bearer ${token}`,
  };

  return {
    ...config,
    headers: mergedHeaders,
  } as AxiosRequestConfig;
});
