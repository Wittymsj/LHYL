<template>
	<view class="organizer-auth">
		<!-- 顶部导航栏 -->
		<view class="header animate-slide-down">
			<view class="nav-content">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">‹</text>
					<text class="back-text">返回</text>
				</view>
				<text class="title-text">主办方认证申请</text>
				<view class="help-btn" @click="showHelp">
					<text class="help-icon">?</text>
					<text class="help-text">帮助</text>
				</view>
			</view>
		</view>

		<!-- 主要内容 -->
		<view class="container">
			<!-- 认证类型选择 -->
			<view class="card animate-fade-in-up animate-delay-100">
				<text class="card-title">选择认证类型</text>
				<view class="radio-group">
					<view class="radio-option" :class="{'radio-option-selected': form.authType === 'personal'}" @click="selectAuthType('personal')">
						<view class="radio-icon">
							<text class="icon">👤</text>
						</view>
						<view class="radio-content">
							<text class="radio-label">个人主办方</text>
							<text class="radio-desc">个人身份发布活动</text>
						</view>
					</view>
					<view class="radio-option" :class="{'radio-option-selected': form.authType === 'enterprise'}" @click="selectAuthType('enterprise')">
						<view class="radio-icon">
							<text class="icon">🏢</text>
						</view>
						<view class="radio-content">
							<text class="radio-label">企业/机构</text>
							<text class="radio-desc">企业或组织机构</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 基础信息 -->
			<view class="card animate-fade-in-up animate-delay-200">
				<text class="card-title">
					<text class="title-icon">📋</text>
					基础信息
				</text>
				<view class="form-grid">
					<view class="form-group">
						<text class="form-label">主办方名称 *</text>
						<input
							class="form-input"
							v-model="form.organizerName"
							placeholder="请输入主办方名称"
							@blur="validateField('organizerName')"
							@focus="clearError('organizerName')"
						/>
						<text class="error-text" v-if="errors.organizerName">{{errors.organizerName}}</text>
					</view>

					<view class="form-group">
						<text class="form-label">联系人姓名 *</text>
						<input
							class="form-input"
							v-model="form.contactName"
							placeholder="请输入联系人姓名"
							@blur="validateField('contactName')"
							@focus="clearError('contactName')"
						/>
						<text class="error-text" v-if="errors.contactName">{{errors.contactName}}</text>
					</view>

					<view class="form-group">
						<text class="form-label">联系电话 *</text>
						<input
							class="form-input"
							v-model="form.contactPhone"
							placeholder="请输入联系电话"
							@blur="validateField('contactPhone')"
							@focus="clearError('contactPhone')"
						/>
						<text class="error-text" v-if="errors.contactPhone">{{errors.contactPhone}}</text>
					</view>

					<view class="form-group">
						<text class="form-label">电子邮箱 *</text>
						<input
							class="form-input"
							v-model="form.email"
							placeholder="请输入电子邮箱"
							@blur="validateField('email')"
							@focus="clearError('email')"
						/>
						<text class="error-text" v-if="errors.email">{{errors.email}}</text>
					</view>
				</view>

				<view class="form-group">
					<text class="form-label">主办方简介</text>
					<textarea
						class="form-textarea"
						v-model="form.description"
						placeholder="请简要介绍主办方背景、主要活动方向等（选填）"
						:maxlength="500"
						@input="updateCharCount"
					/>
					<text class="char-count">{{form.description.length}}/500</text>
				</view>
			</view>

			<!-- 资质证明 -->
			<view class="card animate-fade-in-up animate-delay-300">
				<text class="card-title">
					<text class="title-icon">📄</text>
					资质证明
				</text>
				<view class="upload-section">
					<view class="upload-item">
						<text class="upload-title">身份证/营业执照 *</text>
						<view class="upload-area" :class="{'upload-area-active': form.idCardImage}" @click="uploadFile('idCard')">
							<text class="upload-icon">📤</text>
							<text class="upload-text">{{form.idCardImage ? '已选择文件' : '点击上传身份证/营业执照'}}</text>
							<text class="upload-desc">支持 JPG、PNG 格式，大小不超过 5MB</text>
						</view>
						<text class="upload-filename" v-if="form.idCardName">{{form.idCardName}}</text>
					</view>

					<view class="upload-item">
						<text class="upload-title">相关资质证书</text>
						<view class="upload-area" :class="{'upload-area-active': form.certificateImage}" @click="uploadFile('certificate')">
							<text class="upload-icon">📜</text>
							<text class="upload-text">{{form.certificateImage ? '已选择文件' : '点击上传相关资质证书'}}</text>
							<text class="upload-desc">如活动组织资质、行业认证等（选填）</text>
						</view>
						<text class="upload-filename" v-if="form.certificateName">{{form.certificateName}}</text>
					</view>

					<view class="upload-item">
						<text class="upload-title">场地证明</text>
						<view class="upload-area" :class="{'upload-area-active': form.venueImage}" @click="uploadFile('venue')">
							<text class="upload-icon">📍</text>
							<text class="upload-text">{{form.venueImage ? '已选择文件' : '点击上传场地证明'}}</text>
							<text class="upload-desc">如自有场地、租赁合同等证明文件（选填）</text>
						</view>
						<text class="upload-filename" v-if="form.venueName">{{form.venueName}}</text>
					</view>
				</view>
			</view>

			<!-- 联系方式设置 -->
			<view class="card animate-fade-in-up animate-delay-400">
				<text class="card-title">
					<text class="title-icon">📞</text>
					联系方式设置
				</text>
				<view class="form-grid">
					<view class="form-group">
						<text class="form-label">客服电话 *</text>
						<input
							class="form-input"
							v-model="form.servicePhone"
							placeholder="请输入客服电话"
							@blur="validateField('servicePhone')"
							@focus="clearError('servicePhone')"
						/>
						<text class="error-text" v-if="errors.servicePhone">{{errors.servicePhone}}</text>
					</view>

					<view class="form-group">
						<text class="form-label">微信号</text>
						<input
							class="form-input"
							v-model="form.wechat"
							placeholder="请输入微信号（选填）"
						/>
					</view>
				</view>
			</view>

			<!-- 协议确认 -->
			<view class="card animate-fade-in-up animate-delay-500">
				<view class="agreement">
					<view class="checkbox" :class="{'checkbox-checked': form.agreement}" @click="toggleAgreement">
						<text class="check-icon" v-if="form.agreement">✓</text>
					</view>
					<view class="agreement-text">
						我已阅读并同意
						<text class="link-text" @click="showAgreement">《主办方服务协议》</text>
						和
						<text class="link-text" @click="showPrivacy">《隐私政策》</text>
					</view>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-section animate-fade-in-up animate-delay-600">
				<button class="submit-btn" :class="{'submit-btn-loading': isSubmitting}" @click="submitForm">
					<text class="submit-icon" v-if="!isSubmitting">📤</text>
					<text class="submit-text">{{isSubmitting ? '提交中...' : '提交认证申请'}}</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				authType: 'enterprise', // 默认选择企业/机构
				organizerName: '',
				contactName: '',
				contactPhone: '',
				email: '',
				description: '',
				servicePhone: '',
				wechat: '',
				idCardImage: '',
				idCardName: '',
				certificateImage: '',
				certificateName: '',
				venueImage: '',
				venueName: '',
				agreement: false
			},
			errors: {},
			isSubmitting: false,
			uploadQueue: []
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},

		showHelp() {
			uni.showModal({
				title: '帮助中心',
				content: '如有疑问，请联系客服：400-123-4567',
				showCancel: false,
				confirmText: '知道了'
			})
		},

		selectAuthType(type) {
			this.form.authType = type
		},

		clearError(field) {
			if (this.errors[field]) {
				this.$delete(this.errors, field)
			}
		},

		updateCharCount() {
			// 字符计数自动更新
		},

		validateField(field) {
			switch(field) {
				case 'organizerName':
					if (!this.form.organizerName.trim()) {
						this.$set(this.errors, field, '请输入主办方名称')
					} else if (this.form.organizerName.length < 2) {
						this.$set(this.errors, field, '主办方名称至少2个字符')
					} else {
						this.$delete(this.errors, field)
					}
					break
				case 'contactName':
					if (!this.form.contactName.trim()) {
						this.$set(this.errors, field, '请输入联系人姓名')
					} else if (this.form.contactName.length < 2) {
						this.$set(this.errors, field, '联系人姓名至少2个字符')
					} else {
						this.$delete(this.errors, field)
					}
					break
				case 'contactPhone':
					const phoneRegex = /^1[3-9]\d{9}$/
					if (!this.form.contactPhone.trim()) {
						this.$set(this.errors, field, '请输入联系电话')
					} else if (!phoneRegex.test(this.form.contactPhone)) {
						this.$set(this.errors, field, '请输入正确的手机号码')
					} else {
						this.$delete(this.errors, field)
					}
					break
				case 'email':
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
					if (!this.form.email.trim()) {
						this.$set(this.errors, field, '请输入电子邮箱')
					} else if (!emailRegex.test(this.form.email)) {
						this.$set(this.errors, field, '请输入正确的邮箱地址')
					} else {
						this.$delete(this.errors, field)
					}
					break
				case 'servicePhone':
					const servicePhoneRegex = /^((1[3-9]\d{9})|(\d{3,4}-\d{7,8})|(400\d{7})|(800\d{7}))$/
					if (!this.form.servicePhone.trim()) {
						this.$set(this.errors, field, '请输入客服电话')
					} else if (!servicePhoneRegex.test(this.form.servicePhone)) {
						this.$set(this.errors, field, '请输入正确的客服电话号码（支持手机号、座机号、400/800电话）')
					} else {
						this.$delete(this.errors, field)
					}
					break
			}
		},

		validateAllFields() {
			// 清空之前的错误
			this.errors = {}

			// 验证必填字段
			const requiredFields = ['organizerName', 'contactName', 'contactPhone', 'email', 'servicePhone']
			let isValid = true

			requiredFields.forEach(field => {
				this.validateField(field)
				if (this.errors[field]) {
					isValid = false
				}
			})

			// 验证文件上传
			if (!this.form.idCardImage) {
				this.$set(this.errors, 'idCardImage', '请上传身份证或营业执照')
				isValid = false
			}

			// 验证协议
			if (!this.form.agreement) {
				this.$set(this.errors, 'agreement', '请先阅读并同意服务协议')
				isValid = false
			}

			return isValid
		},

		uploadFile(type) {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const file = res.tempFilePaths[0]
					const fileName = res.tempFiles[0].name || '上传文件'

					// 验证文件大小（5MB）
					if (res.tempFiles[0].size > 5 * 1024 * 1024) {
						uni.showToast({
							title: '文件大小不能超过5MB',
							icon: 'none'
						})
						return
					}

					// 根据类型保存
					switch(type) {
						case 'idCard':
							this.form.idCardImage = file
							this.form.idCardName = fileName
							break
						case 'certificate':
							this.form.certificateImage = file
							this.form.certificateName = fileName
							break
						case 'venue':
							this.form.venueImage = file
							this.form.venueName = fileName
							break
					}

					uni.showToast({
						title: '文件选择成功',
						icon: 'success'
					})
				},
				fail: (err) => {
					console.error('文件选择失败:', err)
					uni.showToast({
						title: '文件选择失败',
						icon: 'none'
					})
				}
			})
		},

		toggleAgreement() {
			this.form.agreement = !this.form.agreement
			if (this.form.agreement && this.errors.agreement) {
				this.$delete(this.errors, 'agreement')
			}
		},

		showAgreement() {
			uni.showModal({
				title: '主办方服务协议',
				content: '这里显示主办方服务协议的详细内容...',
				showCancel: true,
				cancelText: '取消',
				confirmText: '我同意',
				success: (res) => {
					if (res.confirm) {
						this.form.agreement = true
					}
				}
			})
		},

		showPrivacy() {
			uni.showModal({
				title: '隐私政策',
				content: '这里显示隐私政策的详细内容...',
				showCancel: true,
				cancelText: '取消',
				confirmText: '我知道了'
			})
		},

		submitForm() {
			if (this.isSubmitting) return

			// 验证表单
			if (!this.validateAllFields()) {
				uni.showToast({
					title: '请完善必填信息',
					icon: 'none'
				})
				return
			}

			this.isSubmitting = true

			// 模拟提交过程
			setTimeout(() => {
				this.isSubmitting = false

				uni.showToast({
					title: '认证申请提交成功！我们将在3-5个工作日内完成审核。',
					icon: 'success',
					duration: 3000
				})

				// 延迟返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 2000)
			}, 2000)
		}
	}
}
</script>

