// API service for future integration with backend
// This file will contain all the API calls to your backend controllers

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // User Management (from user.controller.ts)
  async getUsers(params?: {
    page?: number;
    limit?: number;
    username?: string;
    email?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<{ users: any[]; meta: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    
    return this.request<{ users: any[]; meta: any }>(`/users?${queryParams}`);
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Task Management (from task.controller.ts)
  async getTasks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    assignee?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
  }): Promise<ApiResponse<{ tasks: any[]; meta: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    
    return this.request<{ tasks: any[]; meta: any }>(`/tasks?${queryParams}`);
  }

  async createTask(taskData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, taskData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Statistics (from stats.controller.ts)
  async getOverviewStats(): Promise<ApiResponse<{
    byStatus: any[];
    byPriority: any[];
    overdue: number;
  }>> {
    return this.request<{
      byStatus: any[];
      byPriority: any[];
      overdue: number;
    }>('/stats/overview');
  }

  // Authentication (from auth.controller.ts)
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/me');
  }
}

export const apiService = new ApiService();
export default apiService;
