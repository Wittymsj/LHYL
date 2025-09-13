<template>
  <view class="registration-container">
    <!-- Main Content -->
    <view class="form-container">
      <!-- Registration Form -->
      <view v-if="!showSuccess" id="registration-form">
        <!-- Registration Type Selection -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-icon">👤</text>
            <text class="section-title">报名类型</text>
          </view>
          <view class="registration-types">
            <view
              class="registration-type"
              :class="{ selected: formData.type === 'individual' }"
              @click="selectRegistrationType('individual')"
            >
              <view class="type-icon">👤</view>
              <text class="type-title">个人报名</text>
              <text class="type-desc">为自己报名</text>
            </view>
            <view
              class="registration-type"
              :class="{ selected: formData.type === 'team' }"
              @click="selectRegistrationType('team')"
            >
              <view class="type-icon">👥</view>
              <text class="type-title">团队报名</text>
              <text class="type-desc">为团队报名</text>
            </view>
          </view>
        </view>

        <!-- Personal Information Section -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-icon">👤</text>
            <text class="section-title">个人信息</text>
          </view>

          <view class="form-group">
            <text class="form-label required">姓名</text>
            <input
              type="text"
              class="form-input"
              v-model="formData.name"
              placeholder="请输入您的姓名"
              @blur="validateField('name')"
            />
            <text class="error-message" v-if="errors.name">{{ errors.name }}</text>
          </view>

          <view class="form-group">
            <text class="form-label required">联系电话</text>
            <input
              type="tel"
              class="form-input"
              v-model="formData.phone"
              placeholder="请输入您的联系电话"
              @blur="validateField('phone')"
            />
            <text class="error-message" v-if="errors.phone">{{ errors.phone }}</text>
          </view>

          <view class="form-group">
            <text class="form-label">微信号</text>
            <input
              type="text"
              class="form-input"
              v-model="formData.wechat"
              placeholder="请输入您的微信号（选填）"
            />
          </view>

          <view class="form-row">
            <view class="form-group">
              <text class="form-label">性别</text>
              <picker
                class="form-picker"
                @change="onGenderChange"
                :value="genderIndex"
                :range="genderOptions"
              >
                <view class="picker-value">
                  {{ formData.gender || '请选择' }}
                </view>
              </picker>
            </view>

            <view class="form-group">
              <text class="form-label">年龄</text>
              <input
                type="number"
                class="form-input"
                v-model="formData.age"
                placeholder="请输入年龄"
                :min="1"
                :max="120"
              />
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">所在城市</text>
            <input
              type="text"
              class="form-input"
              v-model="formData.city"
              placeholder="请输入所在城市"
            />
          </view>

          <view class="form-group">
            <text class="form-label">身份证号</text>
            <input
              type="text"
              class="form-input"
              v-model="formData.idcard"
              placeholder="请输入身份证号"
            />
          </view>

          <view class="form-row">
            <view class="form-group">
              <text class="form-label">学历</text>
              <picker
                class="form-picker"
                @change="onEducationChange"
                :value="educationIndex"
                :range="educationOptions"
              >
                <view class="picker-value">
                  {{ formData.education || '请选择' }}
                </view>
              </picker>
            </view>

            <view class="form-group">
              <text class="form-label">职业</text>
              <input
                type="text"
                class="form-input"
                v-model="formData.occupation"
                placeholder="请输入职业"
              />
            </view>
          </view>
        </view>

        <!-- Team Information Section -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-icon">👥</text>
            <text class="section-title">团队信息</text>
            <text class="section-subtitle">（团队报名时填写）</text>
          </view>

          <view v-if="formData.type === 'team'" class="team-info">
            <view class="form-group">
              <text class="form-label required">团队名称</text>
              <input
                type="text"
                class="form-input"
                v-model="formData.teamName"
                placeholder="请输入团队名称"
                @blur="validateField('teamName')"
              />
              <text class="error-message" v-if="errors.teamName">{{ errors.teamName }}</text>
            </view>

            <view class="form-group">
              <text class="form-label required">团长姓名</text>
              <input
                type="text"
                class="form-input"
                v-model="formData.teamLeader"
                placeholder="请输入团长姓名"
                @blur="validateField('teamLeader')"
              />
              <text class="error-message" v-if="errors.teamLeader">{{ errors.teamLeader }}</text>
            </view>

            <view class="form-group">
              <text class="form-label required">团长联系电话</text>
              <input
                type="tel"
                class="form-input"
                v-model="formData.teamPhone"
                placeholder="请输入团长联系电话"
                @blur="validateField('teamPhone')"
              />
              <text class="error-message" v-if="errors.teamPhone">{{ errors.teamPhone }}</text>
            </view>

            <view class="form-group">
              <text class="form-label required">节目名称</text>
              <input
                type="text"
                class="form-input"
                v-model="formData.programName"
                placeholder="请输入节目名称"
                @blur="validateField('programName')"
              />
              <text class="error-message" v-if="errors.programName">{{ errors.programName }}</text>
            </view>

            <view class="form-row">
              <view class="form-group">
                <text class="form-label required">节目类型</text>
                <picker
                  class="form-picker"
                  @change="onProgramTypeChange"
                  :value="programTypeIndex"
                  :range="programTypeOptions"
                >
                  <view class="picker-value">
                    {{ formData.programType || '请选择' }}
                  </view>
                </picker>
                <text class="error-message" v-if="errors.programType">{{ errors.programType }}</text>
              </view>

              <view class="form-group">
                <text class="form-label required">参加人数</text>
                <input
                  type="number"
                  class="form-input"
                  v-model="formData.participantCount"
                  placeholder="请输入参加人数"
                  :min="1"
                  @blur="validateField('participantCount')"
                />
                <text class="error-message" v-if="errors.participantCount">{{ errors.participantCount }}</text>
              </view>
            </view>

            <view class="form-group">
              <text class="form-label">团队简介</text>
              <textarea
                class="form-textarea team-description-textarea"
                v-model="formData.teamDescription"
                placeholder="请输入团队简介（选填）"
                :auto-height="true"
                :fixed="true"
                :show-confirm-bar="false"
                @focus="onTextareaFocus"
                @blur="onTextareaBlur"
                @input="onTextareaInput"
              />
            </view>
          </view>
        </view>

        <!-- Custom Questions Section -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-icon">❓</text>
            <text class="section-title">其他信息</text>
          </view>

          <view class="custom-questions">
            <view class="custom-question">
              <text class="question-label">是否有特殊需求？</text>
              <textarea
                class="form-textarea"
                v-model="formData.specialNeeds"
                placeholder="如有特殊需求请在此说明"
                :rows="2"
              />
            </view>

            <view class="custom-question">
              <text class="question-label">如何得知本活动？</text>
              <picker
                class="form-picker"
                @change="onSourceChange"
                :value="sourceIndex"
                :range="sourceOptions"
              >
                <view class="picker-value">
                  {{ formData.source || '请选择' }}
                </view>
              </picker>
            </view>
          </view>
        </view>

        <!-- Submit Button -->
        <button class="submit-button" @click="submitForm">
          提交报名
        </button>
      </view>

      <!-- Success Animation -->
      <view v-if="showSuccess" class="success-animation">
        <view class="success-checkmark">
          <text class="check-icon">✓</text>
        </view>
        <text class="success-title">报名成功！</text>
        <text class="success-message">您的报名信息已提交，请等待审核</text>
        <text class="countdown">{{ countdown }}</text>
        <text class="countdown-label">秒后自动返回活动详情页</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showSuccess: false,
      countdown: 5,
      timer: null,

      formData: {
        type: 'individual',
        name: '',
        phone: '',
        wechat: '',
        gender: '',
        age: '',
        city: '',
        idcard: '',
        education: '',
        occupation: '',
        teamName: '',
        teamLeader: '',
        teamPhone: '',
        programName: '',
        programType: '',
        participantCount: '',
        teamDescription: '',
        specialNeeds: '',
        source: ''
      },

      errors: {},

      genderIndex: 0,
      genderOptions: ['请选择', '男', '女'],

      educationIndex: 0,
      educationOptions: ['请选择', '小学', '初中', '高中', '大专', '本科', '硕士', '博士'],

      programTypeIndex: 0,
      programTypeOptions: ['请选择', '歌曲', '舞蹈', '乐器', '戏剧', '戏曲', '其他'],

      sourceIndex: 0,
      sourceOptions: ['请选择', '朋友推荐', '微信群', '社区公告', '网络搜索', '其他']
    }
  },

  onLoad(options) {
    // Auto-fill user info from local storage if available
    this.autoFillUserInfo()

    // Get activity info if passed
    if (options.activityId) {
      this.activityId = options.activityId
    }
  },

  onUnload() {
    // Clear timer when page is unloaded
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    selectRegistrationType(type) {
      this.formData.type = type

      // Clear team fields when switching to individual
      if (type === 'individual') {
        this.clearTeamFields()
      }

      // Clear team errors
      this.clearTeamErrors()
    },

    onGenderChange(e) {
      this.genderIndex = e.detail.value
      this.formData.gender = this.genderOptions[this.genderIndex]
    },

    onEducationChange(e) {
      this.educationIndex = e.detail.value
      this.formData.education = this.educationOptions[this.educationIndex]
    },

    onProgramTypeChange(e) {
      this.programTypeIndex = e.detail.value
      this.formData.programType = this.programTypeOptions[this.programTypeIndex]
    },

    onSourceChange(e) {
      this.sourceIndex = e.detail.value
      this.formData.source = this.sourceOptions[this.sourceIndex]
    },

    // 团队简介textarea事件处理方法
    onTextareaFocus(e) {
      console.log('团队简介textarea获得焦点')
      // 确保textarea可以正常编辑
      uni.vibrateShort()
    },

    onTextareaBlur(e) {
      console.log('团队简介textarea失去焦点')
      console.log('当前团队简介内容:', this.formData.teamDescription)
    },

    onTextareaInput(e) {
      console.log('团队简介输入内容:', e.detail.value)
      // 确保数据绑定正常工作
      this.formData.teamDescription = e.detail.value
    },

    autoFillUserInfo() {
      // Get user info from local storage
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          this.formData.name = userInfo.name || ''
          this.formData.phone = userInfo.phone || ''
          this.formData.wechat = userInfo.wechat || ''
          this.formData.city = userInfo.city || ''
        }
      } catch (error) {
        console.error('Failed to load user info:', error)
      }
    },

    validateField(field) {
      switch (field) {
        case 'name':
          if (!this.formData.name.trim()) {
            this.errors.name = '请输入姓名'
          } else {
            delete this.errors.name
          }
          break

        case 'phone':
          const phoneRegex = /^1[3-9]\d{9}$/
          if (!this.formData.phone.trim() || !phoneRegex.test(this.formData.phone)) {
            this.errors.phone = '请输入正确的联系电话'
          } else {
            delete this.errors.phone
          }
          break

        case 'teamName':
          if (this.formData.type === 'team' && !this.formData.teamName.trim()) {
            this.errors.teamName = '请输入团队名称'
          } else {
            delete this.errors.teamName
          }
          break

        case 'teamLeader':
          if (this.formData.type === 'team' && !this.formData.teamLeader.trim()) {
            this.errors.teamLeader = '请输入团长姓名'
          } else {
            delete this.errors.teamLeader
          }
          break

        case 'teamPhone':
          if (this.formData.type === 'team') {
            const phoneRegex = /^1[3-9]\d{9}$/
            if (!this.formData.teamPhone.trim() || !phoneRegex.test(this.formData.teamPhone)) {
              this.errors.teamPhone = '请输入正确的联系电话'
            } else {
              delete this.errors.teamPhone
            }
          } else {
            delete this.errors.teamPhone
          }
          break

        case 'programName':
          if (this.formData.type === 'team' && !this.formData.programName.trim()) {
            this.errors.programName = '请输入节目名称'
          } else {
            delete this.errors.programName
          }
          break

        case 'programType':
          if (this.formData.type === 'team' && !this.formData.programType) {
            this.errors.programType = '请选择节目类型'
          } else {
            delete this.errors.programType
          }
          break

        case 'participantCount':
          if (this.formData.type === 'team' && (!this.formData.participantCount || parseInt(this.formData.participantCount) < 1)) {
            this.errors.participantCount = '请输入正确的参加人数'
          } else {
            delete this.errors.participantCount
          }
          break
      }
    },

    validateForm() {
      // Validate all fields
      this.validateField('name')
      this.validateField('phone')

      if (this.formData.type === 'team') {
        this.validateField('teamName')
        this.validateField('teamLeader')
        this.validateField('teamPhone')
        this.validateField('programName')
        this.validateField('programType')
        this.validateField('participantCount')
      }

      return Object.keys(this.errors).length === 0
    },

    clearTeamFields() {
      this.formData.teamName = ''
      this.formData.teamLeader = ''
      this.formData.teamPhone = ''
      this.formData.programName = ''
      this.formData.programType = ''
      this.formData.participantCount = ''
      this.formData.teamDescription = ''
    },

    clearTeamErrors() {
      delete this.errors.teamName
      delete this.errors.teamLeader
      delete this.errors.teamPhone
      delete this.errors.programName
      delete this.errors.programType
      delete this.errors.participantCount
    },

    submitForm() {
      if (!this.validateForm()) {
        return
      }

      // Show success animation
      this.showSuccess = true

      // Start countdown
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          this.goBack()
        }
      }, 1000)

      // Save user info to local storage
      try {
        const userInfo = {
          name: this.formData.name,
          phone: this.formData.phone,
          wechat: this.formData.wechat,
          city: this.formData.city
        }
        uni.setStorageSync('userInfo', userInfo)
      } catch (error) {
        console.error('Failed to save user info:', error)
      }

      // TODO: Submit registration data to server
      console.log('Registration data:', this.formData)
    },

    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.registration-container {
  min-height: 100vh;
  background-color: $uni-bg-color-grey;
}


