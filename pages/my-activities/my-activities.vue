<template>
	<view class="container">
		<!-- 顶部标题栏 -->
		<view class="header">
			<text class="header-title">我的活动</text>
		</view>

		<!-- 主内容区域 -->
		<view class="main-content">
			<!-- 标签页导航 -->
			<view class="tabs-container">
				<view class="tabs-list">
					<view
						class="tab-item"
						:class="{ active: currentTab === 'registered' }"
						@click="switchTab('registered')"
					>
						<text class="tab-text">我的报名</text>
						<view class="tab-badge" v-if="registeredActivities.length > 0">
							<text class="badge-text">{{ registeredActivities.length }}</text>
						</view>
					</view>
					<view
						class="tab-item"
						:class="{ active: currentTab === 'published' }"
						@click="switchTab('published')"
					>
						<text class="tab-text">我的发布</text>
						<view class="tab-badge" v-if="publishedActivities.length > 0">
							<text class="badge-text">{{ publishedActivities.length }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 搜索框 -->
			<view class="search-container">
				<view class="search-input-wrapper">
					<text class="search-icon">🔍</text>
					<input
						class="search-input"
						type="text"
						v-model="searchQuery"
						placeholder="搜索活动名称、地点、关键词..."
						placeholder-class="search-placeholder"
						@input="handleSearch"
					/>
				</view>
			</view>

			<!-- 我的报名 -->
			<view v-show="currentTab === 'registered'" class="tab-content">
				<view v-if="filteredRegisteredActivities.length > 0" class="activities-list">
					<view
						v-for="activity in filteredRegisteredActivities"
						:key="activity.id"
						class="activity-card"
						@click="viewActivityDetail(activity.id)"
					>
						<view class="activity-header">
							<text class="activity-title">{{ activity.title }}</text>
							<view class="status-badge" :class="getStatusClass(activity.status)">
								<text class="status-text">{{ getStatusText(activity.status) }}</text>
							</view>
						</view>

						<view class="activity-info">
							<view class="info-item">
								<text class="info-icon">📅</text>
								<text class="info-text">{{ activity.date }}</text>
							</view>
							<view class="info-item">
								<text class="info-icon">🕐</text>
								<text class="info-text">{{ activity.time }}</text>
							</view>
							<view class="info-item">
								<text class="info-icon">📍</text>
								<text class="info-text">{{ activity.location }}</text>
							</view>
							<view class="info-item">
								<text class="info-icon">🎫</text>
								<text class="info-text">已报名</text>
							</view>
						</view>

						<view class="activity-actions">
							<button class="action-btn secondary" @click.stop="viewActivityDetail(activity.id)">
								<text class="btn-text">查看详情</text>
							</button>
							<button
								v-if="activity.status === 'upcoming'"
								class="action-btn outline"
								@click.stop="cancelRegistration(activity.id)"
							>
								<text class="btn-text">取消报名</text>
							</button>
							<button
								v-if="activity.status === 'ongoing'"
								class="action-btn primary"
								@click.stop="checkIn(activity.id)"
							>
								<text class="btn-text">签到</text>
							</button>
							<button
								v-if="activity.status === 'completed'"
								class="action-btn primary"
								@click.stop="rateActivity(activity.id)"
							>
								<text class="btn-text">评价活动</text>
							</button>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-else class="empty-state">
					<text class="empty-icon">📅</text>
					<text class="empty-title">暂无报名的活动</text>
					<text class="empty-desc">快去发现感兴趣的活动吧！</text>
					<button class="empty-btn" @click="goToActivities">
						<text class="btn-text">浏览活动</text>
					</button>
				</view>
			</view>

			<!-- 我的发布 -->
			<view v-show="currentTab === 'published'" class="tab-content">
				<view v-if="filteredPublishedActivities.length > 0" class="activities-list">
					<view
						v-for="activity in filteredPublishedActivities"
						:key="activity.id"
						class="activity-card"
						@click="viewActivityDetail(activity.id)"
					>
						<view class="activity-header">
							<text class="activity-title">{{ activity.title }}</text>
							<view class="status-badge" :class="getStatusClass(activity.status)">
								<text class="status-text">{{ getStatusText(activity.status) }}</text>
							</view>
						</view>

						<view class="activity-info">
							<view class="info-item">
								<text class="info-icon">📅</text>
								<text class="info-text">{{ activity.date }}</text>
							</view>
							<view class="info-item">
								<text class="info-icon">🕐</text>
								<text class="info-text">{{ activity.time }}</text>
							</view>
							<view class="info-item">
								<text class="info-icon">📍</text>
								<text class="info-text">{{ activity.location }}</text>
							</view>
							<view class="info-item">
								<text class="info-icon">👥</text>
								<text class="info-text">限{{ activity.maxParticipants }}人，已报名{{ activity.registeredCount }}人</text>
							</view>
						</view>

						<view class="activity-actions">
							<button
								v-if="activity.status === 'upcoming'"
								class="action-btn primary"
								@click.stop="editActivity(activity.id)"
							>
								<text class="btn-text">编辑活动</text>
							</button>
							<button class="action-btn secondary" @click.stop="viewActivityDetail(activity.id)">
								<text class="btn-text">查看详情</text>
							</button>
							<button
								v-if="activity.status === 'completed'"
								class="action-btn outline"
								@click.stop="republishActivity(activity.id)"
							>
								<text class="btn-text">重新发布</text>
							</button>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view v-else class="empty-state">
					<text class="empty-icon">📝</text>
					<text class="empty-title">暂无发布的活动</text>
					<text class="empty-desc">快来发布你的第一个活动吧！</text>
					<button class="empty-btn" @click="createActivity">
						<text class="btn-text">创建活动</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 'registered',
			searchQuery: '',
			userRole: 'user', // user, organizer, admin

			// 模拟报名的活动数据
			registeredActivities: [
				{
					id: 'r1',
					title: '传统太极拳养生课程',
					date: '每周二、四',
					time: '9:00-10:30',
					location: '朝阳公园',
					status: 'upcoming', // upcoming, ongoing, completed, cancelled
					registeredAt: '2024-01-15'
				},
				{
					id: 'r2',
					title: '成人书法入门班',
					date: '每周六',
					time: '14:00-16:00',
					location: '文化中心',
					status: 'ongoing',
					registeredAt: '2024-01-10'
				},
				{
					id: 'r3',
					title: '中老年健康养生讲座',
					date: '12月15日',
					time: '14:00-16:00',
					location: '海淀医院',
					status: 'completed',
					registeredAt: '2024-12-01'
				}
			],

			// 模拟发布的活动数据
			publishedActivities: [
				{
					id: 'p1',
					title: '传统太极拳养生课程',
					date: '2024年1月20日开始',
					time: '9:00-10:30',
					location: '朝阳公园',
					status: 'upcoming',
					maxParticipants: 20,
					registeredCount: 15,
					createdAt: '2024-01-10'
				},
				{
					id: 'p2',
					title: '成人书法入门班',
					date: '每周六',
					time: '14:00-16:00',
					location: '文化中心',
					status: 'ongoing',
					maxParticipants: 12,
					registeredCount: 10,
					createdAt: '2024-01-05'
				},
				{
					id: 'p3',
					title: '交谊舞基础班',
					date: '2023年12月20日结束',
					time: '19:00-20:30',
					location: '社区活动中心',
					status: 'completed',
					maxParticipants: 16,
					registeredCount: 16,
					createdAt: '2023-12-01'
				}
			]
		}
	},

	computed: {
		// 过滤后的报名活动
		filteredRegisteredActivities() {
			if (!this.searchQuery) {
				return this.registeredActivities
			}
			const query = this.searchQuery.toLowerCase()
			return this.registeredActivities.filter(activity =>
				activity.title.toLowerCase().includes(query) ||
				activity.location.toLowerCase().includes(query)
			)
		},

		// 过滤后的发布活动
		filteredPublishedActivities() {
			if (!this.searchQuery) {
				return this.publishedActivities
			}
			const query = this.searchQuery.toLowerCase()
			return this.publishedActivities.filter(activity =>
				activity.title.toLowerCase().includes(query) ||
				activity.location.toLowerCase().includes(query)
			)
		}
	},

	onLoad() {
		console.log('我的活动页面加载')
		this.checkUserRole()
	},

	onShow() {
		this.checkUserRole()
		this.loadActivities()
	},

	methods: {
		// 检查用户角色
		checkUserRole() {
			try {
				const savedRole = uni.getStorageSync('userRole')
				if (savedRole) {
					this.userRole = savedRole
				} else {
					this.userRole = 'user'
				}
				console.log('当前用户角色:', this.userRole)
			} catch (error) {
				console.error('获取用户角色失败:', error)
				this.userRole = 'user'
			}
		},

		// 加载活动数据
		loadActivities() {
			// 这里应该从服务器加载数据
			// 暂时使用模拟数据
			console.log('加载活动数据')
		},

		// 切换标签页
		switchTab(tabName) {
			this.currentTab = tabName
			uni.vibrateShort()
		},

		// 处理搜索
		handleSearch() {
			// 搜索逻辑已通过计算属性实现
			console.log('搜索:', this.searchQuery)
		},

		// 获取状态样式类
		getStatusClass(status) {
			const statusMap = {
				'upcoming': 'status-upcoming',
				'ongoing': 'status-ongoing',
				'completed': 'status-completed',
				'cancelled': 'status-cancelled'
			}
			return statusMap[status] || 'status-upcoming'
		},

		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				'upcoming': '即将开始',
				'ongoing': '进行中',
				'completed': '已结束',
				'cancelled': '已取消'
			}
			return statusMap[status] || '即将开始'
		},

		// 查看活动详情
		viewActivityDetail(activityId) {
			console.log('查看活动详情:', activityId)
			uni.navigateTo({
				url: `/pages/activity-detail/activity-detail?id=${activityId}`
			})
		},

		// 取消报名
		cancelRegistration(activityId) {
			uni.showModal({
				title: '取消报名',
				content: '确定要取消报名吗？',
				success: (res) => {
					if (res.confirm) {
						console.log('取消报名:', activityId)
						// 这里应该调用API取消报名
						// 暂时从本地数据中移除
						const index = this.registeredActivities.findIndex(a => a.id === activityId)
						if (index > -1) {
							this.registeredActivities.splice(index, 1)
						}
						uni.showToast({
							title: '已取消报名',
							icon: 'success'
						})
					}
				}
			})
		},

		// 签到
		checkIn(activityId) {
			console.log('签到:', activityId)
			uni.showToast({
				title: '签到成功',
				icon: 'success'
			})
			// 这里应该调用API进行签到
		},

		// 评价活动
		rateActivity(activityId) {
			console.log('评价活动:', activityId)
			uni.navigateTo({
				url: `/pages/activity-detail/activity-detail?id=${activityId}&action=rate`
			})
		},

		// 编辑活动
		editActivity(activityId) {
			console.log('编辑活动:', activityId)
			uni.navigateTo({
				url: `/pages/create-activity/create-activity?id=${activityId}&action=edit`
			})
		},

		// 重新发布活动
		republishActivity(activityId) {
			console.log('重新发布活动:', activityId)
			uni.navigateTo({
				url: `/pages/create-activity/create-activity?id=${activityId}&action=republish`
			})
		},

		// 跳转到活动浏览页面
		goToActivities() {
			uni.switchTab({
				url: '/pages/index/index'
			})
		},

		// 创建活动
		createActivity() {
			// 检查用户权限
			if (this.userRole === 'organizer' || this.userRole === 'admin') {
				uni.navigateTo({
					url: '/pages/create-activity/create-activity'
				})
			} else {
				uni.showModal({
					title: '权限不足',
					content: '请先完成主办方认证',
					showCancel: true,
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/organizer-auth/organizer-auth'
							})
						}
					}
				})
			}
		}
	}
}
</script>