<style>
/* 基础样式 */
.organizer-auth {
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  z-index: 1;
  box-sizing: border-box !important;
}

/* 输入框修复样式 - 确保所有输入元素都能正常工作 */
.organizer-auth input,
.organizer-auth textarea,
.organizer-auth .form-input,
.organizer-auth .form-textarea {
  pointer-events: auto !important;
  position: relative !important;
  z-index: 3000 !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  -webkit-user-select: auto !important;
  user-select: auto !important;
  -webkit-touch-callout: default !important;
  touch-action: manipulation !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.organizer-auth input:focus,
.organizer-auth textarea:focus,
.organizer-auth .form-input:focus,
.organizer-auth .form-textarea:focus {
  outline: none !important;
  z-index: 4000 !important;
}

/* 确保父容器不阻碍输入框交互 */
.organizer-auth .form-group,
.organizer-auth .card,
.organizer-auth .container {
  pointer-events: auto !important;
}

.container {
  padding: 0 32rpx 180rpx 32rpx;
  /* 确保容器不阻碍输入框交互 */
  pointer-events: auto !important;
  position: relative !important;
  z-index: 10 !important;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #75b09c, #a0ca92);
  padding: 24rpx 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  margin: 0 -32rpx;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.back-btn, .help-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 32rpx;
  transition: all 0.3s ease;
}

.back-btn:active, .help-btn:active {
  transform: scale(0.95);
  background-color: rgba(255, 255, 255, 0.3);
}

.back-icon, .help-icon {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
}

.back-text, .help-text {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: 500;
}

.title-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
}

