// API响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户基础信息
export interface User {
  id: number;
  phone: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string;
  updatedAt: string;
}

// 用户详细信息
export interface UserProfile {
  id: number;
  phone: string;
  nickname?: string;
  bio?: string;
  gender?: '男' | '女' | '保密';
  birthday?: string;
  address?: string;
  bloodType?: string;
  email?: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// 活动信息
export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  fee: number;
  status: string;
  approvalStatus: string;
  images: string[];
  organizer: {
    id: number;
    nickname: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// 报名信息
export interface Registration {
  id: number;
  activityId: number;
  userId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  notes?: string;
  activity: Activity;
  user: UserProfile;
  createdAt: string;
  updatedAt: string;
}

// 认证相关类型
export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  verifyCode: string;
  nickname?: string;
}

// 活动查询参数
export interface ActivityQueryParams {
  page?: number;
  size?: number;
  category?: string;
  status?: string;
  organizerId?: number;
  keyword?: string;
}

// 报名请求
export interface RegistrationRequest {
  activityId: number;
  notes?: string;
}

// 报名查询参数
export interface RegistrationQueryParams {
  page?: number;
  size?: number;
  status?: string;
}

// 活动创建请求
export interface ActivityCreateRequest {
  title: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  fee: number;
  images?: string[];
}

// 用户资料更新请求
export interface UserProfileRequest {
  nickname?: string;
  bio?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  bloodType?: string;
  email?: string;
}

// 分页响应
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}