.form-container {
  padding: 32rpx;
}

.form-section {
  background-color: $uni-bg-color;
  border-radius: $uni-border-radius-lg;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: $shadow-sm;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;

    .section-icon {
      font-size: 40rpx;
      margin-right: 16rpx;
    }

    .section-title {
      font-size: $uni-font-size-lg;
      font-weight: bold;
      color: $primary-cambridge-blue;
    }

    .section-subtitle {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
      margin-left: 16rpx;
    }
  }
}

.registration-types {
  display: flex;
  gap: 24rpx;

  .registration-type {
    flex: 1;
    padding: 32rpx;
    border: 2rpx solid $uni-border-color;
    border-radius: $uni-border-radius-lg;
    text-align: center;
    background-color: $uni-bg-color-grey;
    transition: all 0.3s ease;
    cursor: pointer;

    .type-icon {
      font-size: 48rpx;
      margin-bottom: 16rpx;
    }

    .type-title {
      font-size: $uni-font-size-base;
      font-weight: bold;
      color: $uni-text-color;
      display: block;
      margin-bottom: 8rpx;
    }

    .type-desc {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-grey;
    }

    &.selected {
      border-color: $primary-cambridge-blue;
      background-color: rgba($primary-cambridge-blue, 0.1);

      .type-title {
        color: $primary-cambridge-blue;
      }
    }
  }
}

