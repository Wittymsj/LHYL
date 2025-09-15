// 统一导出所有服务
export { default as apiService } from './api';
export { default as authService } from './auth';
export { default as userService } from './user';
export { default as activityService } from './activity';
export { default as registrationService } from './registration';
export { default as uploadService } from './upload';

// 类型定义导出
export * from '../../types/api';

// 服务实例导出
export {
  apiService,
  authService,
  userService,
  activityService,
  registrationService,
  uploadService
};

// 便捷的API调用函数
export const api = {
  // 认证相关
  auth: {
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
    isAuthenticated: authService.isAuthenticated.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    validateToken: authService.validateToken.bind(authService)
  },

  // 用户相关
  user: {
    getProfile: userService.getProfile.bind(userService),
    updateProfile: userService.updateProfile.bind(userService),
    uploadAvatar: userService.uploadAvatar.bind(userService),
    deleteAvatar: userService.deleteAvatar.bind(userService),
    getStats: userService.getUserStats.bind(userService),
    getActivityHistory: userService.getActivityHistory.bind(userService)
  },

  // 活动相关
  activity: {
    getActivities: activityService.getActivities.bind(activityService),
    getActivity: activityService.getActivity.bind(activityService),
    createActivity: activityService.createActivity.bind(activityService),
    updateActivity: activityService.updateActivity.bind(activityService),
    deleteActivity: activityService.deleteActivity.bind(activityService),
    getRecommended: activityService.getRecommendedActivities.bind(activityService),
    search: activityService.searchActivities.bind(activityService)
  },

  // 报名相关
  registration: {
    register: registrationService.register.bind(registrationService),
    cancel: registrationService.cancelRegistration.bind(registrationService),
    getMyRegistrations: registrationService.getMyRegistrations.bind(registrationService),
    getRegistrationDetail: registrationService.getRegistrationDetail.bind(registrationService)
  },

  // 文件上传相关
  upload: {
    uploadFile: uploadService.uploadFile.bind(uploadService),
    uploadAvatar: uploadService.uploadAvatar.bind(uploadService),
    uploadActivityImage: uploadService.uploadActivityImage.bind(uploadService),
    uploadLicense: uploadService.uploadLicense.bind(uploadService),
    uploadIdCard: uploadService.uploadIdCard.bind(uploadService)
  }
};

// 默认导出
export default api;