import { type LoginCredentials, type RegisterData, type AuthResponse } from '../store/authSlice';

const API_BASE_URL = 'https://api.taskify.dpdns.org/api';

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
    
    // Return the data directly since the API response structure is { data: { accessToken, userData } }
    return {
      accessToken: response.data.accessToken,
      userData: response.data.userData
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Return the data directly since the API response structure is { data: { accessToken, userData } }
    return {
      accessToken: response.data.accessToken,
      userData: response.data.userData
    };
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
