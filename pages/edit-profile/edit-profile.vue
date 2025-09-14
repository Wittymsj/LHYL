<template>
  <view class="edit-profile">
    <!-- 滚动内容区域 -->
    <scroll-view class="scroll-content" scroll-y enhanced="true" show-scrollbar="false">
      <!-- 头像卡片 -->
      <view class="profile-card">
        <view class="avatar-section">
          <view class="avatar-container">
            <view class="avatar-wrapper" @click="uploadAvatar">
              <image
                v-if="profileData.avatar"
                :src="profileData.avatar"
                class="avatar-image"
                mode="aspectFill"
              />
              <view v-else class="avatar-placeholder">
                <text class="avatar-icon">👤</text>
              </view>
              <view class="avatar-overlay">
                <text class="camera-icon">📷</text>
              </view>
            </view>
          </view>
          <view class="nickname-section">
            <input
              type="text"
              class="nickname-input"
              placeholder="输入昵称"
              v-model="profileData.nickname"
              placeholder-class="placeholder-text"
            />
          </view>
        </view>
      </view>

      <!-- 基本信息卡片 -->
      <view class="info-card">
        <view class="card-header">
          <view class="card-title">基本信息</view>
          <view class="card-subtitle">请填写您的个人基本信息</view>
        </view>

        <view class="form-grid">
          <!-- 姓名 -->
          <view class="form-field">
            <view class="field-label">
              姓名 <text class="required">*</text>
            </view>
            <view class="input-wrapper" :class="{ 'error': errors.name }">
              <input
                type="text"
                class="form-input"
                placeholder="请输入姓名"
                v-model="profileData.name"
                @blur="validateField('name')"
                placeholder-class="placeholder-text"
              />
            </view>
            <text v-if="errors.name" class="error-text">{{ errors.name }}</text>
          </view>

          <!-- 联系电话 -->
          <view class="form-field">
            <view class="field-label">
              联系电话 <text class="required">*</text>
            </view>
            <view class="input-wrapper" :class="{ 'error': errors.phone }">
              <input
                type="tel"
                class="form-input"
                placeholder="请输入手机号码"
                v-model="profileData.phone"
                @blur="validateField('phone')"
                placeholder-class="placeholder-text"
              />
            </view>
            <text v-if="errors.phone" class="error-text">{{ errors.phone }}</text>
          </view>

          <!-- 微信号 -->
          <view class="form-field">
            <view class="field-label">微信号</view>
            <view class="input-wrapper">
              <input
                type="text"
                class="form-input"
                placeholder="请输入微信号"
                v-model="profileData.wechat"
                placeholder-class="placeholder-text"
              />
            </view>
          </view>

          <!-- 性别 -->
          <view class="form-field">
            <view class="field-label">性别</view>
            <view class="radio-group">
              <view
                v-for="option in genderOptions"
                :key="option.value"
                class="radio-option"
                :class="{ 'active': profileData.gender === option.value }"
                @click="onGenderChange(option.value)"
              >
                <view class="radio-dot"></view>
                <text class="radio-text">{{ option.label }}</text>
              </view>
            </view>
          </view>

          <!-- 所在城市 -->
          <view class="form-field">
            <view class="field-label">所在城市</view>
            <view class="input-wrapper">
              <input
                type="text"
                class="form-input"
                placeholder="请输入所在城市"
                v-model="profileData.city"
                placeholder-class="placeholder-text"
              />
            </view>
          </view>

          <!-- 年龄 -->
          <view class="form-field">
            <view class="field-label">年龄</view>
            <view class="input-wrapper">
              <input
                type="number"
                class="form-input"
                placeholder="请输入年龄"
                v-model="profileData.age"
                placeholder-class="placeholder-text"
              />
            </view>
          </view>

          <!-- 学历 -->
          <view class="form-field">
            <view class="field-label">学历</view>
            <view class="input-wrapper">
              <picker
                @change="onEducationChange"
                :value="educationIndex"
                :range="educationOptions"
                class="form-picker"
              >
                <view class="picker-text">
                  {{ profileData.education || '请选择学历' }}
                </view>
              </picker>
            </view>
          </view>

          <!-- 职业 -->
          <view class="form-field">
            <view class="field-label">职业</view>
            <view class="input-wrapper">
              <input
                type="text"
                class="form-input"
                placeholder="请输入职业"
                v-model="profileData.occupation"
                placeholder-class="placeholder-text"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 艺术团经历卡片 -->
      <view class="art-card">
        <view class="card-header">
          <view class="card-title">艺术团经历</view>
          <view class="card-subtitle">添加您的艺术团相关经历</view>
        </view>

        <view class="art-groups-list">
          <view
            v-for="(artGroup, index) in profileData.artGroups"
            :key="artGroup.id"
            class="art-group-card"
          >
            <view class="art-group-header">
              <view class="art-group-title">
                <text class="title-number">{{ index + 1 }}</text>
                <text class="title-text">艺术团</text>
              </view>
              <view class="remove-btn" @click="removeArtGroup(artGroup.id)">
                <text class="remove-icon">×</text>
              </view>
            </view>

            <view class="art-group-form">
              <view class="art-field">
                <view class="field-label">艺术团名称</view>
                <view class="input-wrapper">
                  <input
                    type="text"
                    placeholder="请输入艺术团名称"
                    v-model="artGroup.name"
                    class="art-input"
                    placeholder-class="placeholder-text"
                  />
                </view>
              </view>

              <view class="art-field">
                <view class="field-label">艺术团职务</view>
                <view class="input-wrapper">
                  <input
                    type="text"
                    placeholder="请输入艺术团职务"
                    v-model="artGroup.position"
                    class="art-input"
                    placeholder-class="placeholder-text"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 添加艺术团按钮 -->
        <view class="add-art-group" @click="addArtGroup">
          <view class="add-icon-wrapper">
            <text class="add-icon">+</text>
          </view>
          <text class="add-text">添加艺术团经历</text>
        </view>
      </view>

      <!-- 底部间距 -->
      <view class="bottom-spacing"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="button-container">
        <button
          class="save-button"
          @click="saveProfile"
          :disabled="isSaving"
          :class="{ 'loading': isSaving }"
        >
          <text v-if="!isSaving" class="button-text">保存修改</text>
          <view v-else class="loading-spinner">
            <view class="spinner-dot"></view>
            <view class="spinner-dot"></view>
            <view class="spinner-dot"></view>
          </view>
        </button>
      </view>
    </view>

    <!-- 成功提示 -->
    <view v-if="showSuccessToast" class="success-toast">
      <view class="toast-content">
        <text class="toast-icon">✓</text>
        <text class="toast-text">保存成功！</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EditProfile',
  data() {
    return {
      profileData: {
        nickname: '',
        name: '',
        phone: '',
        wechat: '',
        gender: '',
        city: '',
        age: '',
        education: '',
        occupation: '',
        avatar: '',
        artGroups: []
      },
      errors: {},
      isSaving: false,
      showSuccessToast: false,
      artGroupCounter: 0,
      genderOptions: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' }
      ],
      educationOptions: ['', '小学', '初中', '高中', '大专', '本科', '硕士', '博士']
    }
  },
  computed: {
    educationIndex() {
      return this.educationOptions.indexOf(this.profileData.education)
    }
  },
  onLoad() {
    this.loadFormData()
  },
  methods: {
    uploadAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.profileData.avatar = tempFilePath
        }
      })
    },

    addArtGroup() {
      this.artGroupCounter++
      const newArtGroup = {
        id: this.artGroupCounter,
        name: '',
        position: ''
      }
      this.profileData.artGroups.push(newArtGroup)
    },

    removeArtGroup(id) {
      const index = this.profileData.artGroups.findIndex(group => group.id === id)
      if (index > -1) {
        this.profileData.artGroups.splice(index, 1)
      }
    },

    onGenderChange(value) {
      this.profileData.gender = value
    },

    onEducationChange(e) {
      this.profileData.education = this.educationOptions[e.detail.value]
    },

  
    validateField(field) {
      this.errors = { ...this.errors }

      switch (field) {
        case 'name':
          if (!this.profileData.name.trim()) {
            this.errors.name = '请输入姓名'
          } else {
            delete this.errors.name
          }
          break
        case 'phone':
          const phoneRegex = /^1[3-9]\d{9}$/
          if (!this.profileData.phone.trim()) {
            this.errors.phone = '请输入手机号码'
          } else if (!phoneRegex.test(this.profileData.phone)) {
            this.errors.phone = '请输入正确的手机号码'
          } else {
            delete this.errors.phone
          }
          break
      }
    },

    validateForm() {
      this.validateField('name')
      this.validateField('phone')

      return Object.keys(this.errors).length === 0
    },

    loadFormData() {
      try {
        const savedData = uni.getStorageSync('profileData')
        if (savedData) {
          const data = JSON.parse(savedData)

          // 恢复基本数据
          Object.keys(this.profileData).forEach(key => {
            if (key !== 'artGroups' && data[key] !== undefined) {
              this.profileData[key] = data[key]
            }
          })

          // 恢复艺术团数据
          if (data.artGroups && Array.isArray(data.artGroups)) {
            this.profileData.artGroups = data.artGroups.map(group => ({
              ...group,
              id: ++this.artGroupCounter
            }))
          }

          // 向后兼容：处理旧的艺术团数据格式
          if (data.artGroupName && !data.artGroups) {
            this.addArtGroup()
            setTimeout(() => {
              const lastGroup = this.profileData.artGroups[this.profileData.artGroups.length - 1]
              lastGroup.name = data.artGroupName
              if (data.artGroupPosition) {
                lastGroup.position = data.artGroupPosition
              }
            }, 100)
          }
        }
      } catch (error) {
        console.error('加载表单数据失败:', error)
      }
    },

    async saveProfile() {
      if (!this.validateForm()) {
        return
      }

      this.isSaving = true

      try {
        // 准备保存数据
        const saveData = {
          ...this.profileData,
          lastUpdated: new Date().toISOString()
        }

        // 保存到本地存储
        uni.setStorageSync('profileData', JSON.stringify(saveData))

        // 显示成功提示
        this.showSuccessToast = true
        setTimeout(() => {
          this.showSuccessToast = false
        }, 2000)

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        console.log('个人信息已保存:', saveData)

        // 可选：保存成功后返回上一页
        // setTimeout(() => {
        //   uni.navigateBack()
        // }, 1500)

      } catch (error) {
        console.error('保存失败:', error)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.edit-profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}


/* 滚动内容区域 */
.scroll-content {
  height: calc(100vh - 120rpx);
  padding-bottom: 40rpx;
}

/* 卡片基础样式 */
.profile-card,
.info-card,
.art-card {
  margin: 24rpx;
  background: $uni-bg-color;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-card:hover,
.info-card:hover,
.art-card:hover {
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  transform: translateY(-2rpx);
}

/* 卡片头部 */
.card-header {
  padding: 32rpx 32rpx 24rpx 32rpx;
  border-bottom: 1px solid $uni-border-color;
  background: linear-gradient(135deg, rgba(117, 176, 156, 0.1) 0%, rgba(160, 202, 146, 0.05) 100%);
}

.card-title {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary-cambridge-blue;
  margin-bottom: 8rpx;
}

.card-subtitle {
  font-size: 24rpx;
  color: $uni-text-color-grey;
  line-height: 1.4;
}

/* 头像区域 */
.avatar-section {
  padding: 48rpx;
  text-align: center;
  background: linear-gradient(135deg, $primary-cambridge-blue 0%, $primary-pistachio 100%);
}

.avatar-container {
  margin-bottom: 32rpx;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  width: 200rpx;
  height: 200rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.avatar-wrapper:active {
  transform: scale(0.95);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.avatar-icon {
  font-size: 80rpx;
  color: rgba(255, 255, 255, 0.8);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-icon {
  font-size: 32rpx;
  color: white;
}

.nickname-section {
  margin-top: 24rpx;
}

.nickname-input {
  width: 100%;
  max-width: 400rpx;
  padding: 24rpx 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  color: $primary-cambridge-blue;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;
}

.nickname-input:focus {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.02);
}

/* 表单网格 */
.form-grid {
  padding: 32rpx;
  display: grid;
  gap: 32rpx;
}

/* 表单字段 */
.form-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 28rpx;
  font-weight: 600;
  color: $uni-text-color;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.required {
  color: $uni-color-error;
  font-size: 32rpx;
  font-weight: bold;
}

.input-wrapper {
  position: relative;
  border: 2rpx solid $uni-border-color;
  border-radius: 16rpx;
  transition: all 0.3s ease;
  background: $uni-bg-color;
}

.input-wrapper:focus-within {
  border-color: $primary-cambridge-blue;
  box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1);
  transform: translateY(-2rpx);
}

.input-wrapper.error {
  border-color: $uni-color-error;
  box-shadow: 0 0 0 6rpx rgba(221, 82, 77, 0.1);
}

.form-input,
.form-picker,
.art-input {
  width: 100%;
  padding: 28rpx 32rpx;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  background: transparent;
  color: $uni-text-color;
  text-align: center;
  outline: none;
}

.picker-text {
  color: $uni-text-color;
  font-size: 32rpx;
  text-align: center;
}

.placeholder-text {
  color: $uni-text-color-placeholder;
  font-size: 32rpx;
}

.error-text {
  color: $uni-color-error;
  font-size: 24rpx;
  margin-top: 8rpx;
  margin-left: 8rpx;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 32rpx;
  flex-wrap: wrap;
}

.radio-option {
  flex: 1;
  min-width: 120rpx;
  padding: 20rpx 24rpx;
  border: 2rpx solid $uni-border-color;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  background: $uni-bg-color;
}

.radio-option:hover {
  border-color: $primary-cambridge-blue;
  background: rgba(117, 176, 156, 0.05);
}

.radio-option.active {
  border-color: $primary-cambridge-blue;
  background: $primary-cambridge-blue;
  box-shadow: 0 4rpx 12rpx rgba(117, 176, 156, 0.3);
}

.radio-option.active .radio-text {
  color: white;
}

.radio-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: $uni-border-color;
  transition: all 0.3s ease;
}

.radio-option.active .radio-dot {
  background: white;
  box-shadow: 0 0 0 4rpx rgba(255, 255, 255, 0.3);
}

.radio-text {
  font-size: 28rpx;
  font-weight: 500;
  color: $uni-text-color;
  transition: all 0.3s ease;
}

/* 艺术团卡片 */
.art-groups-list {
  padding: 32rpx;
}

.art-group-card {
  background: linear-gradient(135deg, rgba(117, 176, 156, 0.05) 0%, rgba(160, 202, 146, 0.02) 100%);
  border: 2rpx solid rgba(117, 176, 156, 0.2);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  transition: all 0.3s ease;
}

.art-group-card:hover {
  border-color: $primary-cambridge-blue;
  box-shadow: 0 4rpx 16rpx rgba(117, 176, 156, 0.15);
  transform: translateY(-2rpx);
}

.art-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid rgba(117, 176, 156, 0.2);
}

.art-group-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.title-number {
  width: 40rpx;
  height: 40rpx;
  background: $primary-cambridge-blue;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
}

.title-text {
  font-size: 32rpx;
  font-weight: 700;
  color: $primary-cambridge-blue;
}

.remove-btn {
  width: 48rpx;
  height: 48rpx;
  background: rgba(221, 82, 77, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:active {
  background: rgba(221, 82, 77, 0.2);
  transform: scale(0.9);
}

.remove-icon {
  font-size: 32rpx;
  color: $uni-color-error;
  font-weight: bold;
}

.art-group-form {
  display: grid;
  gap: 24rpx;
}

.art-field {
  display: flex;
  flex-direction: column;
}

/* 添加艺术团按钮 */
.add-art-group {
  margin: 32rpx;
  padding: 32rpx;
  border: 3rpx dashed $primary-cambridge-blue;
  border-radius: 20rpx;
  background: linear-gradient(135deg, rgba(117, 176, 156, 0.05) 0%, rgba(160, 202, 146, 0.02) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-art-group:hover {
  border-color: $primary-pistachio;
  background: linear-gradient(135deg, rgba(117, 176, 156, 0.1) 0%, rgba(160, 202, 146, 0.05) 100%);
  transform: translateY(-2rpx);
}

.add-art-group:active {
  transform: translateY(0);
}

.add-icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  background: $primary-cambridge-blue;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.add-art-group:hover .add-icon-wrapper {
  background: $primary-pistachio;
  transform: scale(1.1);
}

.add-icon {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

.add-text {
  font-size: 32rpx;
  font-weight: 600;
  color: $primary-cambridge-blue;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.button-container {
  width: 100%;
  max-width: 600rpx;
}

.save-button {
  width: 100%;
  padding: 32rpx;
  background: linear-gradient(135deg, $primary-cambridge-blue 0%, $primary-pistachio 100%);
  color: white;
  border: none;
  border-radius: 20rpx;
  font-size: 36rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 24rpx rgba(117, 176, 156, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.save-button:hover:not(.loading) {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 32rpx rgba(117, 176, 156, 0.5);
}

.save-button:active:not(.loading) {
  transform: translateY(0);
}

.save-button.loading {
  background: linear-gradient(135deg, $uni-text-color-grey 0%, $uni-text-color-placeholder 100%);
  box-shadow: none;
}

.button-text {
  position: relative;
  z-index: 1;
}

/* 加载动画 */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.spinner-dot {
  width: 8rpx;
  height: 8rpx;
  background: white;
  border-radius: 50%;
  animation: spinner-bounce 1.4s ease-in-out infinite both;
}

.spinner-dot:nth-child(1) { animation-delay: -0.32s; }
.spinner-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes spinner-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 32rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  animation: slideDown 0.3s ease-out;
}

.toast-content {
  background: linear-gradient(135deg, $primary-cambridge-blue 0%, $primary-pistachio 100%);
  color: white;
  padding: 24rpx 48rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(117, 176, 156, 0.4);
}

.toast-icon {
  font-size: 32rpx;
  font-weight: bold;
}

.toast-text {
  font-size: 32rpx;
  font-weight: 600;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20rpx);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 底部间距 */
.bottom-spacing {
  height: 40rpx;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .scroll-content {
    height: calc(100vh - 140rpx);
  }

  .profile-card,
  .info-card,
  .art-card {
    margin: 16rpx;
    border-radius: 20rpx;
  }

  .card-header {
    padding: 24rpx 24rpx 16rpx 24rpx;
  }

  .form-grid {
    padding: 24rpx;
    gap: 24rpx;
  }

  .art-groups-list {
    padding: 24rpx;
  }

  .radio-group {
    gap: 16rpx;
  }

  .radio-option {
    min-width: 100rpx;
    padding: 16rpx 20rpx;
  }

  .add-art-group {
    margin: 24rpx;
    padding: 24rpx;
  }

  .bottom-bar {
    height: 140rpx;
    padding: 20rpx 24rpx;
  }

  .save-button {
    padding: 28rpx;
    font-size: 32rpx;
  }
}

/* 大屏幕适配 */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: 24rpx;
  }

  .form-field:nth-child(odd) {
    grid-column: 1;
  }

  .form-field:nth-child(even) {
    grid-column: 2;
  }

  .form-field.full-width {
    grid-column: 1 / -1;
  }

  .art-group-form {
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .edit-profile {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  }

  .profile-card,
  .info-card,
  .art-card {
    background: #2d3748;
    border-color: #4a5568;
  }

  .card-title {
    color: #e2e8f0;
  }

  .card-subtitle {
    color: #a0aec0;
  }

  .field-label {
    color: #e2e8f0;
  }

  .input-wrapper {
    background: #1a202c;
    border-color: #4a5568;
  }

  .form-input,
  .form-picker,
  .art-input {
    color: #e2e8f0;
  }

  .placeholder-text {
    color: #a0aec0;
  }

  .radio-option {
    background: #1a202c;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .radio-text {
    color: #e2e8f0;
  }

  .bottom-bar {
    background: rgba(45, 55, 72, 0.95);
    border-color: #4a5568;
  }
}
</style>