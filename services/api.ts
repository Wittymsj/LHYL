import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  Activity,
  Registration,
  ActivityCreateRequest,
  RegistrationRequest,
  ActivityQueryParams,
  RegistrationQueryParams,
  UserProfileRequest,
  PageResponse
} from '../../types/api';

class ApiService {
  private baseURL: string;
  private uploadURL: string;
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // 开发环境配置
    this.baseURL = 'http://localhost:5535/api';
    this.uploadURL = 'http://localhost:5535/uploads';

    // 从本地存储获取token
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // 通用请求方法
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestInit
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers
    };

    // 添加认证头
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const requestConfig: RequestInit = {
      method,
      headers,
      ...config
    };

    if (data && method !== 'GET') {
      requestConfig.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, requestConfig);

      // 处理401错误（Token过期）
      if (response.status === 401) {
        const refreshed = await this.refreshTokenAsync();
        if (refreshed) {
          // 重试原请求
          headers['Authorization'] = `Bearer ${this.token}`;
          return this.request(method, url, data, { ...config, headers });
        } else {
          // Token刷新失败，清除本地存储
          this.clearAuth();
          throw new Error('登录已过期，请重新登录');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // GET请求
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>('GET', url + searchParams);
  }

  // POST请求
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  // PUT请求
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  // DELETE请求
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }

  // 文件上传
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('响应解析失败'));
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('网络错误'));
      };

      xhr.open('POST', `${this.baseURL}${url}`, true);
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.send(formData);
    });
  }

  // Token刷新
  private async refreshTokenAsync(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.refreshToken)
      });

      if (response.ok) {
        const data: ApiResponse<AuthResponse> = await response.json();
        this.setAuth(data.data);
        return true;
      }
    } catch (error) {
      console.error('Token刷新失败:', error);
    }

    return false;
  }

  // 设置认证信息
  setAuth(auth: AuthResponse) {
    this.token = auth.token;
    this.refreshToken = auth.refreshToken;
    localStorage.setItem('token', auth.token);
    localStorage.setItem('refreshToken', auth.refreshToken);
  }

  // 清除认证信息
  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  // 获取上传文件URL
  getUploadUrl(path: string): string {
    return `${this.uploadURL}${path}`;
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;