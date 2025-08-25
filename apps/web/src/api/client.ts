import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AuthTokens } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export class ApiClient {
  private client: AxiosInstance;

  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      config => {
        const token = ApiClient.getAccessToken();
        if (!token) return config;
        return {
          ...config,
          headers: {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${token}`,
          },
        } as typeof config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & {
          retry?: boolean;
        };

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest.retry
        ) {
          originalRequest.retry = true;

          try {
            const tokens = await this.refreshToken();
            if (tokens) {
              ApiClient.setTokens(tokens);
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              return await this.client(originalRequest);
            }
          } catch (refreshError) {
            ApiClient.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<AuthTokens | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const refreshToken = ApiClient.getRefreshToken();
          if (!refreshToken) {
            reject(new Error('No refresh token available'));
            return;
          }

          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { tokens } = response.data.data;
          resolve(tokens);
        } catch (error) {
          reject(error);
        } finally {
          this.refreshPromise = null;
        }
      })();
    });

    return this.refreshPromise;
  }

  private static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private static setTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private static clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Public methods
  public static setAuthTokens(tokens: AuthTokens) {
    ApiClient.setTokens(tokens);
  }

  public static clearAuthTokens() {
    ApiClient.clearTokens();
  }

  public get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
