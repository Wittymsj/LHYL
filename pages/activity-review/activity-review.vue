<template>
	<view class="activity-review-container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<view class="back-icon"></view>
			</view>
			<text class="header-title">活动审核管理</text>
		</view>

		<!-- 内容区域 -->
		<scroll-view class="content" scroll-y :style="{ paddingTop: statusBarHeight + 'px' }">
			<!-- 统计数据卡片 -->
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stat-card pending">
						<view class="stat-icon">⏰</view>
						<view class="stat-content">
							<text class="stat-number">{{ stats.pending }}</text>
							<text class="stat-label">待审核</text>
						</view>
					</view>
					<view class="stat-card approved">
						<view class="stat-icon">✅</view>
						<view class="stat-content">
							<text class="stat-number">{{ stats.approved }}</text>
							<text class="stat-label">已通过</text>
						</view>
					</view>
					<view class="stat-card rejected">
						<view class="stat-icon">❌</view>
						<view class="stat-content">
							<text class="stat-number">{{ stats.rejected }}</text>
							<text class="stat-label">已拒绝</text>
						</view>
					</view>
					<view class="stat-card draft">
						<view class="stat-icon">📝</view>
						<view class="stat-content">
							<text class="stat-number">{{ stats.draft }}</text>
							<text class="stat-label">草稿</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 筛选区域 -->
			<view class="filter-section">
				<view class="search-container">
					<text class="filter-label">搜索活动</text>
					<view class="search-input">
						<text class="search-icon">🔍</text>
						<input
							type="text"
							v-model="searchKeyword"
							placeholder="输入活动名称"
							class="input-field"
							@input="handleSearch"
						/>
						<button class="search-btn" @click="performSearch">搜索</button>
					</view>
				</view>
			</view>

			<!-- 活动列表 -->
			<view class="activities-section">
				<view class="section-header">
					<text class="section-title">活动列表</text>
					<view class="header-actions">
						<view class="select-all">
							<checkbox
								:checked="selectAll"
								@change="handleSelectAll"
								color="#75b09c"
							/>
							<text class="select-label">全选</text>
						</view>
						<view class="action-btn" @click="refreshList">
							<text class="action-icon">🔄</text>
						</view>
					</view>
				</view>

				<view class="activities-list">
					<view
						v-for="activity in filteredActivities"
						:key="activity.id"
						class="activity-card"
						:class="`status-${activity.status}`"
						@click="toggleExpand(activity.id)"
					>
						<view class="activity-header">
							<view class="checkbox-wrapper">
								<checkbox
									:checked="selectedActivities.includes(activity.id)"
									@change.stop="handleActivitySelect(activity.id)"
									color="#75b09c"
								/>
							</view>

							<image
								:src="activity.image"
								class="activity-image"
								mode="aspectFill"
							/>

							<view class="activity-info">
								<view class="activity-title-row">
									<text class="activity-title">{{ activity.title }}</text>
									<view class="activity-actions">
										<button
											v-if="activity.status === 'pending'"
											class="action-btn audit-btn"
											@click.stop="showAuditModal(activity)"
										>
											<text class="btn-text">审核</text>
										</button>
										<button
											v-if="activity.status === 'approved'"
											class="action-btn view-btn"
											@click.stop="viewActivityDetail(activity)"
										>
											<text class="btn-text">查看</text>
										</button>
										<button
											v-if="activity.status === 'rejected'"
											class="action-btn reaudit-btn"
											@click.stop="showAuditModal(activity)"
										>
											<text class="btn-text">重审</text>
										</button>
										<button
											v-if="activity.status === 'draft'"
											class="action-btn edit-btn"
											@click.stop="editActivity(activity)"
										>
											<text class="btn-text">编辑</text>
										</button>
									</view>
								</view>

								<text class="activity-description">{{ activity.description }}</text>

								<view class="activity-meta">
									<view class="meta-item">
										<text class="meta-icon">🏢</text>
										<view class="meta-content">
											<text class="meta-label">主办方</text>
											<text class="meta-value">{{ activity.organizer }}</text>
											<view class="organizer-status" :class="activity.organizerStatus">
												<text class="status-text">{{ getOrganizerStatusText(activity.organizerStatus) }}</text>
											</view>
										</view>
									</view>

									<view class="meta-item">
										<text class="meta-icon">⏰</text>
										<view class="meta-content">
											<text class="meta-label">提交时间</text>
											<text class="meta-value">{{ activity.submitTime }}</text>
										</view>
									</view>

									<view class="meta-item">
										<text class="meta-icon">👥</text>
										<view class="meta-content">
											<text class="meta-label">报名人数</text>
											<text class="meta-value">{{ activity.registrations }}/{{ activity.maxRegistrations }}</text>
											<view class="progress-bar">
												<view
													class="progress-fill"
													:style="{ width: (activity.registrations / activity.maxRegistrations * 100) + '%' }"
												></view>
											</view>
										</view>
									</view>
								</view>

								<view class="activity-badges">
									<view class="status-badge" :class="activity.status">
										<text class="badge-text">{{ getStatusText(activity.status) }}</text>
									</view>
									<view class="priority-badge" :class="activity.priority">
										<text class="badge-text">{{ getPriorityText(activity.priority) }}</text>
									</view>
								</view>
							</view>

							<view class="expand-icon" :class="{ expanded: expandedActivities.includes(activity.id) }">
								<text class="icon-text">▼</text>
							</view>
						</view>

						<!-- 展开的详细信息 -->
						<view v-if="expandedActivities.includes(activity.id)" class="activity-details">
							<view class="detail-section">
								<text class="detail-title">活动详情</text>
								<view class="detail-grid">
									<view class="detail-item">
										<text class="detail-label">活动时间</text>
										<text class="detail-value">{{ activity.activityTime }}</text>
									</view>
									<view class="detail-item">
										<text class="detail-label">活动地点</text>
										<text class="detail-value">{{ activity.location }}</text>
									</view>
									<view class="detail-item">
										<text class="detail-label">活动费用</text>
										<text class="detail-value">{{ activity.fee }}</text>
									</view>
									<view class="detail-item">
										<text class="detail-label">联系方式</text>
										<text class="detail-value">{{ activity.contact }}</text>
									</view>
								</view>
							</view>

							<view class="detail-section">
								<text class="detail-title">详细介绍</text>
								<text class="detail-content">{{ activity.detailedDescription }}</text>
							</view>

							<view v-if="activity.status === 'rejected'" class="detail-section">
								<text class="detail-title">拒绝原因</text>
								<text class="rejection-reason">{{ activity.rejectionReason }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 分页 -->
				<view class="pagination">
					<view class="pagination-info">
						<text class="info-text">显示 {{ pagination.start }}-{{ pagination.end }} 条，共 {{ pagination.total }} 条记录</text>
					</view>
					<view class="pagination-controls">
						<button
							class="page-btn"
							:class="{ disabled: pagination.current === 1 }"
							@click="prevPage"
							:disabled="pagination.current === 1"
						>
							上一页
						</button>
						<button
							v-for="page in visiblePages"
							:key="page"
							class="page-btn"
							:class="{ active: page === pagination.current }"
							@click="goToPage(page)"
						>
							{{ page }}
						</button>
						<button
							class="page-btn"
							:class="{ disabled: pagination.current === pagination.totalPages }"
							@click="nextPage"
							:disabled="pagination.current === pagination.totalPages"
						>
							下一页
						</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 审核弹窗 -->
		<view v-if="showAuditModal" class="modal-overlay" @click="closeAuditModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">活动审核</text>
					<view class="close-btn" @click="closeAuditModal">
						<text class="close-text">✕</text>
					</view>
				</view>

				<view v-if="currentAuditActivity" class="modal-body">
					<!-- 活动基本信息 -->
					<view class="activity-info-section">
						<view class="activity-header-info">
							<image
								:src="currentAuditActivity.image"
								class="audit-activity-image"
								mode="aspectFill"
							/>
							<view class="audit-activity-details">
								<text class="audit-activity-title">{{ currentAuditActivity.title }}</text>
								<text class="audit-organizer">主办方：{{ currentAuditActivity.organizer }}</text>
								<text class="audit-submit-time">提交时间：{{ currentAuditActivity.submitTime }}</text>
							</view>
						</view>

						<view class="activity-details-grid">
							<view class="detail-item">
								<text class="detail-label">活动时间</text>
								<text class="detail-value">{{ currentAuditActivity.activityTime }}</text>
							</view>
							<view class="detail-item">
								<text class="detail-label">活动地点</text>
								<text class="detail-value">{{ currentAuditActivity.location }}</text>
							</view>
							<view class="detail-item">
								<text class="detail-label">报名人数</text>
								<text class="detail-value">{{ currentAuditActivity.registrations }}/{{ currentAuditActivity.maxRegistrations }}</text>
							</view>
							<view class="detail-item">
								<text class="detail-label">活动费用</text>
								<text class="detail-value">{{ currentAuditActivity.fee }}</text>
							</view>
						</view>
					</view>

					<!-- 活动介绍 -->
					<view class="section">
						<text class="section-label">活动介绍</text>
						<text class="section-content">{{ currentAuditActivity.detailedDescription }}</text>
					</view>

					<!-- 审核意见 -->
					<view class="section">
						<text class="section-label">审核意见</text>
						<textarea
							v-model="auditComment"
							placeholder="请输入审核意见"
							class="audit-textarea"
						></textarea>
					</view>
				</view>

				<view class="modal-footer">
					<button class="modal-btn cancel-btn" @click="closeAuditModal">取消</button>
					<button
						v-if="currentAuditActivity && currentAuditActivity.status === 'pending'"
						class="modal-btn reject-btn"
						@click="rejectActivity"
					>
						拒绝
					</button>
					<button
						v-if="currentAuditActivity && currentAuditActivity.status === 'pending'"
						class="modal-btn approve-btn"
						@click="approveActivity"
					>
						通过
					</button>
					<button
						v-if="currentAuditActivity && currentAuditActivity.status === 'rejected'"
						class="modal-btn approve-btn"
						@click="reapproveActivity"
					>
						重新通过
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
			statusBarHeight: 0,
			// 统计数据
			stats: {
				pending: 12,
				approved: 156,
				rejected: 8,
				draft: 23
			},
			// 筛选条件
			searchKeyword: '',
			// 筛选选项
			// 活动数据
			activities: [],
			// 选中的活动
			selectedActivities: [],
			selectAll: false,
			// 展开的活动
			expandedActivities: [],
			// 分页
			pagination: {
				current: 1,
				pageSize: 10,
				total: 199,
				totalPages: 20,
				start: 1,
				end: 10
			},
			// 审核弹窗
			showAuditModal: false,
			currentAuditActivity: null,
			auditComment: ''
		}
	},

	computed: {
		filteredActivities() {
			let filtered = this.activities

			// 搜索筛选
			if (this.searchKeyword) {
				const keyword = this.searchKeyword.toLowerCase()
				filtered = filtered.filter(activity =>
					activity.title.toLowerCase().includes(keyword)
				)
			}

	
			return filtered
		},

		visiblePages() {
			const current = this.pagination.current
			const total = this.pagination.totalPages
			const pages = []

			if (total <= 7) {
				for (let i = 1; i <= total; i++) {
					pages.push(i)
				}
			} else {
				if (current <= 4) {
					for (let i = 1; i <= 5; i++) {
						pages.push(i)
					}
					pages.push('...')
					pages.push(total)
				} else if (current >= total - 3) {
					pages.push(1)
					pages.push('...')
					for (let i = total - 4; i <= total; i++) {
						pages.push(i)
					}
				} else {
					pages.push(1)
					pages.push('...')
					for (let i = current - 1; i <= current + 1; i++) {
						pages.push(i)
					}
					pages.push('...')
					pages.push(total)
				}
			}

			return pages
		}
	},

	onLoad() {
		// 获取状态栏高度
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo.statusBarHeight || 0

		// 初始化活动数据
		this.initActivities()

		// 监听字体大小变化
		uni.$on('fontSizeChanged', this.handleFontSizeChange)
	},

	onUnload() {
		// 移除事件监听
		uni.$off('fontSizeChanged', this.handleFontSizeChange)
	},

	methods: {
		// 初始化活动数据
		initActivities() {
			this.activities = [
				{
					id: 1,
					title: '健康养生讲座',
					description: '中医养生知识分享，帮助老年朋友们了解科学的养生方法',
					organizer: '社区健康中心',
					organizerStatus: 'verified',
					submitTime: '2025-01-15 14:30',
					activityTime: '2025-01-20 14:00-16:00',
					location: '社区活动中心',
					registrations: 45,
					maxRegistrations: 100,
					fee: '免费',
					contact: '联系电话：138****5678',
					status: 'pending',
					priority: 'high',
					image: 'https://images.unsplash.com/photo-1511632765486-a01980e01aeb?w=400&h=200&fit=crop',
					detailedDescription: '本次健康养生讲座将邀请专业中医师为大家讲解中医养生知识，包括日常保健、饮食调理、运动养生等内容。通过理论讲解和实际操作相结合的方式，帮助老年朋友们了解科学的养生方法，提高生活质量。'
				},
				{
					id: 2,
					title: '书法艺术体验',
					description: '传统书法学习体验，感受中华文化的魅力',
					organizer: '文化艺术协会',
					organizerStatus: 'verified',
					submitTime: '2025-01-14 10:15',
					activityTime: '2025-01-22 09:00-11:00',
					location: '文化艺术中心',
					registrations: 28,
					maxRegistrations: 30,
					fee: '免费',
					contact: '联系电话：139****1234',
					status: 'approved',
					priority: 'medium',
					image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop',
					detailedDescription: '书法是中华文化的瑰宝，本次活动将邀请专业书法老师指导大家学习基本的书法技巧，包括握笔姿势、基本笔画、简单字体的书写等。让参与者在轻松愉快的氛围中感受书法艺术的魅力。'
				},
				{
					id: 3,
					title: '摄影技巧分享',
					description: '手机摄影技巧教学，记录美好生活瞬间',
					organizer: '摄影爱好者俱乐部',
					organizerStatus: 'unverified',
					submitTime: '2025-01-13 16:45',
					activityTime: '2025-01-25 15:00-17:00',
					location: '社区摄影室',
					registrations: 0,
					maxRegistrations: 50,
					fee: '20元',
					contact: '联系电话：136****9876',
					status: 'rejected',
					priority: 'low',
					rejectionReason: '活动内容过于简单，建议增加更多实用技巧分享',
					image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
					detailedDescription: '随着智能手机的普及，手机摄影已经成为记录生活的重要方式。本次活动将分享手机摄影的基本技巧，包括构图方法、光线运用、后期处理等，帮助大家拍出更美的照片。'
				},
				{
					id: 4,
					title: '园艺种植体验',
					description: '家庭园艺知识分享，打造绿色生活空间',
					organizer: '绿色生活协会',
					organizerStatus: 'verified',
					submitTime: '2025-01-12 09:20',
					activityTime: '2025-01-28 10:00-12:00',
					location: '社区花园',
					registrations: 0,
					maxRegistrations: 40,
					fee: '免费',
					contact: '联系电话：135****4321',
					status: 'draft',
					priority: 'medium',
					image: 'https://images.unsplash.com/photo-1543286986-7421036e3fce?w=400&h=200&fit=crop',
					detailedDescription: '园艺活动不仅可以美化环境，还能锻炼身体、舒缓心情。本次活动将介绍适合家庭种植的植物种类、基本种植技巧、日常养护方法等，让大家在享受园艺乐趣的同时，打造属于自己的绿色生活空间。'
				}
			]
		},

		// 返回上一页
		goBack() {
			uni.vibrateShort()
			if (getCurrentPages().length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},

		// 搜索处理
		handleSearch() {
			// 防抖处理
			clearTimeout(this.searchTimer)
			this.searchTimer = setTimeout(() => {
				console.log('搜索关键词:', this.searchKeyword)
			}, 300)
		},

		// 执行搜索
		performSearch() {
			uni.vibrateShort()
			console.log('执行搜索:', this.searchKeyword)

			if (!this.searchKeyword.trim()) {
				uni.showToast({
					title: '请输入搜索关键词',
					icon: 'none',
					duration: 1500
				})
				return
			}

			uni.showToast({
				title: `搜索: ${this.searchKeyword}`,
				icon: 'success',
				duration: 1500
			})
		},

		// 重置筛选
		resetFilters() {
			this.searchKeyword = ''
			this.selectedActivities = []
			this.selectAll = false

			uni.showToast({
				title: '搜索已重置',
				icon: 'success',
				duration: 1500
			})
		},

		// 全选处理
		handleSelectAll(e) {
			this.selectAll = e.detail.value
			if (this.selectAll) {
				this.selectedActivities = this.filteredActivities.map(activity => activity.id)
			} else {
				this.selectedActivities = []
			}
		},

		// 单个活动选择
		handleActivitySelect(activityId) {
			const index = this.selectedActivities.indexOf(activityId)
			if (index > -1) {
				this.selectedActivities.splice(index, 1)
			} else {
				this.selectedActivities.push(activityId)
			}

			// 更新全选状态
			this.selectAll = this.selectedActivities.length === this.filteredActivities.length
		},

		// 切换展开状态
		toggleExpand(activityId) {
			const index = this.expandedActivities.indexOf(activityId)
			if (index > -1) {
				this.expandedActivities.splice(index, 1)
			} else {
				this.expandedActivities.push(activityId)
			}
		},

		// 刷新列表
		refreshList() {
			uni.vibrateShort()
			uni.showLoading({
				title: '刷新中...'
			})

			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '刷新成功',
					icon: 'success',
					duration: 1500
				})
			}, 1000)
		},

		// 显示审核弹窗
		showAuditModal(activity) {
			uni.vibrateShort()
			this.currentAuditActivity = activity
			this.auditComment = ''
			this.showAuditModal = true
		},

		// 关闭审核弹窗
		closeAuditModal() {
			this.showAuditModal = false
			this.currentAuditActivity = null
			this.auditComment = ''
		},

		// 通过活动
		approveActivity() {
			if (!this.currentAuditActivity) return

			uni.vibrateShort()
			uni.showLoading({
				title: '处理中...'
			})

			setTimeout(() => {
				// 更新活动状态
				const activityIndex = this.activities.findIndex(a => a.id === this.currentAuditActivity.id)
				if (activityIndex > -1) {
					this.activities[activityIndex].status = 'approved'
					this.stats.pending--
					this.stats.approved++
				}

				uni.hideLoading()
				this.closeAuditModal()

				uni.showToast({
					title: '活动已通过审核',
					icon: 'success',
					duration: 2000
				})
			}, 1500)
		},

		// 拒绝活动
		rejectActivity() {
			if (!this.currentAuditActivity) return

			if (!this.auditComment.trim()) {
				uni.showToast({
					title: '请输入拒绝理由',
					icon: 'none',
					duration: 2000
				})
				return
			}

			uni.vibrateShort()
			uni.showLoading({
				title: '处理中...'
			})

			setTimeout(() => {
				// 更新活动状态
				const activityIndex = this.activities.findIndex(a => a.id === this.currentAuditActivity.id)
				if (activityIndex > -1) {
					this.activities[activityIndex].status = 'rejected'
					this.activities[activityIndex].rejectionReason = this.auditComment
					this.stats.pending--
					this.stats.rejected++
				}

				uni.hideLoading()
				this.closeAuditModal()

				uni.showToast({
					title: '活动已拒绝',
					icon: 'success',
					duration: 2000
				})
			}, 1500)
		},

		// 重新通过活动
		reapproveActivity() {
			if (!this.currentAuditActivity) return

			uni.vibrateShort()
			uni.showLoading({
				title: '处理中...'
			})

			setTimeout(() => {
				// 更新活动状态
				const activityIndex = this.activities.findIndex(a => a.id === this.currentAuditActivity.id)
				if (activityIndex > -1) {
					this.activities[activityIndex].status = 'approved'
					this.stats.rejected--
					this.stats.approved++
					delete this.activities[activityIndex].rejectionReason
				}

				uni.hideLoading()
				this.closeAuditModal()

				uni.showToast({
					title: '活动已重新通过',
					icon: 'success',
					duration: 2000
				})
			}, 1500)
		},

		// 查看活动详情
		viewActivityDetail(activity) {
			uni.vibrateShort()
			console.log('查看活动详情:', activity.title)
			// 这里可以跳转到活动详情页面
		},

		// 编辑活动
		editActivity(activity) {
			uni.vibrateShort()
			console.log('编辑活动:', activity.title)
			// 这里可以跳转到活动编辑页面
		},

		// 分页方法
		prevPage() {
			if (this.pagination.current > 1) {
				this.pagination.current--
				this.updatePagination()
			}
		},

		nextPage() {
			if (this.pagination.current < this.pagination.totalPages) {
				this.pagination.current++
				this.updatePagination()
			}
		},

		goToPage(page) {
			if (page !== '...' && page !== this.pagination.current) {
				this.pagination.current = page
				this.updatePagination()
			}
		},

		updatePagination() {
			const start = (this.pagination.current - 1) * this.pagination.pageSize + 1
			const end = Math.min(this.pagination.current * this.pagination.pageSize, this.pagination.total)

			this.pagination.start = start
			this.pagination.end = end
		},

		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				pending: '待审核',
				approved: '已通过',
				rejected: '已拒绝',
				draft: '草稿'
			}
			return statusMap[status] || status
		},

		// 获取优先级文本
		getPriorityText(priority) {
			const priorityMap = {
				high: '高优先级',
				medium: '中优先级',
				low: '低优先级'
			}
			return priorityMap[priority] || priority
		},

		// 获取主办方状态文本
		getOrganizerStatusText(status) {
			const statusMap = {
				verified: '已认证',
				unverified: '待认证'
			}
			return statusMap[status] || status
		},

		// 处理字体大小变化
		handleFontSizeChange(data) {
			console.log('字体大小变化:', data.fontSize)
			// 这里可以根据全局字体大小设置调整页面样式
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.activity-review-container {
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
	justify-content: center;
	z-index: 1000;
	padding-top: var(--status-bar-height, 0);
}

.back-btn {
	position: absolute;
	left: 0;
	top: 0;
	width: 88rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
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

// 内容区域
.content {
	width: 100%;
	min-height: 100vh;
	padding-top: calc(88rpx + var(--status-bar-height, 0));
	padding-bottom: 40rpx;
}

// 统计数据区域
.stats-section {
	padding: 24rpx;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
}

.stat-card {
	background: $uni-bg-color;
	border-radius: 16rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid $uni-border-color;
	transition: all 0.3s ease;

	&.pending {
		border-left: 4rpx solid #f59e0b;

		.stat-icon {
			background: rgba(245, 158, 11, 0.1);
			color: #f59e0b;
		}
	}

	&.approved {
		border-left: 4rpx solid #10b981;

		.stat-icon {
			background: rgba(16, 185, 129, 0.1);
			color: #10b981;
		}
	}

	&.rejected {
		border-left: 4rpx solid #ef4444;

		.stat-icon {
			background: rgba(239, 68, 68, 0.1);
			color: #ef4444;
		}
	}

	&.draft {
		border-left: 4rpx solid #3b82f6;

		.stat-icon {
			background: rgba(59, 130, 246, 0.1);
			color: #3b82f6;
		}
	}

	&:active {
		transform: scale(0.98);
	}
}

.stat-icon {
	width: 48rpx;
	height: 48rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
}

.stat-content {
	flex: 1;
}

.stat-number {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
	display: block;
}

.stat-label {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
}

// 筛选区域
.filter-section {
	background: $uni-bg-color;
	margin: 0 24rpx 24rpx;
	border-radius: 16rpx;
	padding: 24rpx;
	border: 1rpx solid $uni-border-color;
}

.search-container {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.filter-label {
	font-size: 24rpx;
	font-weight: 500;
	color: $uni-text-color;
}

.search-input {
	position: relative;
	display: flex;
	align-items: center;
	background: $uni-bg-color-grey;
	border-radius: 12rpx;
	padding: 0 24rpx;
	border: 1rpx solid $uni-border-color;
}

.search-icon {
	font-size: 20rpx;
	color: $uni-text-color-grey;
	margin-right: 12rpx;
}

.input-field {
	flex: 1;
	height: 80rpx;
	font-size: 28rpx;
	color: $uni-text-color;
	background: transparent;
	border: none;

	&::placeholder {
		color: $uni-text-color-grey;
	}
}

.search-btn {
	padding: 16rpx 24rpx;
	background: $primary-cambridge-blue;
	color: #ffffff;
	border: none;
	border-radius: 8rpx;
	font-size: 24rpx;
	font-weight: 500;
	margin-left: 12rpx;
	white-space: nowrap;

	&:active {
		background: darken($primary-cambridge-blue, 10%);
		transform: scale(0.95);
	}
}


// 活动列表区域
.activities-section {
	margin: 0 24rpx;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
	padding: 0 8rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.select-all {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.select-label {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.action-btn {
	width: 48rpx;
	height: 48rpx;
	background: $uni-bg-color-grey;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1rpx solid $uni-border-color;

	&:active {
		background: darken($uni-bg-color-grey, 5%);
	}
}

.action-icon {
	font-size: 20rpx;
}

// 活动卡片
.activity-card {
	background: $uni-bg-color;
	border-radius: 16rpx;
	margin-bottom: 16rpx;
	border: 1rpx solid $uni-border-color;
	overflow: hidden;
	transition: all 0.3s ease;

	&.status-pending {
		border-left: 4rpx solid #f59e0b;
		background: linear-gradient(135deg, #fefce8, #fef3c7);
	}

	&.status-approved {
		border-left: 4rpx solid #10b981;
		background: linear-gradient(135deg, #f0fdf4, #d1fae5);
	}

	&.status-rejected {
		border-left: 4rpx solid #ef4444;
		background: linear-gradient(135deg, #fef2f2, #fee2e2);
	}

	&.status-draft {
		border-left: 4rpx solid #3b82f6;
		background: linear-gradient(135deg, #eff6ff, #dbeafe);
	}

	&:active {
		transform: scale(0.98);
	}
}

.activity-header {
	display: flex;
	gap: 16rpx;
	padding: 20rpx;
}

.checkbox-wrapper {
	display: flex;
	align-items: center;
	padding-top: 8rpx;
}

.activity-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
}

.activity-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.activity-title-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12rpx;
}

.activity-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
	flex: 1;
	line-height: 1.3;
}

.activity-actions {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.audit-btn, .view-btn, .reaudit-btn, .edit-btn {
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
	font-weight: 500;
	border: none;
	min-width: 80rpx;

	&:active {
		transform: scale(0.95);
	}
}

.audit-btn {
	background: $primary-cambridge-blue;
	color: #ffffff;
}

.view-btn {
	background: #10b981;
	color: #ffffff;
}

.reaudit-btn {
	background: $primary-cambridge-blue;
	color: #ffffff;
}

.edit-btn {
	background: #f59e0b;
	color: #ffffff;
}

.btn-text {
	font-size: 24rpx;
}

.activity-description {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	line-height: 1.4;
}

.activity-meta {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.meta-item {
	display: flex;
	align-items: flex-start;
	gap: 8rpx;
}

.meta-icon {
	font-size: 20rpx;
	color: $uni-text-color-grey;
	margin-top: 2rpx;
}

.meta-content {
	flex: 1;
}

.meta-label {
	font-size: 20rpx;
	color: $uni-text-color-grey;
}

.meta-value {
	font-size: 24rpx;
	color: $uni-text-color;
	font-weight: 500;
}

.organizer-status {
	display: inline-flex;
	align-items: center;
	margin-top: 4rpx;

	&.verified {
		.status-text {
			background: rgba(16, 185, 129, 0.1);
			color: #10b981;
		}
	}

	&.unverified {
		.status-text {
			background: rgba(107, 114, 128, 0.1);
			color: #6b7280;
		}
	}
}

.status-text {
	font-size: 18rpx;
	padding: 2rpx 8rpx;
	border-radius: 8rpx;
}

.progress-bar {
	width: 100%;
	height: 6rpx;
	background: $uni-border-color;
	border-radius: 3rpx;
	margin-top: 4rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: $primary-cambridge-blue;
	border-radius: 3rpx;
	transition: width 0.3s ease;
}

.activity-badges {
	display: flex;
	gap: 8rpx;
	margin-top: 8rpx;
}

.status-badge, .priority-badge {
	padding: 4rpx 12rpx;
	border-radius: 9999px;
	font-size: 20rpx;
	font-weight: 500;
}

.status-badge {
	&.pending {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
		border: 1rpx solid #f59e0b;
	}

	&.approved {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
		border: 1rpx solid #10b981;
	}

	&.rejected {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border: 1rpx solid #ef4444;
	}

	&.draft {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
		border: 1rpx solid #3b82f6;
	}
}

.priority-badge {
	&.high {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border: 1rpx solid #ef4444;
	}

	&.medium {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
		border: 1rpx solid #f59e0b;
	}

	&.low {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
		border: 1rpx solid #10b981;
	}
}

.badge-text {
	font-size: 20rpx;
}

.expand-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8rpx;
	transition: transform 0.3s ease;

	&.expanded {
		transform: rotate(180deg);
	}
}

.icon-text {
	font-size: 20rpx;
	color: $uni-text-color-grey;
}

// 展开的详细信息
.activity-details {
	border-top: 1rpx solid $uni-border-color;
	padding: 20rpx;
	background: rgba(255, 255, 255, 0.5);
}

.detail-section {
	margin-bottom: 20rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.detail-title {
	font-size: 28rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 12rpx;
}

.detail-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
}

.detail-item {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.detail-label {
	font-size: 22rpx;
	color: $uni-text-color-grey;
}

.detail-value {
	font-size: 24rpx;
	color: $uni-text-color;
	font-weight: 500;
}

.detail-content {
	font-size: 24rpx;
	color: $uni-text-color;
	line-height: 1.5;
}

.rejection-reason {
	font-size: 24rpx;
	color: #ef4444;
	line-height: 1.5;
	padding: 12rpx;
	background: rgba(239, 68, 68, 0.05);
	border-radius: 8rpx;
	border: 1rpx solid rgba(239, 68, 68, 0.2);
}

// 分页
.pagination {
	margin-top: 24rpx;
	padding: 20rpx;
	background: $uni-bg-color;
	border-radius: 16rpx;
	border: 1rpx solid $uni-border-color;
}

.pagination-info {
	text-align: center;
	margin-bottom: 16rpx;
}

.info-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.pagination-controls {
	display: flex;
	justify-content: center;
	gap: 8rpx;
	flex-wrap: wrap;
}

.page-btn {
	min-width: 60rpx;
	height: 60rpx;
	padding: 0 16rpx;
	background: $uni-bg-color-grey;
	border: 1rpx solid $uni-border-color;
	border-radius: 8rpx;
	font-size: 24rpx;
	color: $uni-text-color;
	display: flex;
	align-items: center;
	justify-content: center;

	&:active {
		background: darken($uni-bg-color-grey, 5%);
	}

	&.active {
		background: $primary-cambridge-blue;
		color: #ffffff;
		border-color: $primary-cambridge-blue;
	}

	&.disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}

// 审核弹窗
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
	padding: 40rpx;
}

.modal-content {
	background: $uni-bg-color;
	border-radius: 16rpx;
	max-width: 600rpx;
	width: 100%;
	max-height: 80vh;
	overflow-y: auto;
	border: 1rpx solid $uni-border-color;
}

.modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	border-bottom: 1rpx solid $uni-border-color;
}

.modal-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
}

.close-btn {
	width: 48rpx;
	height: 48rpx;
	background: $uni-bg-color-grey;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1rpx solid $uni-border-color;

	&:active {
		background: darken($uni-bg-color-grey, 5%);
	}
}

.close-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.modal-body {
	padding: 24rpx;
}

.activity-info-section {
	margin-bottom: 24rpx;
}

.activity-header-info {
	display: flex;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.audit-activity-image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
}

.audit-activity-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.audit-activity-title {
	font-size: 28rpx;
	font-weight: 600;
	color: $uni-text-color;
}

.audit-organizer, .audit-submit-time {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.activity-details-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
}

.section {
	margin-bottom: 24rpx;

	&:last-child {
		margin-bottom: 0;
	}
}

.section-label {
	font-size: 24rpx;
	font-weight: 500;
	color: $uni-text-color;
	margin-bottom: 12rpx;
}

.section-content {
	font-size: 24rpx;
	color: $uni-text-color;
	line-height: 1.5;
}

.audit-textarea {
	width: 100%;
	min-height: 120rpx;
	padding: 16rpx;
	background: $uni-bg-color-grey;
	border: 1rpx solid $uni-border-color;
	border-radius: 12rpx;
	font-size: 24rpx;
	color: $uni-text-color;
	resize: none;

	&::placeholder {
		color: $uni-text-color-grey;
	}
}

.modal-footer {
	display: flex;
	gap: 16rpx;
	justify-content: flex-end;
	padding: 24rpx;
	border-top: 1rpx solid $uni-border-color;
}

.modal-btn {
	padding: 16rpx 32rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	font-weight: 500;
	border: none;

	&:active {
		transform: scale(0.95);
	}
}

.cancel-btn {
	background: $uni-bg-color-grey;
	color: $uni-text-color;
	border: 1rpx solid $uni-border-color;
}

.reject-btn {
	background: #ef4444;
	color: #ffffff;
}

.approve-btn {
	background: #10b981;
	color: #ffffff;
}

// 响应式设计
@media (max-width: 375px) {
	.stats-grid {
		grid-template-columns: 1fr;
	}

	.activity-title-row {
		flex-direction: column;
		align-items: flex-start;
	}

	.activity-actions {
		flex-direction: row;
		width: 100%;
		justify-content: flex-end;
	}

	.activity-meta {
		gap: 8rpx;
	}

	.detail-grid {
		grid-template-columns: 1fr;
	}

	.activity-details-grid {
		grid-template-columns: 1fr;
	}
}

// 大字体模式适配
.activity-review-container.large-font {
	.stat-number {
		font-size: 36rpx;
	}

	.stat-label {
		font-size: 28rpx;
	}

	.section-title {
		font-size: 36rpx;
	}

	.activity-title {
		font-size: 36rpx;
	}

	.filter-label {
		font-size: 28rpx;
	}

	.input-field {
		font-size: 32rpx;
	}

	.picker-text {
		font-size: 32rpx;
	}

	.reset-btn, .apply-btn {
		font-size: 32rpx;
	}
}

// 动画效果
.activity-card {
	animation: fadeInUp 0.3s ease-out;
}

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

// 触摸优化
.activity-card {
	-webkit-tap-highlight-color: transparent;
}

.modal-overlay {
	-webkit-tap-highlight-color: transparent;
}
</style>