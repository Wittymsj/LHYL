import apiService from './api';
import {
  ApiResponse,
  Activity,
  ActivityCreateRequest,
  ActivityQueryParams,
  PageResponse
} from '../../types/api';

export class ActivityService {
  // 获取活动列表
  async getActivities(params?: ActivityQueryParams): Promise<ApiResponse<PageResponse<Activity>>> {
    return await apiService.get<PageResponse<Activity>>('/v1/activities', params);
  }

  // 获取活动详情
  async getActivity(id: number): Promise<ApiResponse<Activity>> {
    return await apiService.get<Activity>(`/v1/activities/${id}`);
  }

  // 创建活动
  async createActivity(data: ActivityCreateRequest): Promise<ApiResponse<Activity>> {
    return await apiService.post<Activity>('/v1/activities', data);
  }

  // 更新活动
  async updateActivity(id: number, data: Partial<ActivityCreateRequest>): Promise<ApiResponse<Activity>> {
    return await apiService.put<Activity>(`/v1/activities/${id}`, data);
  }

  // 删除活动
  async deleteActivity(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(`/v1/activities/${id}`);
  }

  // 发布活动
  async publishActivity(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/activities/${id}/publish`);
  }

  // 取消活动
  async cancelActivity(id: number, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/activities/${id}/cancel`, { reason });
  }

  // 完成活动
  async completeActivity(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/activities/${id}/complete`);
  }

  // 获取推荐活动
  async getRecommendedActivities(params?: {
    page?: number;
    size?: number;
    category?: string;
  }): Promise<ApiResponse<PageResponse<Activity>>> {
    return await apiService.get<PageResponse<Activity>>('/v1/activities/recommended', params);
  }

  // 获取热门活动
  async getPopularActivities(params?: {
    page?: number;
    size?: number;
    days?: number;
  }): Promise<ApiResponse<PageResponse<Activity>>> {
    return await apiService.get<PageResponse<Activity>>('/v1/activities/popular', params);
  }

  // 获取即将开始的活动
  async getUpcomingActivities(params?: {
    page?: number;
    size?: number;
    days?: number;
  }): Promise<ApiResponse<PageResponse<Activity>>> {
    return await apiService.get<PageResponse<Activity>>('/v1/activities/upcoming', params);
  }

  // 搜索活动
  async searchActivities(params: {
    keyword: string;
    page?: number;
    size?: number;
    category?: string;
    location?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<ApiResponse<PageResponse<Activity>>> {
    return await apiService.get<PageResponse<Activity>>('/v1/activities/search', params);
  }

  // 获取活动分类
  async getCategories(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  }>>> {
    return await apiService.get<Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
    }>>('/v1/activities/categories');
  }

  // 获取活动参与人员
  async getActivityParticipants(activityId: number, params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>(`/v1/activities/${activityId}/participants`, params);
  }

  // 获取活动评论
  async getActivityComments(activityId: number, params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>(`/v1/activities/${activityId}/comments`, params);
  }

  // 添加活动评论
  async addActivityComment(activityId: number, comment: {
    content: string;
    rating?: number;
  }): Promise<ApiResponse<any>> {
    return await apiService.post<any>(`/v1/activities/${activityId}/comments`, comment);
  }

  // 获取活动统计
  async getActivityStats(activityId: number): Promise<ApiResponse<{
    totalParticipants: number;
    completedParticipants: number;
    averageRating: number;
    totalComments: number;
  }>> {
    return await apiService.get<{
      totalParticipants: number;
      completedParticipants: number;
      averageRating: number;
      totalComments: number;
    }>(`/v1/activities/${activityId}/stats`);
  }

  // 获取活动相册
  async getActivityPhotos(activityId: number, params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>(`/v1/activities/${activityId}/photos`, params);
  }

  // 上传活动照片
  async uploadActivityPhotos(activityId: number, files: File[], onProgress?: (progress: number) => void): Promise<ApiResponse<{ urls: string[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

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

      xhr.open('POST', `${apiService['baseURL']}/v1/activities/${activityId}/photos`, true);

      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }

  // 获取活动签到码
  async getActivityCheckInCode(activityId: number): Promise<ApiResponse<{ code: string; expiresAt: string }>> {
    return await apiService.get<{ code: string; expiresAt: string }>(`/v1/activities/${activityId}/check-in-code`);
  }

  // 活动签到
  async checkInActivity(activityId: number, code: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>(`/v1/activities/${activityId}/check-in`, { code });
  }

  // 获取活动签到记录
  async getActivityCheckInRecords(activityId: number, params?: {
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<any>>> {
    return await apiService.get<PageResponse<any>>(`/v1/activities/${activityId}/check-in-records`, params);
  }
}

export const activityService = new ActivityService();
export default activityService;