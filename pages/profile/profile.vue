<template>
	<view class="container">
		<!-- 用户信息区域 -->
		<view class="profile-section">
			<view class="profile-header">
				<view class="avatar-container" @click="navigateToEditProfile">
					<image
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
						class="avatar-image"
						mode="aspectFill">
					</image>
					<view class="edit-badge">
						<text class="edit-icon">✏️</text>
					</view>
				</view>
				<view class="profile-info" @click="navigateToEditProfile">
					<text class="profile-name">张大爷</text>
					<text class="profile-subtitle">活跃用户 · 注册于2024年</text>
					<view class="stats-container">
						<view class="stat-item">
							<text class="stat-number">128</text>
							<text class="stat-label">参与活动</text>
						</view>
						<view class="stat-item">
							<text class="stat-number">89</text>
							<text class="stat-label">收藏活动</text>
						</view>
						<view class="stat-item">
							<text class="stat-number">4.9</text>
							<text class="stat-label">用户评分</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 快捷操作 -->
		<view class="quick-actions-section">
			<text class="section-title">快捷操作</text>
			<view class="actions-grid">
				<view class="action-item" @click="handleAction('register')">
					<text class="action-icon">➕</text>
					<text class="action-label">报名活动</text>
				</view>
				<view class="action-item" @click="handleAction('help')">
					<text class="action-icon">❓</text>
					<text class="action-label">帮助中心</text>
				</view>
				<view class="action-item" @click="handleAction('publish')" v-if="userRole === 'organizer' || userRole === 'admin'">
					<text class="action-icon">📢</text>
					<text class="action-label">发布活动</text>
				</view>
				<view class="action-item" @click="handleAction('auth')" v-if="userRole === 'user'">
					<text class="action-icon">📝</text>
					<text class="action-label">认证申请</text>
				</view>
			</view>
		</view>

		<!-- 我的活动 -->
		<view class="activities-section">
			<view class="section-header">
				<text class="section-title">我的活动</text>
				<text class="section-more" @click="viewAllActivities">查看全部 →</text>
			</view>
			<view class="activities-list">
				<view
					class="activity-item"
					v-for="activity in myActivities"
					:key="activity.id"
					@click="viewActivityDetail(activity.id)">
					<view class="activity-icon-container" :class="activity.statusClass">
						<text class="activity-icon">{{activity.icon}}</text>
					</view>
					<view class="activity-content">
						<text class="activity-title">{{activity.title}}</text>
						<text class="activity-meta">{{activity.date}} · {{activity.location}}</text>
					</view>
					<view class="activity-status">
						<text class="status-badge" :class="activity.statusClass">{{activity.statusText}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 设置区域 -->
		<view class="settings-section">
			<text class="section-title">设置</text>
			<view class="settings-list">
				<view
					class="setting-item"
					v-for="setting in visibleSettings"
					:key="setting.id"
					@click="navigateToSetting(setting.id)">
					<view class="setting-left">
						<text class="setting-icon">{{setting.icon}}</text>
						<text class="setting-label">{{setting.label}}</text>
					</view>
					<text class="setting-arrow">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userRole: 'user', // 用户角色：user(普通用户), organizer(认证用户), admin(管理员)
			isOrganizerAuthenticated: false, // 用户认证状态
			myActivities: [
				{
					id: 1,
					title: '书法班入门',
					date: '2025-01-20',
					location: '文化中心',
					icon: '✅',
					status: 'completed',
					statusText: '已完成',
					statusClass: 'status-completed'
				},
				{
					id: 2,
					title: '健康讲座',
					date: '2025-01-25',
					location: '健康中心',
					icon: '📅',
					status: 'upcoming',
					statusText: '即将开始',
					statusClass: 'status-upcoming'
				},
				{
					id: 3,
					title: '摄影交流',
					date: '2025-02-01',
					location: '公园',
					icon: '📷',
					status: 'registered',
					statusText: '已报名',
					statusClass: 'status-registered'
				}
			],
			settings: [
				{
					id: 'account',
					icon: '⚙️',
					label: '账号设置',
					visibleTo: ['user', 'organizer', 'admin'] // 所有角色可见
				},
				{
					id: 'about',
					icon: 'ℹ️',
					label: '关于我们',
					visibleTo: ['user', 'organizer', 'admin'] // 所有角色可见
				}
			]
		}
	},
	computed: {
		// 根据用户角色过滤可见的设置项
		visibleSettings() {
			return this.settings.filter(setting =>
				setting.visibleTo && setting.visibleTo.includes(this.userRole)
			)
		}
	},
	onLoad() {
		console.log('个人中心页面加载')
		this.checkUserStatus()
	},
	onShow() {
		// 每次显示页面时都重新检查用户状态
		this.checkUserStatus()
	},
	methods: {
		handleAction(action) {
			console.log('快捷操作:', action)
			uni.vibrateShort() // 添加触觉反馈

			switch(action) {
				case 'publish':
					// 发布活动 - 只有 organizer 和 admin 角色能访问
					console.log('用户角色:', this.userRole, '尝试发布活动')

					// 双重验证：UI层已控制，这里再验证一次
					if (this.userRole === 'organizer' || this.userRole === 'admin') {
						uni.navigateTo({
							url: '/pages/create-activity/create-activity'
						})
					} else {
						console.warn('非认证用户尝试发布活动，被拒绝')
						uni.showToast({
							title: '请先完成认证',
							icon: 'none'
						})
					}
					break
				case 'auth':
					// 认证申请 - 只有 user 角色能看到
					console.log('用户角色:', this.userRole, '申请认证')

					if (this.userRole === 'user') {
						uni.navigateTo({
							url: '/pages/organizer-auth/organizer-auth'
						})
					} else {
						console.warn('非user角色尝试申请认证，被拒绝')
						uni.showToast({
							title: '您已完成认证',
							icon: 'none'
						})
					}
					break
				case 'register':
					// 跳转到首页的推荐活动位置
					uni.switchTab({
						url: '/pages/index/index',
						success: () => {
							// 延迟跳转确保页面加载完成
							setTimeout(() => {
								// 使用 uni.pageScrollTo 滚动到推荐活动位置
								const query = uni.createSelectorQuery()
								query.select('#recommended-activities').boundingClientRect()
								query.selectViewport().scrollOffset()
								query.exec(function(res) {
									if (res[0]) {
										const scrollTop = res[0].top + (res[1] ? res[1].scrollTop : 0)
										uni.pageScrollTo({
											scrollTop: scrollTop,
											duration: 300
										})
									}
								})
							}, 300)
						}
					})
					break
				case 'help':
					uni.showToast({
						title: '帮助中心',
						icon: 'none'
					})
					break
				default:
					uni.showToast({
						title: `操作: ${action}`,
						icon: 'none'
					})
			}
		},

		// 检查用户状态（包括角色和认证状态）
		checkUserStatus() {
			try {
				console.log('=== 个人中心页面权限检查开始 ===')

				// 从本地存储获取用户角色
				const savedRole = uni.getStorageSync('userRole')
				console.log('从存储获取的角色:', savedRole)

				if (savedRole) {
					this.userRole = savedRole
				} else {
					// 如果没有存储过，默认为普通用户
					this.userRole = 'user'
				}

				// 从本地存储获取认证状态
				const authStatus = uni.getStorageSync('organizerAuthenticated')
				if (authStatus !== undefined) {
					this.isOrganizerAuthenticated = authStatus
				} else {
					// 如果没有存储过，默认为未认证
					this.isOrganizerAuthenticated = false
				}

				console.log('个人中心 - 当前用户角色:', this.userRole)
				console.log('个人中心 - 当前认证状态:', this.isOrganizerAuthenticated)
				console.log('个人中心 - 发布活动可见性:', this.userRole === 'organizer' || this.userRole === 'admin')
				console.log('个人中心 - 认证申请可见性:', this.userRole === 'user')
				console.log('=== 个人中心页面权限检查结束 ===')
			} catch (error) {
				console.error('检查用户状态失败:', error)
				this.userRole = 'user'
				this.isOrganizerAuthenticated = false
			}
		},

		viewAllActivities() {
			console.log('查看所有活动')
			uni.showToast({
				title: '查看所有活动',
				icon: 'none'
			})
		},

		viewActivityDetail(activityId) {
			console.log('查看活动详情:', activityId)
			uni.showToast({
				title: `活动ID: ${activityId}`,
				icon: 'none'
			})
		},

		navigateToSetting(settingId) {
			console.log('设置项点击:', settingId)

			// 所有设置项都跳转到设置页面，具体的权限控制在设置页面内部处理
			uni.navigateTo({
				url: '/pages/settings/settings'
			})
		},

	navigateToEditProfile() {
			uni.navigateTo({
				url: '/pages/edit-profile/edit-profile'
			})
		}
}
}
</script>