<style lang="scss">
/* 基础颜色定义 */
$primary-cambridge-blue: #75b09c;
$primary-pistachio: #a0ca92;
$primary-lion: #998650;
$primary-old-gold: #e0be36;

/* 基础样式变量 */
$uni-bg-color: #ffffff;
$uni-bg-color-grey: #f8f9fa;
$uni-bg-color-hover: #f1f1f1;
$uni-border-color: #e9ecef;
$uni-text-color: #333333;
$uni-text-color-inverse: #ffffff;
$uni-text-color-grey: #999999;
$uni-text-color-placeholder: #808080;
$uni-border-radius-md: 8px;
$uni-border-radius-lg: 12px;
$uni-border-radius-sm: 4px;
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
$shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;

.container {
	background-color: $uni-bg-color-grey;
	min-height: 100vh;
}

/* 顶部标题栏 */
.header {
	background-color: $uni-bg-color;
	padding: 24rpx;
	text-align: center;
	border-bottom: 1rpx solid $uni-border-color;
	position: sticky;
	top: 0;
	z-index: 100;
}

.header-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $uni-text-color;
}

/* 主内容区域 */
.main-content {
	padding: 24rpx;
}

/* 标签页导航 */
.tabs-container {
	margin-bottom: 32rpx;
}

