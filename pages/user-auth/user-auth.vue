<template>
	<view class="auth-container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<text class="header-title">用户认证管理</text>
			<view class="header-actions">
				<view class="filter-btn" @click="toggleFilter">
					<text class="filter-icon">🔍</text>
				</view>
				<view class="search-box">
					<input
						class="search-input"
						type="text"
						v-model="searchKeyword"
						placeholder="搜索用户..."
						@input="handleSearch"
					/>
				</view>
			</view>
		</view>

		<!-- 统计卡片 -->
		<view class="stats-section">
			<view class="stats-grid">
				<view class="stat-card total-card">
					<view class="stat-content">
						<text class="stat-label">B端企业</text>
						<text class="stat-number">{{stats.total}}</text>
					</view>
					<text class="stat-icon">🏢</text>
				</view>
				<view class="stat-card pending-card">
					<view class="stat-content">
						<text class="stat-label">待审核</text>
						<text class="stat-number">{{stats.pending}}</text>
					</view>
					<text class="stat-icon">⏰</text>
				</view>
				<view class="stat-card approved-card">
					<view class="stat-content">
						<text class="stat-label">已认证</text>
						<text class="stat-number">{{stats.approved}}</text>
					</view>
					<text class="stat-icon">✅</text>
				</view>
				<view class="stat-card rejected-card">
					<view class="stat-content">
						<text class="stat-label">已拒绝</text>
						<text class="stat-number">{{stats.rejected}}</text>
					</view>
					<text class="stat-icon">❌</text>
				</view>
			</view>
		</view>

		<!-- 筛选器 -->
		<view class="filter-section" v-show="showFilter">
			<view class="filter-content">
				<text class="filter-label">筛选：</text>
				<view class="filter-chips">
					<view
						class="filter-chip"
						:class="{ active: currentFilter === 'all' }"
						@click="filterUsers('all')">
						<text class="chip-text">全部</text>
					</view>
					<view
						class="filter-chip"
						:class="{ active: currentFilter === 'pending' }"
						@click="filterUsers('pending')">
						<text class="chip-text">待审核</text>
					</view>
					<view
						class="filter-chip"
						:class="{ active: currentFilter === 'approved' }"
						@click="filterUsers('approved')">
						<text class="chip-text">已通过</text>
					</view>
					<view
						class="filter-chip"
						:class="{ active: currentFilter === 'rejected' }"
						@click="filterUsers('rejected')">
						<text class="chip-text">已拒绝</text>
					</view>
				</view>
				<view class="filter-selects">
					<picker
						class="enterprise-type-picker"
						:range="enterpriseTypes"
						:value="selectedTypeIndex"
						@change="onTypeChange">
						<view class="picker-display">
							{{enterpriseTypes[selectedTypeIndex]}}
						</view>
					</picker>
				</view>
			</view>
		</view>

		<!-- 用户列表 -->
		<scroll-view class="user-list" scroll-y :style="{ height: listHeight + 'px' }">
			<view
				class="user-card"
				v-for="user in filteredUsers"
				:key="user.id"
				:data-status="user.status">

				<!-- 用户信息概要 -->
				<view class="user-summary" @click="toggleUserDetail(user.id)">
					<view class="user-avatar" :class="getUserAvatarClass(user)">
						<text class="avatar-icon">{{getUserIcon(user)}}</text>
					</view>
					<view class="user-info">
						<text class="user-name">{{user.enterpriseName}}</text>
						<text class="user-type">{{user.type}} · {{user.category}}</text>
						<text class="user-date">申请时间：{{user.applyDate}}</text>
					</view>
					<view class="user-actions">
						<view class="status-badge" :class="getStatusClass(user)">
							<text class="status-text">{{getStatusText(user)}}</text>
						</view>
						<view class="expand-icon" :class="{ expanded: expandedUser === user.id }">
							<text class="icon">▼</text>
						</view>
					</view>
				</view>

				<!-- 详细信息面板 -->
				<view class="detail-panel" v-show="expandedUser === user.id">
					<view class="detail-content">
						<view class="detail-grid">
							<!-- 企业信息 -->
							<view class="enterprise-info">
								<text class="detail-title">企业信息</text>
								<view class="info-list">
									<view class="info-item">
										<text class="info-label">企业名称：</text>
										<text class="info-value">{{user.enterpriseName}}</text>
									</view>
									<view class="info-item">
										<text class="info-label">企业类型：</text>
										<text class="info-value">{{user.category}}</text>
									</view>
									<view class="info-item">
										<text class="info-label">联系人：</text>
										<text class="info-value">{{user.contactPerson}}</text>
									</view>
									<view class="info-item">
										<text class="info-label">联系电话：</text>
										<text class="info-value">{{user.phone}}</text>
									</view>
									<view class="info-item">
										<text class="info-label">营业执照：</text>
										<text class="info-value">{{user.businessLicense}}</text>
									</view>
									<view class="info-item">
										<text class="info-label">申请时间：</text>
										<text class="info-value">{{user.applyDate}}</text>
									</view>
								</view>
							</view>

							<!-- 认证材料 -->
							<view class="auth-documents">
								<text class="detail-title">认证材料</text>
								<view class="document-list">
									<view
										class="document-item"
										v-for="doc in user.documents"
										:key="doc.id">
										<text class="doc-name">{{doc.name}}</text>
										<image
											class="doc-image"
											:src="doc.image"
											mode="aspectFill"
											@click="previewImage(doc.image)">
										</image>
									</view>
								</view>
							</view>
						</view>

						<!-- 认证审核操作 -->
						<view class="auth-actions" v-if="user.status === 'pending'">
							<text class="action-title">认证审核</text>
							<view class="action-info">
								<text class="info-icon">ℹ️</text>
								<text class="info-text">通过认证后，该企业将获得发布活动的权限</text>
							</view>
							<view class="action-buttons">
								<view
									class="action-btn approve-btn"
									@click="approveUser(user.id)">
									<text class="btn-icon">✅</text>
									<text class="btn-text">通过认证</text>
								</view>
								<view
									class="action-btn reject-btn"
									@click="showRejectReason(user.id)">
									<text class="btn-icon">❌</text>
									<text class="btn-text">拒绝认证</text>
								</view>
							</view>
							<view class="reject-reason" v-if="showingRejectUser === user.id">
								<textarea
									class="reason-input"
									v-model="rejectReason"
									placeholder="请输入拒绝原因..."
									maxlength="200"></textarea>
								<view class="reason-actions">
									<view class="reason-btn cancel-btn" @click="cancelReject">
										<text class="reason-text">取消</text>
									</view>
									<view class="reason-btn confirm-btn" @click="confirmReject(user.id)">
										<text class="reason-text">确认拒绝</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 已认证状态信息 -->
						<view class="auth-status" v-else-if="user.status === 'approved'">
							<text class="status-title">认证状态</text>
							<view class="status-info">
								<view class="status-item">
									<text class="status-label">认证状态：</text>
									<text class="status-value approved">已认证</text>
								</view>
								<view class="status-item">
									<text class="status-label">审核人：</text>
									<text class="status-value">{{user.reviewer || '系统管理员'}}</text>
								</view>
								<view class="status-item">
									<text class="status-label">审核时间：</text>
									<text class="status-value">{{user.reviewTime || user.applyDate}}</text>
								</view>
								<view class="status-item">
									<text class="status-label">发布权限：</text>
									<text class="status-value approved">已开通</text>
								</view>
								<view class="status-item">
									<text class="status-label">已发布活动：</text>
									<text class="status-value">{{user.activityCount || 0}}个</text>
								</view>
							</view>
						</view>

						<!-- 已拒绝状态信息 -->
						<view class="reject-status" v-else-if="user.status === 'rejected'">
							<text class="reject-title">拒绝信息</text>
							<view class="reject-info-list">
								<view class="reject-info-item">
									<text class="reject-label">拒绝原因：</text>
									<text class="reject-value">{{user.rejectReason || '营业执照信息不完整，企业类型不符合平台要求'}}</text>
								</view>
								<view class="reject-info-item">
									<text class="reject-label">审核人：</text>
									<text class="reject-value">{{user.reviewer || '系统管理员'}}</text>
								</view>
								<view class="reject-info-item">
									<text class="reject-label">拒绝时间：</text>
									<text class="reject-value">{{user.rejectTime || user.applyDate}}</text>
								</view>
								<view class="reject-info-item">
									<text class="reject-label">可重新申请：</text>
									<text class="reject-value">是</text>
								</view>
							</view>
						</view>
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
			statusBarHeight: 0,
			listHeight: 600,
			showFilter: false,
			searchKeyword: '',
			currentFilter: 'all',
			expandedUser: null,
			showingRejectUser: null,
			rejectReason: '',
			selectedTypeIndex: 0,
			enterpriseTypes: ['企业类型', '文化教育', '健康医疗', '旅游服务', '其他'],
			stats: {
				total: 156,
				pending: 23,
				approved: 118,
				rejected: 15
			},
			users: [
				{
					id: 'enterprise1',
					enterpriseName: '文化科技有限公司',
					type: 'B端企业用户',
					category: '文化教育',
					contactPerson: '李经理',
					phone: '139****8765',
					businessLicense: '91110108**********23',
					applyDate: '2025-01-15',
					status: 'pending',
					documents: [
						{
							id: 'doc1',
							name: '营业执照',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						},
						{
							id: 'doc2',
							name: '企业法人身份证',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						},
						{
							id: 'doc3',
							name: '组织机构代码证',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						}
					]
				},
				{
					id: 'enterprise2',
					enterpriseName: '健康养生中心',
					type: 'B端企业用户',
					category: '健康医疗',
					contactPerson: '王院长',
					phone: '138****6666',
					businessLicense: '91110108**********45',
					applyDate: '2025-01-14',
					status: 'pending',
					documents: [
						{
							id: 'doc4',
							name: '营业执照',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						},
						{
							id: 'doc5',
							name: '医疗机构执业许可证',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						}
					]
				},
				{
					id: 'enterprise3',
					enterpriseName: '旅游服务有限公司',
					type: 'B端企业用户',
					category: '旅游服务',
					contactPerson: '张经理',
					phone: '135****9999',
					businessLicense: '91110108**********67',
					applyDate: '2025-01-10',
					status: 'approved',
					reviewer: '管理员001',
					reviewTime: '2025-01-10 09:15',
					activityCount: 12,
					documents: [
						{
							id: 'doc6',
							name: '营业执照',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						}
					]
				},
				{
					id: 'enterprise4',
					enterpriseName: '咨询有限公司',
					type: 'B端企业用户',
					category: '其他',
					contactPerson: '赵总',
					phone: '136****9876',
					businessLicense: '91110108**********89',
					applyDate: '2025-01-12',
					status: 'rejected',
					reviewer: '管理员002',
					rejectTime: '2025-01-12 16:45',
					rejectReason: '营业执照信息不完整，企业类型不符合平台要求',
					documents: [
						{
							id: 'doc7',
							name: '营业执照',
							image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
						}
					]
				}
			]
		}
	},

	computed: {
		filteredUsers() {
			let filtered = this.users

			// 按状态筛选
			if (this.currentFilter !== 'all') {
				filtered = filtered.filter(user => user.status === this.currentFilter)
			}

			// 按企业类型筛选
			if (this.selectedTypeIndex > 0) {
				const selectedType = this.enterpriseTypes[this.selectedTypeIndex]
				filtered = filtered.filter(user => user.category === selectedType)
			}

			// 按搜索关键词筛选
			if (this.searchKeyword.trim()) {
				const keyword = this.searchKeyword.toLowerCase()
				filtered = filtered.filter(user =>
					user.enterpriseName.toLowerCase().includes(keyword) ||
					user.contactPerson.toLowerCase().includes(keyword) ||
					user.phone.includes(keyword)
				)
			}

			return filtered
		}
	},

	onLoad() {
		// 获取状态栏高度
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo.statusBarHeight || 0

		// 计算列表高度
		this.calculateListHeight()

		console.log('用户认证管理页面加载')
	},

	methods: {
		calculateListHeight() {
			// 计算可用高度（屏幕高度 - 状态栏 - 导航栏 - 统计卡片）
			const systemInfo = uni.getSystemInfoSync()
			const screenHeight = systemInfo.screenHeight || 667
			const statusBarHeight = this.statusBarHeight
			const headerHeight = 88
			const statsHeight = 120
			const filterHeight = this.showFilter ? 80 : 0

			this.listHeight = screenHeight - statusBarHeight - headerHeight - statsHeight - filterHeight - 40
		},

		goBack() {
			uni.navigateBack()
		},

		toggleFilter() {
			this.showFilter = !this.showFilter
			this.calculateListHeight()
		},

		filterUsers(filter) {
			this.currentFilter = filter
		},

		handleSearch() {
			// 搜索输入处理，计算属性会自动过滤
		},

		onTypeChange(e) {
			this.selectedTypeIndex = e.detail.value
		},

		toggleUserDetail(userId) {
			if (this.expandedUser === userId) {
				this.expandedUser = null
			} else {
				this.expandedUser = userId
			}
		},

		getUserAvatarClass(user) {
			if (user.status === 'pending') return 'avatar-pending'
			if (user.status === 'approved') return 'avatar-approved'
			if (user.status === 'rejected') return 'avatar-rejected'
			return 'avatar-default'
		},

		getUserIcon(user) {
			if (user.category === '文化教育') return '🎨'
			if (user.category === '健康医疗') return '❤️'
			if (user.category === '旅游服务') return '🏢'
			return '🏢'
		},

		getStatusClass(user) {
			if (user.status === 'pending') return 'status-pending'
			if (user.status === 'approved') return 'status-approved'
			if (user.status === 'rejected') return 'status-rejected'
			return ''
		},

		getStatusText(user) {
			if (user.status === 'pending') return '待认证'
			if (user.status === 'approved') return '已认证'
			if (user.status === 'rejected') return '已拒绝'
			return '未知'
		},

		approveUser(userId) {
			uni.showModal({
				title: '确认通过认证',
				content: '确定要通过该用户的认证吗？',
				success: (res) => {
					if (res.confirm) {
						this.processApproval(userId)
					}
				}
			})
		},

		processApproval(userId) {
			const userIndex = this.users.findIndex(u => u.id === userId)
			if (userIndex !== -1) {
				// 更新用户状态
				this.users[userIndex].status = 'approved'
				this.users[userIndex].reviewer = '当前管理员'
				this.users[userIndex].reviewTime = new Date().toLocaleString()

				// 更新统计数据
				this.stats.pending--
				this.stats.approved++

				// 关闭展开面板
				this.expandedUser = null

				// 显示成功提示
				uni.showToast({
					title: '认证已通过',
					icon: 'success'
				})
			}
		},

		showRejectReason(userId) {
			this.showingRejectUser = userId
			this.rejectReason = ''
		},

		cancelReject() {
			this.showingRejectUser = null
			this.rejectReason = ''
		},

		confirmReject(userId) {
			if (!this.rejectReason.trim()) {
				uni.showToast({
					title: '请输入拒绝原因',
					icon: 'none'
				})
				return
			}

			const userIndex = this.users.findIndex(u => u.id === userId)
			if (userIndex !== -1) {
				// 更新用户状态
				this.users[userIndex].status = 'rejected'
				this.users[userIndex].rejectReason = this.rejectReason
				this.users[userIndex].reviewer = '当前管理员'
				this.users[userIndex].rejectTime = new Date().toLocaleString()

				// 更新统计数据
				this.stats.pending--
				this.stats.rejected++

				// 关闭面板
				this.showingRejectUser = null
				this.expandedUser = null
				this.rejectReason = ''

				// 显示成功提示
				uni.showToast({
					title: '认证已拒绝',
					icon: 'success'
				})
			}
		},

		previewImage(imageUrl) {
			uni.previewImage({
				urls: [imageUrl],
				current: imageUrl
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.auth-container {
	width: 100%;
	min-height: 100vh;
	background-color: $uni-bg-color-grey;
	position: relative;
}

// 顶部导航栏
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 88rpx;
	background-color: $uni-bg-color;
	border-bottom: 1rpx solid $uni-border-color;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 1000;
	padding-top: var(--status-bar-height, 0);
}

.back-btn {
	width: 88rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 16rpx;
	height: 28rpx;
	border-left: 4rpx solid $uni-text-color;
	border-bottom: 4rpx solid $uni-text-color;
	transform: rotate(45deg);
	margin-left: 32rpx;
}

.header-title {
	font-size: 32rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding-right: 24rpx;
}

.filter-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.filter-icon {
	font-size: 24rpx;
}

.search-box {
	position: relative;
}

.search-input {
	width: 300rpx;
	height: 60rpx;
	padding: 0 24rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: 30rpx;
	font-size: 24rpx;
	background-color: $uni-bg-color;
}

// 统计卡片
.stats-section {
	background-color: $uni-bg-color;
	margin: calc(88rpx + var(--status-bar-height, 0) + 20rpx) 24rpx 20rpx;
	padding: 24rpx;
	border-radius: 20rpx;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
}

.stat-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 24rpx;
	border-radius: 20rpx;
	color: #ffffff;
	transition: all 0.3s ease;
}

.total-card {
	background: linear-gradient(135deg, $primary-cambridge-blue, $primary-pistachio);
}

.pending-card {
	background: linear-gradient(135deg, $primary-old-gold, #d4a574);
}

.approved-card {
	background: linear-gradient(135deg, $primary-pistachio, $primary-mindaro);
}

.rejected-card {
	background: linear-gradient(135deg, $uni-text-color-grey, #666666);
}

.stat-content {
	display: flex;
	flex-direction: column;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.9;
	margin-bottom: 8rpx;
}

.stat-number {
	font-size: 36rpx;
	font-weight: 600;
}

.stat-icon {
	font-size: 32rpx;
}

// 筛选器
.filter-section {
	background-color: $uni-bg-color;
	margin: 0 24rpx 20rpx;
	padding: 24rpx;
	border-radius: 20rpx;
}

.filter-content {
	display: flex;
	align-items: center;
	gap: 16rpx;
	flex-wrap: wrap;
}

.filter-label {
	font-size: 28rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.filter-chips {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
}

.filter-chip {
	padding: 12rpx 24rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: 30rpx;
	background-color: $uni-bg-color;
	transition: all 0.2s ease;
}

.filter-chip.active {
	background-color: $primary-cambridge-blue;
	border-color: $primary-cambridge-blue;
}

.filter-chip.active .chip-text {
	color: #ffffff;
}

.chip-text {
	font-size: 24rpx;
	color: $uni-text-color;
}

.filter-selects {
	margin-left: auto;
}

.enterprise-type-picker {
	min-width: 200rpx;
}

.picker-display {
	padding: 12rpx 24rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: 30rpx;
	font-size: 24rpx;
	color: $uni-text-color;
	text-align: center;
}

// 用户列表
.user-list {
	padding: 0 24rpx 40rpx;
}

.user-card {
	background-color: $uni-bg-color;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	border: 1rpx solid $uni-border-color;
	transition: all 0.3s ease;
}

.user-card:active {
	transform: scale(0.98);
}

.user-summary {
	display: flex;
	align-items: center;
	padding: 32rpx 24rpx;
}

.user-avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
}

.avatar-pending {
	background: linear-gradient(135deg, $primary-old-gold, #d4a574);
}

.avatar-approved {
	background: linear-gradient(135deg, $primary-pistachio, $primary-mindaro);
}

.avatar-rejected {
	background: linear-gradient(135deg, $uni-text-color-grey, #666666);
}

.avatar-default {
	background: linear-gradient(135deg, $primary-cambridge-blue, $primary-pistachio);
}

.avatar-icon {
	font-size: 32rpx;
	color: #ffffff;
}

.user-info {
	flex: 1;
}

.user-name {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
	display: block;
	margin-bottom: 8rpx;
}

.user-type {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	display: block;
	margin-bottom: 4rpx;
}

.user-date {
	font-size: 20rpx;
	color: $uni-text-color-grey;
}

.user-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.status-pending {
	background-color: $primary-old-gold;
}

.status-approved {
	background-color: $primary-pistachio;
}

.status-rejected {
	background-color: $uni-text-color-grey;
}

.status-text {
	font-size: 20rpx;
	font-weight: 500;
	color: #ffffff;
}

.expand-icon {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s ease;
}

.expand-icon.expanded {
	transform: rotate(180deg);
}

.icon {
	font-size: 20rpx;
	color: $uni-text-color-grey;
}

// 详细信息面板
.detail-panel {
	border-top: 1rpx solid $uni-border-color;
}

.detail-content {
	padding: 32rpx 24rpx;
}

.detail-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 32rpx;
}

.detail-title {
	font-size: 28rpx;
	font-weight: 600;
	color: $uni-text-color;
	display: block;
	margin-bottom: 24rpx;
}

.info-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.info-label {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.info-value {
	font-size: 24rpx;
	font-weight: 500;
	color: $uni-text-color;
	max-width: 300rpx;
	text-align: right;
}

// 认证材料
.document-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.document-item {
	border: 1rpx solid $uni-border-color;
	border-radius: 16rpx;
	padding: 20rpx;
}

.doc-name {
	font-size: 24rpx;
	font-weight: 500;
	color: $uni-text-color;
	display: block;
	margin-bottom: 12rpx;
}

.doc-image {
	width: 100%;
	height: 200rpx;
	border-radius: 12rpx;
}

// 认证审核操作
.auth-actions {
	margin-top: 32rpx;
	padding-top: 32rpx;
	border-top: 1rpx solid $uni-border-color;
}

.action-title {
	font-size: 28rpx;
	font-weight: 600;
	color: $uni-text-color;
	display: block;
	margin-bottom: 24rpx;
}

.action-info {
	background-color: rgba(117, 176, 156, 0.1);
	padding: 20rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: flex-start;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.info-icon {
	font-size: 24rpx;
	color: $primary-cambridge-blue;
}

.info-text {
	font-size: 24rpx;
	color: $primary-cambridge-blue;
	flex: 1;
	line-height: 1.5;
}

.action-buttons {
	display: flex;
	gap: 16rpx;
}

.action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 24rpx;
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.action-btn:active {
	transform: scale(0.95);
}

.approve-btn {
	background: linear-gradient(135deg, $primary-cambridge-blue, $primary-pistachio);
}

.reject-btn {
	background: linear-gradient(135deg, $primary-old-gold, #d4a574);
}

.btn-icon {
	font-size: 24rpx;
	color: #ffffff;
}

.btn-text {
	font-size: 24rpx;
	font-weight: 500;
	color: #ffffff;
}

// 拒绝原因输入
.reject-reason {
	margin-top: 20rpx;
}

.reason-input {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: 16rpx;
	font-size: 24rpx;
	resize: none;
}

.reason-actions {
	display: flex;
	justify-content: flex-end;
	gap: 16rpx;
	margin-top: 16rpx;
}

.reason-btn {
	padding: 16rpx 32rpx;
	border-radius: 16rpx;
	transition: all 0.3s ease;
}

.cancel-btn {
	background-color: $uni-bg-color-grey;
}

.cancel-btn .reason-text {
	color: $uni-text-color-grey;
}

.confirm-btn {
	background-color: $uni-color-error;
}

.confirm-btn .reason-text {
	color: #ffffff;
}

.reason-text {
	font-size: 24rpx;
	font-weight: 500;
}

// 认证状态信息
.auth-status,
.reject-status {
	margin-top: 32rpx;
	padding-top: 32rpx;
	border-top: 1rpx solid $uni-border-color;
}

.status-title,
.reject-title {
	font-size: 28rpx;
	font-weight: 600;
	color: $uni-text-color;
	display: block;
	margin-bottom: 24rpx;
}

.status-info,
.reject-info-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.status-item,
.reject-info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.status-label,
.reject-label {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.status-value {
	font-size: 24rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.status-value.approved {
	color: $primary-pistachio;
}

.reject-info-item {
	align-items: flex-start;
}

.reject-value {
	font-size: 24rpx;
	font-weight: 500;
	color: $uni-text-color;
	max-width: 400rpx;
	text-align: right;
	line-height: 1.5;
}

// 动画效果
.filter-section,
.user-card {
	animation: fadeInUp 0.3s ease-out;
}

.user-card:nth-child(1) { animation-delay: 0.1s; }
.user-card:nth-child(2) { animation-delay: 0.2s; }
.user-card:nth-child(3) { animation-delay: 0.3s; }
.user-card:nth-child(4) { animation-delay: 0.4s; }

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

// 响应式设计
@media (max-width: 375px) {
	.header-actions {
		.search-input {
			width: 200rpx;
		}
	}

	.stats-grid {
		grid-template-columns: 1fr;
		gap: 16rpx;
	}

	.stat-card {
		padding: 24rpx 20rpx;
	}

	.user-summary {
		padding: 24rpx 20rpx;
	}

	.action-buttons {
		flex-direction: column;
	}
}

// 大字体模式适配
.auth-container.large-font {
	.header-title {
		font-size: 36rpx;
	}

	.stat-number {
		font-size: 40rpx;
	}

	.user-name {
		font-size: 36rpx;
	}

	.detail-title,
	.action-title,
	.status-title,
	.reject-title {
		font-size: 32rpx;
	}

	.info-label,
	.info-value,
	.status-label,
	.status-value,
	.reject-label,
	.reject-value {
		font-size: 28rpx;
	}

	.btn-text,
	.reason-text {
		font-size: 28rpx;
	}

	.reason-input {
		font-size: 28rpx;
	}
}
</style>