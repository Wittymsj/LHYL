import apiService from './api';
import {
  ApiResponse,
  Registration,
  RegistrationRequest,
  RegistrationQueryParams,
  PageResponse
} from '../../types/api';

export class RegistrationService {
  // 活动报名
  async register(data: RegistrationRequest): Promise<ApiResponse<Registration>> {
    return await apiService.post<Registration>('/v1/registrations', data);
  }

  // 取消报名
  async cancelRegistration(registrationId: number, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/registrations/${registrationId}/cancel`, { reason });
  }

  // 获取用户报名记录
  async getMyRegistrations(params?: RegistrationQueryParams): Promise<ApiResponse<PageResponse<Registration>>> {
    return await apiService.get<PageResponse<Registration>>('/v1/registrations/my', params);
  }

  // 获取活动报名记录
  async getActivityRegistrations(activityId: number, params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<ApiResponse<PageResponse<Registration>>> {
    return await apiService.get<PageResponse<Registration>>(`/v1/registrations/activity/${activityId}`, params);
  }

  // 获取报名详情
  async getRegistrationDetail(registrationId: number): Promise<ApiResponse<Registration>> {
    return await apiService.get<Registration>(`/v1/registrations/${registrationId}`);
  }

  // 更新报名信息
  async updateRegistration(registrationId: number, data: {
    notes?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    healthInfo?: string;
  }): Promise<ApiResponse<Registration>> {
    return await apiService.put<Registration>(`/v1/registrations/${registrationId}`, data);
  }

  // 审核报名（主办方权限）
  async reviewRegistration(registrationId: number, data: {
    status: 'APPROVED' | 'REJECTED';
    reason?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/registrations/${registrationId}/review`, data);
  }

  // 批量审核报名
  async batchReviewRegistrations(data: {
    registrationIds: number[];
    status: 'APPROVED' | 'REJECTED';
    reason?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/v1/registrations/batch-review', data);
  }

  // 获取报名统计
  async getRegistrationStats(activityId: number): Promise<ApiResponse<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    canceled: number;
  }>> {
    return await apiService.get<{
      total: number;
      approved: number;
      pending: number;
      rejected: number;
      canceled: number;
    }>(`/v1/registrations/activity/${activityId}/stats`);
  }

  // 导出报名名单
  async exportRegistrationList(activityId: number, format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    const response = await fetch(`${apiService['baseURL']}/v1/registrations/activity/${activityId}/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('导出失败');
    }

    return await response.blob();
  }

  // 获取等待列表
  async getWaitingList(activityId: number, params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>(`/v1/registrations/activity/${activityId}/waiting-list`, params);
  }

  // 从等待列表录取
  async admitFromWaitingList(activityId: number, userId: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/registrations/activity/${activityId}/admit`, { userId });
  }

  // 批量从等待列表录取
  async batchAdmitFromWaitingList(activityId: number, userIds: number[]): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/registrations/activity/${activityId}/batch-admit`, { userIds });
  }

  // 检查是否可以报名
  async canRegister(activityId: number): Promise<ApiResponse<{
    canRegister: boolean;
    reason?: string;
    waitingListPosition?: number;
  }>> {
    return await apiService.get<{
      canRegister: boolean;
      reason?: string;
      waitingListPosition?: number;
    }>(`/v1/registrations/can-register/${activityId}`);
  }

  // 获取报名表单字段
  async getRegistrationForm(activityId: number): Promise<ApiResponse<{
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'file';
      required: boolean;
      options?: string[];
      validation?: string;
    }>;
  }>> {
    return await apiService.get<{
      fields: Array<{
        name: string;
        label: string;
        type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'file';
        required: boolean;
        options?: string[];
        validation?: string;
      }>;
    }>(`/v1/registrations/form/${activityId}`);
  }

  // 提交报名表单
  async submitRegistrationForm(registrationId: number, formData: Record<string, any>): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/registrations/${registrationId}/form`, formData);
  }

  // 获取报名历史
  async getRegistrationHistory(params?: {
    page?: number;
    size?: number;
    activityId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PageResponse<Registration>>> {
    return await apiService.get<PageResponse<Registration>>('/v1/registrations/history', params);
  }

  // 获取推荐活动（基于用户历史报名）
  async getRecommendedActivities(params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>('/v1/registrations/recommended-activities', params);
  }

  // 获取报名提醒设置
  async getReminderSettings(): Promise<ApiResponse<{
    emailReminders: boolean;
    smsReminders: boolean;
    pushReminders: boolean;
    reminderHours: number;
  }>> {
    return await apiService.get<{
      emailReminders: boolean;
      smsReminders: boolean;
      pushReminders: boolean;
      reminderHours: number;
    }>('/v1/registrations/reminder-settings');
  }

  // 更新报名提醒设置
  async updateReminderSettings(settings: {
    emailReminders?: boolean;
    smsReminders?: boolean;
    pushReminders?: boolean;
    reminderHours?: number;
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiService.put<{ message: string }>('/v1/registrations/reminder-settings', settings);
  }

  // 发送报名提醒
  async sendReminder(registrationId: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/registrations/${registrationId}/send-reminder`);
  }
}

export const registrationService = new RegistrationService();
export default registrationService;