<style>
/* 基础容器样式 */
.container {
	background-color: #f8fafc;
	min-height: 100vh;
	padding-bottom: 140rpx;
}

/* 用户信息区域样式 */
.profile-section {
	background-color: #ffffff;
	margin-bottom: 24rpx;
	padding: 32rpx 24rpx;
	border-radius: 0;
}

.profile-header {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.avatar-container {
	position: relative;
}

.avatar-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid #998650;
	object-fit: cover;
}

.edit-badge {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 32rpx;
	height: 32rpx;
	background-color: #998650;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2rpx solid #ffffff;
}

.edit-icon {
	font-size: 16rpx;
}

.profile-info {
	flex: 1;
}

.profile-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #1f2937;
	display: block;
	margin-bottom: 8rpx;
}

.profile-subtitle {
	font-size: 24rpx;
	color: #6b7280;
	display: block;
	margin-bottom: 16rpx;
}

.stats-container {
	display: flex;
	gap: 32rpx;
}

.stat-item {
	text-align: center;
}

.stat-number {
	font-size: 28rpx;
	font-weight: 600;
	color: #75b09c;
	display: block;
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 20rpx;
	color: #6b7280;
}

/* 快捷操作样式 */
.quick-actions-section {
	background-color: #ffffff;
	margin-bottom: 24rpx;
	padding: 24rpx;
	border-radius: 0;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1f2937;
	display: block;
	margin-bottom: 24rpx;
}

