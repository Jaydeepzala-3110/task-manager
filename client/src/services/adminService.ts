
const API_BASE_URL = 'https://api.taskify.dpdns.org/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class AdminService {
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

  async getDashboardOverview(): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/dashboard/overview');
  }

  async getAllTasksForAdmin(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    assignee?: string;
    createdBy?: string;
  }): Promise<ApiResponse<{ tasks: any[]; meta: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    
    return this.request<{ tasks: any[]; meta: any }>(`/admin/tasks?${queryParams}`);
  }

  async assignTaskToUser(taskId: string, assigneeId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/tasks/${taskId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assigneeId }),
    });
  }

  async getAllUsersForAdmin(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<{ users: any[]; meta: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    
    return this.request<{ users: any[]; meta: any }>(`/admin/users?${queryParams}`);
  }

  async updateUserRoleAdmin(userId: string, role: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUserAdmin(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUserAdmin(userId: string, userData: { username?: string; email?: string; status?: string }): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async createUserAdmin(userData: { username: string; email: string; password: string; role: string; status: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export const adminService = new AdminService();
export default adminService;
