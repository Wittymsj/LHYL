import apiService from './api';
import { ApiResponse } from '../../types/api';

export interface UploadOptions {
  maxSize?: number; // 最大文件大小（字节）
  allowedTypes?: string[]; // 允许的文件类型
  onProgress?: (progress: number) => void; // 上传进度回调
  onBeforeUpload?: (file: File) => boolean; // 上传前验证
  onSuccess?: (response: ApiResponse<any>) => void; // 上传成功回调
  onError?: (error: Error) => void; // 上传错误回调
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export class UploadService {
  // 默认配置
  private defaultOptions: UploadOptions = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    onProgress: undefined,
    onBeforeUpload: undefined,
    onSuccess: undefined,
    onError: undefined
  };

  // 验证文件
  private validateFile(file: File, options: UploadOptions): { valid: boolean; error?: string } {
    // 检查文件大小
    if (options.maxSize && file.size > options.maxSize) {
      return {
        valid: false,
        error: `文件大小不能超过 ${Math.round(options.maxSize / 1024 / 1024)}MB`
      };
    }

    // 检查文件类型
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `不支持的文件类型: ${file.type}`
      };
    }

    return { valid: true };
  }

  // 上传文件
  async uploadFile(
    file: File,
    type: 'avatar' | 'activity' | 'license' | 'idcard' | 'other',
    options: UploadOptions = {}
  ): Promise<ApiResponse<UploadResult>> {
    const uploadOptions = { ...this.defaultOptions, ...options };

    // 上传前验证
    if (uploadOptions.onBeforeUpload) {
      const shouldUpload = uploadOptions.onBeforeUpload(file);
      if (!shouldUpload) {
        throw new Error('上传被取消');
      }
    }

    // 验证文件
    const validation = this.validateFile(file, uploadOptions);
    if (!validation.valid) {
      throw new Error(validation.error || '文件验证失败');
    }

    try {
      const response = await apiService.upload<UploadResult>(
        `/v1/upload/${type}`,
        file,
        uploadOptions.onProgress
      );

      if (uploadOptions.onSuccess) {
        uploadOptions.onSuccess(response);
      }

      return response;
    } catch (error) {
      if (uploadOptions.onError) {
        uploadOptions.onError(error as Error);
      }
      throw error;
    }
  }

  // 上传头像
  async uploadAvatar(
    file: File,
    options: UploadOptions = {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
  ): Promise<ApiResponse<UploadResult>> {
    return await this.uploadFile(file, 'avatar', options);
  }

  // 上传活动图片
  async uploadActivityImage(
    file: File,
    options: UploadOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    }
  ): Promise<ApiResponse<UploadResult>> {
    return await this.uploadFile(file, 'activity', options);
  }

  // 上传营业执照
  async uploadLicense(
    file: File,
    options: UploadOptions = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
    }
  ): Promise<ApiResponse<UploadResult>> {
    return await this.uploadFile(file, 'license', options);
  }

  // 上传身份证
  async uploadIdCard(
    file: File,
    options: UploadOptions = {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png']
    }
  ): Promise<ApiResponse<UploadResult>> {
    return await this.uploadFile(file, 'idcard', options);
  }

  // 上传其他文件
  async uploadOtherFile(
    file: File,
    options: UploadOptions = {
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    }
  ): Promise<ApiResponse<UploadResult>> {
    return await this.uploadFile(file, 'other', options);
  }

  // 批量上传文件
  async uploadMultipleFiles(
    files: File[],
    type: 'avatar' | 'activity' | 'license' | 'idcard' | 'other',
    options: UploadOptions = {}
  ): Promise<ApiResponse<UploadResult>[]> {
    const uploadOptions = { ...this.defaultOptions, ...options };
    const results: ApiResponse<UploadResult>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadFile(file, type, {
          ...uploadOptions,
          onProgress: (progress) => {
            if (uploadOptions.onProgress) {
              // 计算总体进度
              const overallProgress = ((i + progress / 100) / files.length) * 100;
              uploadOptions.onProgress(overallProgress);
            }
          }
        });
        results.push(result);
      } catch (error) {
        if (uploadOptions.onError) {
          uploadOptions.onError(error as Error);
        }
        // 继续上传其他文件
        continue;
      }
    }

    return results;
  }

  // 压缩图片
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('无法创建画布'));
            return;
          }

          // 计算压缩后的尺寸
          let width = img.width;
          let height = img.height;
          const maxSize = 1920; // 最大宽度或高度

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          // 绘制压缩后的图片
          ctx.drawImage(img, 0, 0, width, height);

          // 转换为Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('图片压缩失败'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });

              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  }

  // 获取文件URL
  getFileUrl(path: string): string {
    return apiService.getUploadUrl(path);
  }

  // 删除文件
  async deleteFile(fileUrl: string): Promise<ApiResponse<{ message: string }>> {
    // 从URL中提取文件路径
    const url = new URL(fileUrl);
    const path = url.pathname.replace('/uploads', '');

    return await apiService.delete<{ message: string }>(`/v1/upload${path}`);
  }

  // 检查文件是否存在
  async checkFileExists(fileUrl: string): Promise<ApiResponse<{ exists: boolean }>> {
    const url = new URL(fileUrl);
    const path = url.pathname.replace('/uploads', '');

    return await apiService.get<{ exists: boolean }>(`/v1/upload/check${path}`);
  }
}

export const uploadService = new UploadService();
export default uploadService;