.form-group {
  margin-bottom: 32rpx;

  .form-label {
    display: block;
    font-size: $uni-font-size-base;
    font-weight: 500;
    color: $uni-text-color;
    margin-bottom: 16rpx;

    &.required::after {
      content: " *";
      color: $uni-color-error;
    }
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 16rpx !important;
    border: 2rpx solid $uni-border-color !important;
    border-radius: $uni-border-radius-base !important;
    font-size: $uni-font-size-base !important;
    background-color: $uni-bg-color-grey !important;
    transition: all 0.2s ease;
    height: auto !important;
    min-height: auto !important;
    line-height: 1.4 !important;

    &:focus {
      outline: none !important;
      border-color: $primary-cambridge-blue !important;
      background-color: $uni-bg-color !important;
    }
  }

  .form-picker {
    width: 100%;
    border: 2rpx solid $uni-border-color !important;
    border-radius: $uni-border-radius-base !important;
    font-size: $uni-font-size-base !important;
    background-color: $uni-bg-color-grey !important;
    transition: all 0.2s ease;
    height: auto !important;
    min-height: auto !important;

    &:focus {
      outline: none !important;
      border-color: $primary-cambridge-blue !important;
      background-color: $uni-bg-color !important;
    }
  }

  .picker-value {
    width: 100%;
    padding: 16rpx !important;
    font-size: $uni-font-size-base !important;
    color: $uni-text-color !important;
    display: flex !important;
    align-items: center !important;
    height: auto !important;
    min-height: auto !important;
    line-height: 1.4 !important;
    box-sizing: border-box !important;
  }

  .form-textarea {
    resize: vertical;
    min-height: 120rpx;
  }

  // 团队简介textarea专用样式 - 解决无法输入问题
  .team-description-textarea {
    pointer-events: auto !important;
    position: relative !important;
    z-index: 200 !important;
    -webkit-appearance: textarea !important;
    -moz-appearance: textarea !important;
    appearance: textarea !important;
    -webkit-user-select: text !important;
    user-select: text !important;
    -webkit-touch-callout: default !important;
    touch-action: manipulation !important;
    cursor: text !important;
    width: 100% !important;
    min-height: 120rpx !important;
    height: auto !important;
    line-height: 1.4 !important;
    padding: 16rpx !important;
    border: 2rpx solid $uni-border-color !important;
    border-radius: $uni-border-radius-base !important;
    font-size: $uni-font-size-base !important;
    background-color: $uni-bg-color-grey !important;
    color: $uni-text-color !important;
    resize: vertical !important;
    overflow-y: auto !important;

    &:focus {
      outline: none !important;
      border-color: $primary-cambridge-blue !important;
      background-color: $uni-bg-color !important;
      box-shadow: 0 0 0 4rpx rgba($primary-cambridge-blue, 0.1) !important;
    }

    &:disabled {
      opacity: 0.6 !important;
      cursor: not-allowed !important;
    }

    &[readonly] {
      background-color: rgba($uni-text-color-grey, 0.1) !important;
      cursor: default !important;
    }
  }

  .error-message {
    font-size: $uni-font-size-sm;
    color: $uni-color-error;
    margin-top: 8rpx;
  }
}

