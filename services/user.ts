import apiService from './api';
import {
  ApiResponse,
  UserProfile,
  UserProfileRequest,
  PageResponse
} from '../../types/api';

export class UserService {
  // 获取用户资料
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return await apiService.get<UserProfile>('/v1/users/profile');
  }

  // 更新用户资料
  async updateProfile(data: UserProfileRequest): Promise<ApiResponse<UserProfile>> {
    return await apiService.put<UserProfile>('/v1/users/profile', data);
  }

  // 上传头像
  async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ avatarUrl: string }>> {
    return await apiService.upload<{ avatarUrl: string }>('/v1/users/avatar', file, onProgress);
  }

  // 删除头像
  async deleteAvatar(): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>('/v1/users/avatar');
  }

  // 更新手机号码
  async updatePhone(newPhone: string, verifyCode: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/users/phone', {
      newPhone,
      verifyCode
    });
  }

  // 更新邮箱
  async updateEmail(email: string, verifyCode: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/users/email', {
      email,
      verifyCode
    });
  }

  // 获取用户活动历史
  async getActivityHistory(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>('/v1/users/activities', params);
  }

  // 获取用户收藏活动
  async getFavoriteActivities(params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>('/v1/users/favorites', params);
  }

  // 收藏活动
  async favoriteActivity(activityId: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/users/favorites', { activityId });
  }

  // 取消收藏活动
  async unfavoriteActivity(activityId: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(`/v1/users/favorites/${activityId}`);
  }

  // 获取用户设置
  async getSettings(): Promise<ApiResponse<any>> {
    return await apiService.get<any>('/v1/users/settings');
  }

  // 更新用户设置
  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return await apiService.put<any>('/v1/users/settings', settings);
  }

  // 获取用户统计数据
  async getUserStats(): Promise<ApiResponse<{
    totalActivities: number;
    completedActivities: number;
    canceledActivities: number;
    totalHours: number;
    joinedGroups: number;
  }>> {
    return await apiService.get<{
      totalActivities: number;
      completedActivities: number;
      canceledActivities: number;
      totalHours: number;
      joinedGroups: number;
    }>('/v1/users/stats');
  }

  // 获取用户证书
  async getCertificates(): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>('/v1/users/certificates');
  }

  // 获取用户通知
  async getNotifications(params?: {
    page?: number;
    size?: number;
    type?: string;
    read?: boolean;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>('/v1/users/notifications', params);
  }

  // 标记通知为已读
  async markNotificationAsRead(notificationId: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.put<{ message: string }>(`/v1/users/notifications/${notificationId}/read`);
  }

  // 标记所有通知为已读
  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return await apiService.put<{ message: string }>('/v1/users/notifications/read-all');
  }

  // 删除通知
  async deleteNotification(notificationId: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(`/v1/users/notifications/${notificationId}`);
  }

  // 获取用户反馈
  async getFeedback(params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>('/v1/users/feedback');
  }

  // 提交反馈
  async submitFeedback(feedback: {
    type: string;
    content: string;
    attachments?: string[];
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/users/feedback', feedback);
  }

  // 获取用户积分
  async getUserPoints(): Promise<ApiResponse<{
    totalPoints: number;
    availablePoints: number;
    usedPoints: number;
    history: Array<{
      id: number;
      type: string;
      points: number;
      description: string;
      createdAt: string;
    }>;
  }>> {
    return await apiService.get<{
      totalPoints: number;
      availablePoints: number;
      usedPoints: number;
      history: Array<{
        id: number;
        type: string;
        points: number;
        description: string;
        createdAt: string;
      }>;
    }>('/v1/users/points');
  }
}

export const userService = new UserService();
export default userService;