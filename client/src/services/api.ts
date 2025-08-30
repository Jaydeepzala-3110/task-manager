
const API_BASE_URL = 'http://localhost:4000/api';

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

      const token = localStorage.getItem('token');
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
    
    return this.request<{ tasks: any[]; meta: any }>(`/task/list?${queryParams}`);
  }

  async createTask(taskData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/task/create', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, taskData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/task/update/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/task/delete/${taskId}`, {
      method: 'DELETE',
    });
  }

  async getStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/stats/overview');
  }

  async getUserStats(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/stats/user/${userId}`);
  }

  async getTaskStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/stats/task');
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/me');
  }
}

export const apiService = new ApiService();
export default apiService;