.tabs-list {
	display: flex;
	background-color: $uni-bg-color-hover;
	border-radius: $uni-border-radius-lg;
	padding: 8rpx;
}

.tab-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16rpx 24rpx;
	border-radius: $uni-border-radius-md;
	transition: all 0.3s ease;
	position: relative;
}

.tab-item.active {
	background-color: $uni-bg-color;
	box-shadow: $shadow-sm;
}

.tab-text {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color-grey;
}

.tab-item.active .tab-text {
	color: $uni-text-color;
}

.tab-badge {
	margin-left: 8rpx;
	background-color: $primary-cambridge-blue;
	color: $uni-text-color-inverse;
	padding: 4rpx 12rpx;
	border-radius: 32rpx;
	min-width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.badge-text {
	font-size: 20rpx;
	font-weight: 600;
}

/* 搜索框 */
.search-container {
	margin-bottom: 32rpx;
}

.search-input-wrapper {
	position: relative;
	background-color: $uni-bg-color;
	border-radius: $uni-border-radius-lg;
	border: 2rpx solid $uni-border-color;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
}

.search-input {
	flex: 1;
	height: 88rpx;
	font-size: 28rpx;
	color: $uni-text-color;
	padding: 0 16rpx;
}

.search-icon {
	font-size: 32rpx;
	color: $uni-text-color-grey;
}

.search-placeholder {
	color: $uni-text-color-placeholder;
}

/* 活动列表 */
.activities-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

/* 活动卡片 */
.activity-card {
	background-color: $uni-bg-color;
	border-radius: $uni-border-radius-lg;
	border: 1rpx solid $uni-border-color;
	padding: 32rpx;
	transition: all 0.3s ease;
}

.activity-card:active {
	transform: scale(0.98);
}

.activity-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 24rpx;
	gap: 16rpx;
}

