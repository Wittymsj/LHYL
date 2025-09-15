import apiService, { ApiResponse } from './api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserProfile
} from '../../types/api';

export class AuthService {
  // 用户登录
  async login(phone: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const request: LoginRequest = { phone, password };
    const response = await apiService.post<AuthResponse>('/v1/auth/login', request);

    if (response.code === 200 && response.data) {
      apiService.setAuth(response.data);
    }

    return response;
  }

  // 用户注册
  async register(phone: string, password: string, verifyCode: string, nickname?: string): Promise<ApiResponse<AuthResponse>> {
    const request: RegisterRequest = { phone, password, verifyCode, nickname };
    const response = await apiService.post<AuthResponse>('/v1/auth/register', request);

    if (response.code === 200 && response.data) {
      apiService.setAuth(response.data);
    }

    return response;
  }

  // 用户登出
  logout(): void {
    apiService.clearAuth();
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  // 获取当前用户信息
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 验证验证码
  async verifyCode(phone: string, code: string): Promise<ApiResponse<{ valid: boolean }>> {
    return await apiService.post<{ valid: boolean }>('/v1/auth/verify-code', { phone, code });
  }

  // 发送验证码
  async sendVerifyCode(phone: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/auth/send-code', { phone });
  }

  // 刷新Token
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('没有刷新令牌');
    }

    const response = await apiService.post<AuthResponse>('/v1/auth/refresh', refreshToken);
    if (response.code === 200 && response.data) {
      apiService.setAuth(response.data);
    }

    return response;
  }

  // 重置密码
  async resetPassword(phone: string, code: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/auth/reset-password', {
      phone,
      code,
      newPassword
    });
  }

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/auth/change-password', {
      oldPassword,
      newPassword
    });
  }

  // 检查Token有效性
  async validateToken(): Promise<boolean> {
    try {
      const response = await apiService.get<User>('/v1/auth/validate');
      return response.code === 200;
    } catch (error) {
      return false;
    }
  }

  // 获取用户权限信息
  async getUserPermissions(): Promise<ApiResponse<{ permissions: string[] }>> {
    return await apiService.get<{ permissions: string[] }>('/v1/auth/permissions');
  }

  // 第三方登录
  async socialLogin(provider: string, token: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>('/v1/auth/social', {
      provider,
      token
    });

    if (response.code === 200 && response.data) {
      apiService.setAuth(response.data);
    }

    return response;
  }

  // 获取用户认证列表（管理员功能）
  async getAuthUsers(): Promise<ApiResponse<any[]>> {
    return await apiService.get<any[]>('/admin/organizer-applications');
  }

  // 审核通过用户认证（管理员功能）
  async approveUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/admin/organizer-applications/${userId}/review`, {
      status: 'approved',
      comment: '认证通过'
    });
  }

  // 拒绝用户认证（管理员功能）
  async rejectUser(userId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/admin/organizer-applications/${userId}/review`, {
      status: 'rejected',
      comment: reason
    });
  }

  // 申请主办方认证
  async submitOrganizerAuth(authData: {
    type: string;
    organizerName: string;
    contactName: string;
    contactPhone: string;
    email?: string;
    description?: string;
    address?: string;
    licenseNumber?: string;
    documents?: any[];
  }): Promise<ApiResponse<{ message: string }>> {
    // 构建FormData用于文件上传
    const formData = new FormData();

    formData.append('organization_name', authData.organizerName);
    formData.append('contact_person', authData.contactName);
    formData.append('contact_phone', authData.contactPhone);

    if (authData.address) {
      formData.append('address', authData.address);
    }

    if (authData.description) {
      formData.append('description', authData.description);
    }

    // 如果有文件，添加到FormData
    if (authData.documents && authData.documents.length > 0) {
      // 假设第一个文件是营业执照
      const businessLicense = authData.documents[0];
      if (businessLicense && businessLicense.file) {
        formData.append('business_license', businessLicense.file);
      }

      // 其他文件作为认证材料
      authData.documents.slice(1).forEach((doc, index) => {
        if (doc && doc.file) {
          formData.append(`certification_documents_${index}`, doc.file);
        }
      });
    }

    const response = await apiService.post<{ message: string }>('/organizers/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response;
  }
}

export const authService = new AuthService();
export default authService;