/* 卡片样式 */
.card {
  background-color: #ffffff;
  border-radius: 32rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  border: 1rpx solid #f1f5f9;
  /* 确保卡片不阻碍输入框交互 */
  pointer-events: auto !important;
  position: relative !important;
  z-index: 20 !important;
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.title-icon {
  font-size: 32rpx;
}

/* 认证类型选择 */
.radio-group {
  display: flex;
  gap: 24rpx;
}

.radio-option {
  flex: 1;
  padding: 32rpx 24rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 24rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.radio-option-selected {
  border-color: #75b09c;
  background-color: #75b09c;
  color: #ffffff;
}

.radio-option:active {
  transform: scale(0.98);
}

.radio-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(117, 176, 156, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-option-selected .radio-icon {
  background-color: rgba(255, 255, 255, 0.2);
}

.icon {
  font-size: 40rpx;
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.radio-label {
  font-size: 28rpx;
  font-weight: 600;
  color: inherit;
}

.radio-desc {
  font-size: 24rpx;
  opacity: 0.8;
  color: inherit;
}

/* 表单样式 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.form-group {
  margin-bottom: 32rpx;
  /* 确保表单组不阻碍输入框交互 */
  pointer-events: auto !important;
  position: relative !important;
  z-index: 50 !important;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 16rpx;
  font-size: 28rpx;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: all 0.3s ease;
  /* 确保输入框可交互 */
  pointer-events: auto !important;
  position: relative !important;
  z-index: 1000 !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

.form-input:focus {
  border-color: #75b09c;
  outline: none !important;
  box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1) !important;
  /* 确保焦点状态可见 */
  z-index: 2000 !important;
}

.form-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 16rpx;
  font-size: 28rpx;
  background-color: #ffffff;
  box-sizing: border-box;
  resize: vertical;
  transition: all 0.3s ease;
  /* 确保文本域可交互 */
  pointer-events: auto !important;
  position: relative !important;
  z-index: 1000 !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

.form-textarea:focus {
  border-color: #75b09c;
  outline: none !important;
  box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1) !important;
  /* 确保焦点状态可见 */
  z-index: 2000 !important;
}

.char-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 8rpx;
}

.error-text {
  color: #dd524d;
  font-size: 24rpx;
  margin-top: 8rpx;
  display: block;
}

/* 文件上传样式 */
.upload-section {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.upload-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.upload-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.upload-area {
  width: 100%;
  min-height: 180rpx;
  border: 2rpx dashed #e9ecef;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 24rpx;
}

.upload-area:active {
  transform: scale(0.98);
}

.upload-area-active {
  border-color: #75b09c;
  background-color: rgba(117, 176, 156, 0.05);
}

.upload-icon {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.upload-area-active .upload-icon {
  color: #75b09c;
}

.upload-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.upload-desc {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  line-height: 1.4;
}

.upload-filename {
  font-size: 24rpx;
  color: #75b09c;
  word-break: break-all;
}

/* 协议样式 */
.agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx;
  background-color: #f8f9fa;
  border-radius: 16rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4rpx;
}

.checkbox-checked {
  background-color: #75b09c;
  border-color: #75b09c;
}

.check-icon {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: bold;
}

.agreement-text {
  flex: 1;
  font-size: 26rpx;
  line-height: 1.6;
  color: #333;
}

.link-text {
  color: #75b09c;
  font-weight: 500;
  text-decoration: underline;
}

/* 提交按钮样式 */
.submit-section {
  text-align: center;
  margin-top: 48rpx;
  margin-bottom: 32rpx;
}

.submit-btn {
  width: 100%;
  max-width: 600rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #75b09c, #a0ca92);
  color: #ffffff;
  border: none;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn-loading:active {
  transform: none;
}

.submit-icon {
  font-size: 32rpx;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 600;
}

/* 动画样式 */
.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
  opacity: 0;
}

.animate-delay-100 {
  animation-delay: 100ms;
  animation-fill-mode: both;
}

.animate-delay-200 {
  animation-delay: 200ms;
  animation-fill-mode: both;
}

.animate-delay-300 {
  animation-delay: 300ms;
  animation-fill-mode: both;
}

.animate-delay-400 {
  animation-delay: 400ms;
  animation-fill-mode: both;
}

.animate-delay-500 {
  animation-delay: 500ms;
  animation-fill-mode: both;
}

.animate-delay-600 {
  animation-delay: 600ms;
  animation-fill-mode: both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 750px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .radio-group {
    flex-direction: column;
    gap: 16rpx;
  }

  .container {
    padding: 0 24rpx 180rpx 24rpx;
  }

  .card {
    padding: 32rpx 24rpx;
  }

  /* 移动端确保输入框可点击 */
  .organizer-auth input,
  .organizer-auth textarea {
    min-height: 88rpx !important;
    line-height: 1.4 !important;
    font-size: 32rpx !important;
  }
}
</style>