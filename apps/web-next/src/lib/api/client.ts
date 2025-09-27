import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';

export class ApiClient {
  private baseUrl: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:3002/api'
  ) {
    this.baseUrl = baseUrl;
  }

  // eslint-disable-next-line class-methods-use-this
  private async getAuthToken(): Promise<string | null> {
    // Try server-side session first
    try {
      const session = await getServerSession(authOptions);
      return (session as { accessToken?: string })?.accessToken || null;
    } catch {
      // Client-side fallback
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        return token;
      }
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = await this.getAuthToken();

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