.actions-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16rpx;
}

.action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx 12rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #75b09c, #a0ca92);
	color: #ffffff;
	transition: all 0.3s ease;
}

.action-item:active {
	transform: scale(0.95);
}

.action-icon {
	font-size: 32rpx;
	margin-bottom: 8rpx;
}

.action-label {
	font-size: 20rpx;
	font-weight: 500;
}

/* 我的活动样式 */
.activities-section {
	background-color: #ffffff;
	margin-bottom: 24rpx;
	padding: 24rpx;
	border-radius: 0;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-more {
	font-size: 24rpx;
	color: #75b09c;
}

.activities-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.activity-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	border-radius: 20rpx;
	border: 1rpx solid #f1f5f9;
	transition: all 0.3s ease;
}

.activity-item:active {
	transform: scale(0.98);
	background-color: #f8fafc;
}

.activity-icon-container {
	width: 80rpx;
	height: 80rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.status-completed {
	background-color: #75b09c;
}

.status-upcoming {
	background-color: #fbbf24;
}

.status-registered {
	background-color: #3b82f6;
}

.activity-icon {
	font-size: 32rpx;
	color: #ffffff;
}

.activity-content {
	flex: 1;
}

.activity-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #1f2937;
	display: block;
	margin-bottom: 4rpx;
}

.activity-meta {
	font-size: 24rpx;
	color: #6b7280;
}

.activity-status {
	margin-left: auto;
}

.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 32rpx;
	font-size: 20rpx;
	font-weight: 500;
}

.status-completed {
	background-color: #d1fae5;
	color: #065f46;
}

.status-upcoming {
	background-color: #fef3c7;
	color: #92400e;
}

.status-registered {
	background-color: #dbeafe;
	color: #1e40af;
}

/* 设置区域样式 */
.settings-section {
	background-color: #ffffff;
	margin-bottom: 24rpx;
	padding: 24rpx;
	border-radius: 0;
}

.settings-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	border-radius: 16rpx;
	border: 1rpx solid #f1f5f9;
	transition: all 0.3s ease;
}

.setting-item:active {
	transform: scale(0.98);
	background-color: #f8fafc;
}

.setting-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.setting-icon {
	font-size: 24rpx;
}

.setting-label {
	font-size: 28rpx;
	color: #1f2937;
	font-weight: 500;
}

.setting-arrow {
	font-size: 24rpx;
	color: #9ca3af;
	font-weight: 600;
}
</style>