<template>
	<view class="settings-container">
		<!-- 内容区域 -->
		<scroll-view class="content" scroll-y>
			<!-- 字体大小设置 -->
			<view class="setting-group">
				<view class="setting-item" @click="handleFontSizeClick">
					<view class="setting-item-left">
						<text class="setting-icon">🔤</text>
						<text class="setting-label">字体大小</text>
					</view>
					<view class="setting-right">
						<view class="font-size-controls">
							<view
								class="font-size-btn"
								:class="{ active: currentFontSize === 'normal' }"
								@click.stop="setFontSize('normal')">
								标准
							</view>
							<view
								class="font-size-btn"
								:class="{ active: currentFontSize === 'large' }"
								@click.stop="setFontSize('large')">
								大
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 活动审核入口 - 仅管理员可见 -->
			<view class="setting-group" v-if="isAdminComputed">
				<view class="setting-item" @click="navigateToActivityReview">
					<view class="setting-item-left">
						<text class="setting-icon">✅</text>
						<text class="setting-label">活动审核</text>
					</view>
					<view class="setting-right">
						<view class="setting-arrow"></view>
					</view>
				</view>
			</view>

			<!-- 轮播图管理入口 - 仅管理员可见 -->
			<view class="setting-group" v-if="isAdminComputed">
				<view class="setting-item" @click="navigateToCarouselAdmin">
					<view class="setting-item-left">
						<text class="setting-icon">🖼️</text>
						<text class="setting-label">轮播图管理</text>
					</view>
					<view class="setting-right">
						<view class="setting-arrow"></view>
					</view>
				</view>
			</view>

			<!-- 用户认证入口 - 仅管理员可见 -->
			<view class="setting-group" v-if="isAdminComputed">
				<view class="setting-item" @click="navigateToUserAuth">
					<view class="setting-item-left">
						<text class="setting-icon">👤</text>
						<text class="setting-label">用户认证</text>
					</view>
					<view class="setting-right">
						<view class="setting-arrow"></view>
					</view>
				</view>
			</view>

			<!-- 当前角色显示（测试用） -->
			<view class="setting-group">
				<view class="setting-item">
					<view class="setting-item-left">
						<text class="setting-icon">🏷️</text>
						<text class="setting-label">当前角色: {{userRole === 'admin' ? '管理员' : userRole === 'organizer' ? '认证用户' : '普通用户'}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userRole: 'user', // 用户角色
			currentFontSize: 'normal'
		}
	},

	onLoad() {
		// 检查用户角色
		this.checkUserRole()

		// 加载保存的字体设置
		this.loadFontSizeSetting()
	},
	onShow() {
		// 每次显示页面时重新检查用户角色
		this.checkUserRole()
	},

	computed: {
		// 判断是否为管理员 - 计算属性版本
		isAdminComputed() {
			// 多重验证确保安全性
			console.log('isAdminComputed 被调用，当前 userRole:', this.userRole)
			if (!this.userRole) {
				console.warn('计算属性：用户角色未定义，拒绝管理员权限')
				return false
			}

			const isValidAdmin = this.userRole === 'admin'
			console.log('计算属性权限检查结果:', {
				userRole: this.userRole,
				isValidAdmin: isValidAdmin,
				时间戳: new Date().toISOString()
			})

			return isValidAdmin
		},

		// 获取用户角色显示名称
		userRoleDisplay() {
			const roleMap = {
				'user': '普通用户',
				'organizer': '认证用户',
				'admin': '管理员'
			}
			return roleMap[this.userRole] || '未知角色'
		}
	},
	methods: {
		// 判断是否为管理员 - 方法版本（用于模板）
		isAdmin() {
			return this.isAdminComputed
		},

		// 检查用户角色 - 加强版
		checkUserRole() {
			try {
				const savedRole = uni.getStorageSync('userRole')
				console.log('=== 设置页面权限检查开始 ===')
				console.log('从存储获取的角色:', savedRole)

				// 验证角色值的有效性
				const validRoles = ['user', 'organizer', 'admin']
				if (savedRole && validRoles.includes(savedRole)) {
					this.userRole = savedRole
				} else {
					// 如果存储的角色无效，默认为普通用户
					this.userRole = 'user'
					console.warn('存储的角色无效，重置为普通用户')
				}

				console.log('设置页面 - 当前用户角色:', this.userRole)
				console.log('设置页面 - isAdminComputed 计算结果:', this.isAdminComputed)
				console.log('设置页面 - 管理员功能可见性:', this.isAdminComputed)
				console.log('=== 设置页面权限检查结束 ===')
			} catch (error) {
				console.error('检查用户角色失败:', error)
				this.userRole = 'user' // 出错时默认为普通用户
			}
		},

		// 加载字体大小设置
		loadFontSizeSetting() {
			try {
				const savedFontSize = uni.getStorageSync('fontSize')
				if (savedFontSize) {
					this.currentFontSize = savedFontSize
					this.applyFontSize(savedFontSize)
				}
			} catch (error) {
				console.error('加载字体设置失败:', error)
			}
		},

		// 设置字体大小
		setFontSize(size) {
			this.currentFontSize = size
			this.applyFontSize(size)

			// 保存设置到本地存储
			try {
				uni.setStorageSync('fontSize', size)

				// 显示设置成功提示
				uni.showToast({
					title: size === 'large' ? '已切换到大字体' : '已切换到标准字体',
					icon: 'success',
					duration: 1500
				})
			} catch (error) {
				console.error('保存字体设置失败:', error)
				uni.showToast({
					title: '设置保存失败',
					icon: 'error'
				})
			}
		},

		// 应用字体大小到全局
		applyFontSize(size) {
			// 这里可以通过全局样式或状态管理来应用字体大小
			// 暂时通过设置全局数据来实现
			getApp().globalData.fontSize = size

			// 触发全局字体大小变化事件
			uni.$emit('fontSizeChanged', { fontSize: size })
		},

		// 处理字体大小设置项点击
		handleFontSizeClick() {
			// 这里可以添加更多交互逻辑
			console.log('字体大小设置被点击')
		},

		// 导航到活动审核页面 - 带权限验证
		navigateToActivityReview() {
			console.log('尝试跳转到活动审核页面')

			// 双重权限验证
			if (!this.isAdmin()) {
				console.warn('非管理员用户尝试访问活动审核页面，被拒绝')
				uni.showToast({
					title: '权限不足',
					icon: 'none'
				})
				return
			}

			console.log('管理员权限验证通过，跳转到活动审核页面')
			uni.vibrateShort() // 短震动反馈

			// 跳转到活动审核页面
			uni.navigateTo({
				url: '/pages/activity-review/activity-review'
			})
		},

		// 导航到用户认证页面 - 带权限验证
		navigateToUserAuth() {
			console.log('尝试跳转到用户认证页面')

			// 双重权限验证
			if (!this.isAdmin()) {
				console.warn('非管理员用户尝试访问用户认证页面，被拒绝')
				uni.showToast({
					title: '权限不足',
					icon: 'none'
				})
				return
			}

			console.log('管理员权限验证通过，跳转到用户认证页面')
			uni.vibrateShort() // 短震动反馈

			// 跳转到用户认证页面
			uni.navigateTo({
				url: '/pages/user-auth/user-auth'
			})
		},

		// 导航到轮播图管理页面 - 带权限验证
		navigateToCarouselAdmin() {
			console.log('尝试跳转到轮播图管理页面')

			// 双重权限验证
			if (!this.isAdmin()) {
				console.warn('非管理员用户尝试访问轮播图管理页面，被拒绝')
				uni.showToast({
					title: '权限不足',
					icon: 'none'
				})
				return
			}

			console.log('管理员权限验证通过，跳转到轮播图管理页面')
			uni.vibrateShort() // 短震动反馈

			// 跳转到轮播图管理页面
			uni.navigateTo({
				url: '/pages/carousel-admin/carousel-admin'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.settings-container {
	width: 100%;
	min-height: 100vh;
	background-color: $uni-bg-color-grey;
	position: relative;
}


// 内容区域
.content {
	width: 100%;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

// 设置项组
.setting-group {
	background-color: $uni-bg-color;
	margin-bottom: 20rpx;
	border-radius: 0;
	overflow: hidden;
}

// 设置项
.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 32rpx;
	border-bottom: 1rpx solid $uni-border-color;
	min-height: 112rpx;
	transition: background-color 0.2s ease;
	position: relative;
}

.setting-item:last-child {
	border-bottom: none;
}

.setting-item:active {
	background-color: $uni-bg-color-hover;
}

.setting-item-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.setting-icon {
	width: 48rpx;
	height: 48rpx;
	margin-right: 24rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $primary-cambridge-blue;
}

.setting-label {
	font-size: 32rpx;
	color: $uni-text-color;
	flex: 1;
	line-height: 1.4;
}

.setting-right {
	display: flex;
	align-items: center;
}

.setting-arrow {
	width: 16rpx;
	height: 28rpx;
	border-top: 3rpx solid $uni-text-color-grey;
	border-right: 3rpx solid $uni-text-color-grey;
	transform: rotate(45deg);
	margin-left: 16rpx;
}

// 字体大小控制
.font-size-controls {
	display: flex;
	gap: 16rpx;
}

.font-size-btn {
	padding: 12rpx 24rpx;
	border: 2rpx solid $uni-border-color;
	border-radius: 12rpx;
	background-color: $uni-bg-color;
	color: $uni-text-color;
	font-size: 28rpx;
	text-align: center;
	transition: all 0.2s ease;
	min-width: 100rpx;
	line-height: 1.2;
}

.font-size-btn:active {
	transform: scale(0.95);
}

.font-size-btn.active {
	background-color: $primary-cambridge-blue;
	color: #ffffff;
	border-color: $primary-cambridge-blue;
}

// 动画效果
.setting-group {
	animation: fadeInUp 0.3s ease-out;
}

.setting-item {
	animation: fadeInUp 0.3s ease-out;
	animation-fill-mode: both;
}

.setting-item:nth-child(1) { animation-delay: 0.1s; }
.setting-item:nth-child(2) { animation-delay: 0.2s; }
.setting-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

// 移动端优化
@media (max-width: 375px) {
	.setting-item {
		padding: 28rpx 24rpx;
		min-height: 104rpx;
	}

	.setting-label {
		font-size: 30rpx;
	}

	.font-size-btn {
		font-size: 26rpx;
		padding: 10rpx 20rpx;
		min-width: 90rpx;
	}
}

// 大字体模式适配（当全局字体大小设置为大字体时）
.settings-container.large-font {
	.setting-item {
		min-height: 128rpx;
		padding: 36rpx 32rpx;
	}

	.setting-label {
		font-size: 36rpx;
	}

	.font-size-btn {
		font-size: 32rpx;
		padding: 16rpx 32rpx;
		min-width: 120rpx;
	}
}

// 触摸优化
.setting-item {
	-webkit-tap-highlight-color: transparent;
}

// 无障碍支持
.setting-item:focus {
	outline: 3rpx solid $primary-cambridge-blue;
	outline-offset: -3rpx;
}
</style>