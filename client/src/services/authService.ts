import { type LoginCredentials, type RegisterData, type AuthResponse } from '../store/authSlice';

const API_BASE_URL = 'http://localhost:4000/api';

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<{ data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      await this.request('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    return this.request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authService = new AuthService();