.form-row {
  display: flex;
  gap: 24rpx;

  .form-group {
    flex: 1;
  }
}

.team-info {
  margin-top: 32rpx;
}

.custom-questions {
  .custom-question {
    margin-bottom: 32rpx;
    padding: 24rpx;
    background-color: rgba($primary-cambridge-blue, 0.05);
    border: 1rpx solid rgba($primary-cambridge-blue, 0.2);
    border-radius: $uni-border-radius-base;

    .question-label {
      display: block;
      font-size: $uni-font-size-base;
      font-weight: 500;
      color: $uni-text-color;
      margin-bottom: 16rpx;
    }
  }
}

.submit-button {
  width: 100%;
  padding: 32rpx;
  background: $gradient-primary;
  color: $uni-text-color-inverse;
  border: none;
  border-radius: $uni-border-radius-lg;
  font-size: $uni-font-size-xl;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: $shadow-md;

  &:active {
    transform: translateY(0);
  }
}

.success-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;

  .success-checkmark {
    width: 160rpx;
    height: 160rpx;
    background-color: $primary-cambridge-blue;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    animation: scaleIn 0.5s ease-out;

    .check-icon {
      color: $uni-text-color-inverse;
      font-size: 80rpx;
      font-weight: bold;
    }
  }

  .success-title {
    font-size: 48rpx;
    font-weight: bold;
    color: $primary-cambridge-blue;
    margin-bottom: 24rpx;
  }

  .success-message {
    font-size: $uni-font-size-base;
    color: $uni-text-color-grey;
    margin-bottom: 40rpx;
  }

  .countdown {
    font-size: 48rpx;
    font-weight: bold;
    color: $primary-cambridge-blue;
    margin: 40rpx 0;
  }

  .countdown-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
}

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 750rpx) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .registration-types {
    flex-direction: column;
    gap: 16rpx;
  }
}
</style>