.activity-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
	flex: 1;
	line-height: 1.4;
}

/* 状态标签 */
.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 32rpx;
	font-size: 20rpx;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.status-upcoming {
	background-color: $primary-cambridge-blue;
	color: $uni-text-color-inverse;
}

.status-ongoing {
	background-color: $uni-color-warning;
	color: $uni-text-color-inverse;
}

.status-completed {
	background-color: $uni-color-success;
	color: $uni-text-color-inverse;
}

.status-cancelled {
	background-color: $uni-color-error;
	color: $uni-text-color-inverse;
}

/* 活动信息 */
.activity-info {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200rpx, 1fr));
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.info-icon {
	font-size: 24rpx;
	width: 24rpx;
	height: 24rpx;
	flex-shrink: 0;
}

.info-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

/* 活动操作 */
.activity-actions {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.action-btn {
	flex: 1;
	min-width: 120rpx;
	height: 72rpx;
	border-radius: $uni-border-radius-md;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24rpx;
	transition: all 0.3s ease;
}

.action-btn:active {
	transform: scale(0.95);
}

.btn-text {
	font-size: 24rpx;
	font-weight: 500;
}

.action-btn.primary {
	background-color: $primary-cambridge-blue;
	color: $uni-text-color-inverse;
}

.action-btn.secondary {
	background-color: $primary-pistachio;
	color: $primary-lion;
}

.action-btn.outline {
	background-color: transparent;
	color: $primary-cambridge-blue;
	border: 2rpx solid $primary-cambridge-blue;
}

/* 空状态 */
.empty-state {
	text-align: center;
	padding: 120rpx 40rpx;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 24rpx;
	opacity: 0.5;
}

.empty-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
	display: block;
	margin-bottom: 16rpx;
}

.empty-desc {
	font-size: 28rpx;
	color: $uni-text-color-grey;
	display: block;
	margin-bottom: 48rpx;
}

.empty-btn {
	background-color: $primary-cambridge-blue;
	color: $uni-text-color-inverse;
	padding: 24rpx 48rpx;
	border-radius: $uni-border-radius-md;
	border: none;
	min-width: 200rpx;
	height: 80rpx;
}

/* 响应式优化 */
@media (max-width: 375px) {
	.activity-info {
		grid-template-columns: 1fr;
	}

	.activity-actions {
		flex-direction: column;
	}

	.tabs-list {
		padding: 4rpx;
	}

	.tab-item {
		padding: 12rpx 16rpx;
	}

	.tab-text {
		font-size: 24rpx;
	}
}

/* 适老化增强 */
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}

@media (prefers-contrast: high) {
	.search-input-wrapper {
		border-width: 4rpx;
	}

	.activity-card {
		border-width: 2rpx;
	}
}
</style>