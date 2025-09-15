<template>
	<view class="carousel-admin-container">
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="search-section">
				<view class="search-input-wrapper">
					<text class="search-icon">🔍</text>
					<input
						type="text"
						class="search-input"
						placeholder="搜索轮播图标题..."
						v-model="searchText"
						@input="handleSearch"
					/>
				</view>
			</view>

			<view class="filters">
				<picker
					mode="selector"
					:range="statusOptions"
					@change="handleStatusFilter"
					class="filter-picker"
				>
					<view class="filter-btn">
						<text>{{statusFilter === '' ? '全部状态' : statusOptions[statusFilterIndex]}}</text>
						<text class="filter-arrow">▼</text>
					</view>
				</picker>

				<picker
					mode="selector"
					:range="dateOptions"
					@change="handleDateFilter"
					class="filter-picker"
				>
					<view class="filter-btn">
						<text>{{dateFilter === '' ? '全部时间' : dateOptions[dateFilterIndex]}}</text>
						<text class="filter-arrow">▼</text>
					</view>
				</picker>
			</view>

			<view class="actions">
				<button class="primary-btn" @click="showCreateModal">
					<text class="btn-icon">➕</text>
					<text>新增轮播图</text>
				</button>
			</view>
		</view>

		<!-- 批量操作栏 -->
		<view class="bulk-actions" v-if="selectedItems.size > 0">
			<view class="bulk-info">
				<text class="bulk-icon">✓</text>
				<text>已选择 {{selectedItems.size}} 项</text>
			</view>
			<view class="bulk-buttons">
				<button class="bulk-btn" @click="bulkPublish">
					<text>批量发布</text>
				</button>
				<button class="bulk-btn" @click="bulkDisable">
					<text>批量禁用</text>
				</button>
				<button class="bulk-btn bulk-btn-danger" @click="bulkDelete">
					<text>批量删除</text>
				</button>
				<button class="bulk-btn" @click="cancelBulkActions">
					<text>取消</text>
				</button>
			</view>
		</view>

		<!-- 视图切换 -->
		<view class="view-header">
			<view class="view-toggle">
				<view
					class="view-btn"
					:class="{active: currentView === 'table'}"
					@click="switchView('table')"
				>
					<text class="view-icon">📊</text>
					<text>表格视图</text>
				</view>
				<view
					class="view-btn"
					:class="{active: currentView === 'card'}"
					@click="switchView('card')"
				>
					<text class="view-icon">🔲</text>
					<text>卡片视图</text>
				</view>
			</view>
			<view class="count-info">
				<text>共 {{filteredCarousels.length}} 个轮播图</text>
			</view>
		</view>

		<!-- 表格视图 -->
		<view class="table-view" v-if="currentView === 'table'">
			<view class="table">
				<view class="table-header">
					<view class="table-cell">
						<checkbox
							:checked="isAllSelected"
							@tap="toggleSelectAll"
							color="#75b09c"
						/>
					</view>
					<view class="table-cell">ID</view>
					<view class="table-cell">标题</view>
					<view class="table-cell">状态</view>
					<view class="table-cell">排序</view>
					<view class="table-cell">操作</view>
				</view>
				<view class="table-body">
					<view
						class="table-row"
						v-for="(item, index) in filteredCarousels"
						:key="item.id"
						:class="{selected: selectedItems.has(item.id)}"
					>
						<view class="table-cell">
							<checkbox
								:checked="selectedItems.has(item.id)"
								@tap="toggleItemSelection(item.id)"
								color="#75b09c"
							/>
						</view>
						<view class="table-cell">{{item.id}}</view>
						<view class="table-cell">
							<view class="title-cell">
								<image :src="item.image" class="title-image" mode="aspectFill" />
								<text class="title-text">{{item.title}}</text>
							</view>
						</view>
						<view class="table-cell">
							<view class="status-badge" :class="item.status">
								<text class="status-icon">{{getStatusIcon(item.status)}}</text>
								<text>{{getStatusText(item.status)}}</text>
							</view>
						</view>
						<view class="table-cell">{{item.sort}}</view>
						<view class="table-cell">
							<view class="action-buttons">
								<button class="action-btn edit-btn" @click="showEditModal(item.id)">
									<text>✏️</text>
								</button>
								<button class="action-btn delete-btn" @click="showDeleteConfirm(item.id)">
									<text>🗑️</text>
								</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 卡片视图 -->
		<view class="card-view" v-if="currentView === 'card'">
			<view class="card-grid">
				<view
					class="carousel-card"
					v-for="(item, index) in filteredCarousels"
					:key="item.id"
					:class="{selected: selectedItems.has(item.id)}"
					@tap="toggleCardSelection(item.id)"
				>
					<image :src="item.image" class="card-image" mode="aspectFill" />
					<view class="card-content">
						<view class="card-header">
							<text class="card-title">{{item.title}}</text>
							<view class="card-status">
								<view class="status-badge" :class="item.status">
									<text class="status-icon">{{getStatusIcon(item.status)}}</text>
									<text>{{getStatusText(item.status)}}</text>
								</view>
								<text class="sort-badge">#{{item.sort}}</text>
							</view>
						</view>
						<view class="card-description">{{item.description}}</view>
						<view class="card-actions">
							<button class="card-btn edit-btn" @click.stop="showEditModal(item.id)">
								<text>编辑</text>
							</button>
							<button class="card-btn delete-btn" @click.stop="showDeleteConfirm(item.id)">
								<text>删除</text>
							</button>
						</view>
					</view>
				</view>

				<!-- 新增卡片 -->
				<view class="add-card" @tap="showCreateModal">
					<view class="add-card-content">
						<text class="add-icon">➕</text>
						<text class="add-text">新增轮播图</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 编辑面板 -->
		<view class="edit-panel" v-if="showPanel">
			<view class="panel-header">
				<text class="panel-title">{{editingId ? '编辑轮播图' : '新增轮播图'}}</text>
				<text class="close-btn" @click="closePanel">✕</text>
			</view>

			<scroll-view class="panel-content" scroll-y>
				<view class="form-group">
					<text class="form-label required">标题</text>
					<input
						type="text"
						class="form-input"
						v-model="formData.title"
						placeholder="请输入标题"
					/>
				</view>

				<view class="form-group">
					<text class="form-label">描述</text>
					<textarea
						class="form-textarea"
						v-model="formData.description"
						placeholder="请输入描述"
						:maxlength="200"
					/>
					<text class="char-count">{{formData.description.length}}/200</text>
				</view>

				<view class="form-group">
					<text class="form-label">行动按钮文字</text>
					<input
						type="text"
						class="form-input"
						v-model="formData.buttonText"
						placeholder="例如：立即探索"
					/>
				</view>

				<view class="form-group">
					<text class="form-label">跳转链接</text>
					<input
						type="text"
						class="form-input"
						v-model="formData.link"
						placeholder="例如：/explore"
					/>
				</view>

				<view class="form-group">
					<text class="form-label">排序</text>
					<input
						type="number"
						class="form-input"
						v-model="formData.sort"
						placeholder="请输入排序值"
						min="1"
					/>
				</view>

				<view class="form-group">
					<text class="form-label">状态</text>
					<view class="status-buttons">
						<view
							class="status-btn"
							:class="{
								active: formData.status === 'published',
								published: formData.status === 'published'
							}"
							@tap="formData.status = 'published'"
						>
							<text class="status-icon">👁️</text>
							<text>已发布</text>
						</view>
						<view
							class="status-btn"
							:class="{
								active: formData.status === 'draft',
								draft: formData.status === 'draft'
							}"
							@tap="formData.status = 'draft'"
						>
							<text class="status-icon">📝</text>
							<text>草稿</text>
						</view>
						<view
							class="status-btn"
							:class="{
								active: formData.status === 'disabled',
								disabled: formData.status === 'disabled'
							}"
							@tap="formData.status = 'disabled'"
						>
							<text class="status-icon">🚫</text>
							<text>禁用</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<text class="form-label">轮播图图片</text>
					<view class="image-upload">
						<image
							v-if="formData.image"
							:src="formData.image"
							class="image-preview"
							mode="aspectFill"
						/>
						<view v-if="!formData.image" class="upload-placeholder" @tap="chooseImage">
							<text class="upload-icon">📷</text>
							<text class="upload-text">点击上传图片</text>
							<text class="upload-hint">支持 JPG、PNG 格式，建议尺寸 800x400</text>
						</view>
						<view v-if="formData.image" class="image-actions">
							<button class="remove-btn" @tap="removeImage">
								<text>删除图片</text>
							</button>
							<button class="change-btn" @tap="chooseImage">
								<text>更换图片</text>
							</button>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="panel-footer">
				<button class="cancel-btn" @click="closePanel">取消</button>
				<button class="save-btn" @click="saveCarousel">
					<text>保存</text>
				</button>
			</view>
		</view>

		<!-- 遮罩层 -->
		<view class="mask" v-if="showPanel || showConfirm" @tap="closeAllModals"></view>

		<!-- 确认对话框 -->
		<view class="confirm-dialog" v-if="showConfirm">
			<view class="confirm-content">
				<text class="confirm-title">{{confirmTitle}}</text>
				<text class="confirm-message">{{confirmMessage}}</text>
				<view class="confirm-actions">
					<button class="confirm-cancel" @click="closeConfirm">取消</button>
					<button class="confirm-ok" @click="confirmAction">{{confirmOkText}}</button>
				</view>
			</view>
		</view>

		<!-- 通知提示 -->
		<view class="notification" v-if="notification.show" :class="notification.type">
			<text class="notification-icon">{{getNotificationIcon(notification.type)}}</text>
			<text class="notification-text">{{notification.message}}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 轮播图数据
			carouselData: [
				{
					id: '001',
					title: '平台介绍',
					description: '专为老年朋友打造的精彩活动平台',
					buttonText: '立即探索',
					link: '/explore',
					sort: 1,
					status: 'published',
					image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop'
				},
				{
					id: '002',
					title: '公益活动',
					description: '关爱老人，温暖社会',
					buttonText: '参与活动',
					link: '/charity',
					sort: 2,
					status: 'published',
					image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop'
				},
				{
					id: '003',
					title: '文化活动',
					description: '传承文化，乐享生活',
					buttonText: '了解更多',
					link: '/culture',
					sort: 3,
					status: 'draft',
					image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&h=400&fit=crop'
				},
				{
					id: '004',
					title: '春节活动',
					description: '新春佳节，共度美好时光',
					buttonText: '立即报名',
					link: '/spring-festival',
					sort: 4,
					status: 'disabled',
					image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'
				}
			],

			// 视图状态
			currentView: 'table',
			searchText: '',
			statusFilter: '',
			dateFilter: '',
			statusFilterIndex: 0,
			dateFilterIndex: 0,

			// 选择状态
			selectedItems: new Set(),

			// 编辑面板
			showPanel: false,
			editingId: null,
			formData: {
				title: '',
				description: '',
				buttonText: '',
				link: '',
				sort: 1,
				status: 'draft',
				image: ''
			},

			// 确认对话框
			showConfirm: false,
			confirmTitle: '',
			confirmMessage: '',
			confirmOkText: '确定',
			confirmAction: null,

			// 通知
			notification: {
				show: false,
				message: '',
				type: 'success',
				timeout: null
			},

			// 筛选选项
			statusOptions: ['全部状态', '已发布', '草稿', '已禁用'],
			dateOptions: ['全部时间', '今天', '本周', '本月']
		}
	},

	computed: {
		filteredCarousels() {
			let filtered = this.carouselData

			// 搜索筛选
			if (this.searchText) {
				filtered = filtered.filter(item =>
					item.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
					item.description.toLowerCase().includes(this.searchText.toLowerCase())
				)
			}

			// 状态筛选
			if (this.statusFilter) {
				filtered = filtered.filter(item => item.status === this.statusFilter)
			}

			// 时间筛选（这里简单模拟）
			if (this.dateFilter) {
				// 实际项目中需要根据时间进行筛选
				filtered = filtered
			}

			return filtered.sort((a, b) => a.sort - b.sort)
		},

		isAllSelected() {
			return this.filteredCarousels.length > 0 &&
				this.filteredCarousels.every(item => this.selectedItems.has(item.id))
		}
	},

	onLoad() {
		console.log('轮播图管理页面加载')
	},

	onShow() {
		// 重新加载数据
		this.loadCarouselData()
	},

	methods: {
		// 加载轮播图数据
		loadCarouselData() {
			try {
				const savedData = uni.getStorageSync('carouselData')
				if (savedData) {
					this.carouselData = savedData
				}
			} catch (error) {
				console.error('加载轮播图数据失败:', error)
			}
		},

		// 保存轮播图数据
		saveCarouselData() {
			try {
				uni.setStorageSync('carouselData', this.carouselData)
			} catch (error) {
				console.error('保存轮播图数据失败:', error)
			}
		},

		// 切换视图
		switchView(view) {
			this.currentView = view
		},

		// 搜索处理
		handleSearch(e) {
			this.searchText = e.detail.value
		},

		// 状态筛选
		handleStatusFilter(e) {
			this.statusFilterIndex = e.detail.value
			this.statusFilter = this.statusFilterIndex === 0 ? '' : ['published', 'draft', 'disabled'][this.statusFilterIndex - 1]
		},

		// 日期筛选
		handleDateFilter(e) {
			this.dateFilterIndex = e.detail.value
			this.dateFilter = this.dateFilterIndex === 0 ? '' : ['today', 'week', 'month'][this.dateFilterIndex - 1]
		},

		// 选择操作
		toggleSelectAll() {
			if (this.isAllSelected) {
				this.selectedItems.clear()
			} else {
				this.filteredCarousels.forEach(item => {
					this.selectedItems.add(item.id)
				})
			}
		},

		toggleItemSelection(id) {
			if (this.selectedItems.has(id)) {
				this.selectedItems.delete(id)
			} else {
				this.selectedItems.add(id)
			}
		},

		toggleCardSelection(id) {
			this.toggleItemSelection(id)
		},

		// 批量操作
		cancelBulkActions() {
			this.selectedItems.clear()
		},

		bulkPublish() {
			this.selectedItems.forEach(id => {
				const item = this.carouselData.find(item => item.id === id)
				if (item) {
					item.status = 'published'
				}
			})
			this.saveCarouselData()
			this.cancelBulkActions()
			this.showNotification('批量发布成功', 'success')
		},

		bulkDisable() {
			this.selectedItems.forEach(id => {
				const item = this.carouselData.find(item => item.id === id)
				if (item) {
					item.status = 'disabled'
				}
			})
			this.saveCarouselData()
			this.cancelBulkActions()
			this.showNotification('批量禁用成功', 'success')
		},

		bulkDelete() {
			if (this.selectedItems.size === 0) return

			this.confirmTitle = '确认批量删除'
			this.confirmMessage = `确定要删除选中的 ${this.selectedItems.size} 个轮播图吗？此操作不可撤销。`
			this.confirmOkText = '确定'
			this.confirmAction = () => {
				this.carouselData = this.carouselData.filter(item => !this.selectedItems.has(item.id))
				this.saveCarouselData()
				this.cancelBulkActions()
				this.showNotification('批量删除成功', 'success')
			}
			this.showConfirm = true
		},

		// 编辑面板操作
		showCreateModal() {
			this.editingId = null
			this.formData = {
				title: '',
				description: '',
				buttonText: '',
				link: '',
				sort: this.carouselData.length + 1,
				status: 'draft',
				image: ''
			}
			this.showPanel = true
		},

		showEditModal(id) {
			const item = this.carouselData.find(item => item.id === id)
			if (item) {
				this.editingId = id
				this.formData = { ...item }
				this.showPanel = true
			}
		},

		closePanel() {
			this.showPanel = false
			this.editingId = null
		},

		saveCarousel() {
			if (!this.formData.title.trim()) {
				this.showNotification('请输入标题', 'error')
				return
			}

			if (this.editingId) {
				// 编辑现有轮播图
				const index = this.carouselData.findIndex(item => item.id === this.editingId)
				if (index !== -1) {
					this.carouselData[index] = { ...this.formData }
				}
				this.showNotification('轮播图更新成功', 'success')
			} else {
				// 新增轮播图
				const newId = String(this.carouselData.length + 1).padStart(3, '0')
				this.carouselData.push({
					id: newId,
					...this.formData
				})
				this.showNotification('轮播图创建成功', 'success')
			}

			this.saveCarouselData()
			this.closePanel()
		},

		// 图片操作
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.formData.image = res.tempFilePaths[0]
				},
				fail: (err) => {
					console.error('选择图片失败:', err)
					this.showNotification('选择图片失败', 'error')
				}
			})
		},

		removeImage() {
			this.formData.image = ''
		},

		// 删除操作
		showDeleteConfirm(id) {
			const item = this.carouselData.find(item => item.id === id)
			if (item) {
				this.confirmTitle = '确认删除'
				this.confirmMessage = `确定要删除轮播图 "${item.title}" 吗？此操作不可撤销。`
				this.confirmOkText = '确定'
				this.confirmAction = () => {
					this.carouselData = this.carouselData.filter(item => item.id !== id)
					this.saveCarouselData()
					this.showNotification('轮播图删除成功', 'success')
				}
				this.showConfirm = true
			}
		},

		// 确认对话框操作
		closeConfirm() {
			this.showConfirm = false
			this.confirmAction = null
		},

		closeAllModals() {
			this.showPanel = false
			this.showConfirm = false
			this.confirmAction = null
		},

		// 通知操作
		showNotification(message, type = 'success') {
			this.notification.message = message
			this.notification.type = type
			this.notification.show = true

			if (this.notification.timeout) {
				clearTimeout(this.notification.timeout)
			}

			this.notification.timeout = setTimeout(() => {
				this.notification.show = false
			}, 3000)
		},

		// 辅助方法
		getStatusIcon(status) {
			switch (status) {
				case 'published': return '👁️'
				case 'draft': return '📝'
				case 'disabled': return '🚫'
				default: return '❓'
			}
		},

		getStatusText(status) {
			switch (status) {
				case 'published': return '已发布'
				case 'draft': return '草稿'
				case 'disabled': return '已禁用'
				default: return '未知'
			}
		},

		getNotificationIcon(type) {
			switch (type) {
				case 'success': return '✅'
				case 'error': return '❌'
				case 'warning': return '⚠️'
				case 'info': return 'ℹ️'
				default: return '📢'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.carousel-admin-container {
	width: 100%;
	min-height: 100vh;
	background-color: $uni-bg-color-grey;
	padding-bottom: 140rpx;
}

// 工具栏
.toolbar {
	background-color: $uni-bg-color;
	padding: 24rpx;
	margin-bottom: 24rpx;
	border-radius: 0;
	box-shadow: $shadow-sm;
}

.search-section {
	margin-bottom: 16rpx;
}

.search-input-wrapper {
	position: relative;
	background-color: $uni-bg-color-grey;
	border-radius: $uni-border-radius-lg;
	padding: 16rpx 48rpx;
}

.search-icon {
	position: absolute;
	left: 16rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.search-input {
	width: 100%;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	background: transparent;
}

.filters {
	display: flex;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.filter-picker {
	flex: 1;
}

.filter-btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx;
	background-color: $uni-bg-color-grey;
	border-radius: $uni-border-radius-lg;
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
}

.filter-arrow {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-grey;
}

.actions {
	display: flex;
	justify-content: flex-end;
}

.primary-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 32rpx;
	background: $gradient-primary;
	color: white;
	border-radius: $uni-border-radius-lg;
	font-size: $uni-font-size-sm;
	font-weight: 500;
	border: none;
}

// 批量操作栏
.bulk-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 24rpx;
	background-color: $primary-cambridge-blue;
	color: white;
	margin-bottom: 24rpx;
	border-radius: 0;
	animation: slideDown $animation-duration-base ease-out;
}

.bulk-info {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: $uni-font-size-sm;
}

.bulk-icon {
	font-size: 24rpx;
}

.bulk-buttons {
	display: flex;
	gap: 8rpx;
}

.bulk-btn {
	padding: 8rpx 16rpx;
	background-color: rgba(255, 255, 255, 0.2);
	color: white;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-xs;
	border: none;
}

.bulk-btn-danger {
	background-color: $uni-color-error;
}

// 视图切换
.view-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	margin-bottom: 24rpx;
}

.view-toggle {
	display: flex;
	background-color: $uni-bg-color-grey;
	border-radius: $uni-border-radius-lg;
	padding: 4rpx;
}

.view-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 12rpx 24rpx;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-grey;
	transition: all $animation-duration-fast;
}

.view-btn.active {
	background-color: $uni-bg-color;
	color: $primary-cambridge-blue;
	box-shadow: $shadow-sm;
}

.view-icon {
	font-size: 24rpx;
}

.count-info {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-grey;
}

// 表格视图
.table-view {
	background-color: $uni-bg-color;
	border-radius: 0;
	overflow: hidden;
	box-shadow: $shadow-sm;
	margin: 0 24rpx;
}

.table {
	width: 100%;
}

.table-header {
	display: flex;
	background-color: $uni-bg-color-grey;
	padding: 16rpx;
	border-bottom: 1rpx solid $uni-border-color;
}

.table-row {
	display: flex;
	padding: 24rpx 16rpx;
	border-bottom: 1rpx solid $uni-border-color;
	align-items: center;
	transition: background-color $animation-duration-fast;
}

.table-row.selected {
	background-color: rgba($primary-cambridge-blue, 0.1);
}

.table-row:last-child {
	border-bottom: none;
}

.table-cell {
	flex: 1;
	min-width: 0;
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
}

.table-cell:first-child {
	flex: 0 0 60rpx;
}

.table-cell:nth-child(2) {
	flex: 0 0 80rpx;
}

.table-cell:nth-child(4) {
	flex: 0 0 120rpx;
}

.table-cell:nth-child(5) {
	flex: 0 0 80rpx;
}

.table-cell:nth-child(6) {
	flex: 0 0 120rpx;
}

// 标题单元格
.title-cell {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.title-image {
	width: 48rpx;
	height: 48rpx;
	border-radius: $uni-border-radius-base;
	object-fit: cover;
}

.title-text {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

// 状态标签
.status-badge {
	display: inline-flex;
	align-items: center;
	gap: 4rpx;
	padding: 6rpx 12rpx;
	border-radius: 999rpx;
	font-size: $uni-font-size-xs;
}

.status-badge.published {
	background-color: rgba($uni-color-success, 0.1);
	color: $uni-color-success;
}

.status-badge.draft {
	background-color: rgba($uni-color-warning, 0.1);
	color: $uni-color-warning;
}

.status-badge.disabled {
	background-color: rgba($uni-color-error, 0.1);
	color: $uni-color-error;
}

.status-icon {
	font-size: $uni-font-size-xs;
}

// 操作按钮
.action-buttons {
	display: flex;
	gap: 8rpx;
}

.action-btn {
	width: 48rpx;
	height: 48rpx;
	border-radius: $uni-border-radius-base;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background-color: $uni-bg-color-grey;
}

.edit-btn:hover {
	background-color: rgba($primary-cambridge-blue, 0.1);
}

.delete-btn:hover {
	background-color: rgba($uni-color-error, 0.1);
}

// 卡片视图
.card-view {
	padding: 0 24rpx;
}

.card-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300rpx, 1fr));
	gap: 24rpx;
}

.carousel-card {
	background-color: $uni-bg-color;
	border-radius: $uni-border-radius-lg;
	overflow: hidden;
	box-shadow: $shadow-sm;
	transition: all $animation-duration-base;
}

.carousel-card.selected {
	box-shadow: 0 0 0 2rpx $primary-cambridge-blue;
}

.carousel-card:hover {
	transform: translateY(-4rpx);
	box-shadow: $shadow-lg;
}

.card-image {
	width: 100%;
	height: 180rpx;
	object-fit: cover;
}

.card-content {
	padding: 16rpx;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.card-title {
	font-size: $uni-font-size-base;
	font-weight: 600;
	color: $uni-text-color;
	flex: 1;
	margin-right: 8rpx;
	line-height: 1.4;
}

.card-status {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4rpx;
}

.sort-badge {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-grey;
	background-color: $uni-bg-color-grey;
	padding: 2rpx 8rpx;
	border-radius: $uni-border-radius-sm;
}

.card-description {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-grey;
	margin-bottom: 16rpx;
	line-height: 1.4;
	height: 40rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.card-actions {
	display: flex;
	gap: 8rpx;
}

.card-btn {
	flex: 1;
	padding: 8rpx 12rpx;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-xs;
	border: 1rpx solid $uni-border-color;
	background-color: $uni-bg-color;
	color: $uni-text-color;
}

.card-btn:hover {
	background-color: $uni-bg-color-grey;
}

// 新增卡片
.add-card {
	background-color: $uni-bg-color;
	border: 2rpx dashed $uni-border-color;
	border-radius: $uni-border-radius-lg;
	min-height: 300rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all $animation-duration-fast;
}

.add-card:hover {
	border-color: $primary-cambridge-blue;
	background-color: rgba($primary-cambridge-blue, 0.05);
}

.add-card-content {
	text-align: center;
}

.add-icon {
	font-size: 48rpx;
	color: $uni-text-color-grey;
	margin-bottom: 8rpx;
	display: block;
}

.add-text {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-grey;
}

// 编辑面板
.edit-panel {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 85%;
	max-width: 600rpx;
	max-height: 85vh;
	background-color: $uni-bg-color;
	border-radius: $uni-border-radius-lg;
	box-shadow: $shadow-xl;
	z-index: 1000;
	overflow: hidden;
}

.panel-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	border-bottom: 1rpx solid $uni-border-color;
}

.panel-title {
	font-size: $uni-font-size-lg;
	font-weight: 600;
	color: $uni-text-color;
}

.close-btn {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	padding: 8rpx;
}

.panel-content {
	max-height: calc(85vh - 200rpx);
	padding: 24rpx;
	overflow-y: auto;
	box-sizing: border-box;
}

.form-group {
	margin-bottom: 24rpx;
}

.form-label {
	display: block;
	font-size: $uni-font-size-sm;
	font-weight: 500;
	color: $uni-text-color;
	margin-bottom: 12rpx;
}

.form-label.required::after {
	content: ' *';
	color: $uni-color-error;
}

.form-input {
	width: 100%;
	padding: 20rpx 16rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	background-color: $uni-bg-color;
	box-sizing: border-box;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	min-height: 88rpx;
	line-height: 1.4;
	transition: border-color $animation-duration-fast, box-shadow $animation-duration-fast;
}

.form-input:focus {
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 4rpx rgba($primary-cambridge-blue, 0.1);
}

.form-input:placeholder {
	color: $uni-text-color-placeholder;
}

.form-textarea {
	width: 100%;
	min-height: 120rpx;
	padding: 20rpx 16rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	background-color: $uni-bg-color;
	resize: vertical;
	box-sizing: border-box;
	max-width: 100%;
	overflow-y: auto;
	line-height: 1.5;
	transition: border-color $animation-duration-fast, box-shadow $animation-duration-fast;
}

.form-textarea:focus {
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 4rpx rgba($primary-cambridge-blue, 0.1);
}

.form-textarea:placeholder {
	color: $uni-text-color-placeholder;
}

.char-count {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-grey;
	text-align: right;
	margin-top: 4rpx;
}

// 状态按钮
.status-buttons {
	display: flex;
	gap: 12rpx;
}

.status-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
	padding: 12rpx;
	border-radius: $uni-border-radius-base;
	border: 1rpx solid $uni-border-color;
	background-color: $uni-bg-color;
	color: $uni-text-color;
	font-size: $uni-font-size-sm;
	transition: all $animation-duration-fast;
}

.status-btn.active {
	color: white;
}

.status-btn.published.active {
	background-color: $uni-color-success;
	border-color: $uni-color-success;
}

.status-btn.draft.active {
	background-color: $uni-color-warning;
	border-color: $uni-color-warning;
}

.status-btn.disabled.active {
	background-color: $uni-color-error;
	border-color: $uni-color-error;
}

// 图片上传
.image-upload {
	border: 1rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	padding: 16rpx;
	background-color: $uni-bg-color-grey;
}

.image-preview {
	width: 100%;
	height: 200rpx;
	border-radius: $uni-border-radius-base;
	object-fit: cover;
	margin-bottom: 16rpx;
}

.upload-placeholder {
	text-align: center;
	padding: 40rpx 16rpx;
}

.upload-icon {
	font-size: 48rpx;
	color: $uni-text-color-grey;
	margin-bottom: 8rpx;
	display: block;
}

.upload-text {
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
	margin-bottom: 4rpx;
	display: block;
}

.upload-hint {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-grey;
}

.image-actions {
	display: flex;
	gap: 12rpx;
}

.remove-btn {
	flex: 1;
	padding: 8rpx 16rpx;
	background-color: $uni-color-error;
	color: white;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-sm;
	border: none;
}

.change-btn {
	flex: 1;
	padding: 8rpx 16rpx;
	background-color: $primary-cambridge-blue;
	color: white;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-sm;
	border: none;
}

.panel-footer {
	display: flex;
	gap: 16rpx;
	padding: 24rpx;
	border-top: 1rpx solid $uni-border-color;
}

.cancel-btn {
	flex: 1;
	padding: 16rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	background-color: $uni-bg-color;
	color: $uni-text-color;
	font-size: $uni-font-size-sm;
}

.save-btn {
	flex: 1;
	padding: 16rpx;
	background: $gradient-primary;
	color: white;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-sm;
	font-weight: 500;
	border: none;
}

// 遮罩层
.mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: $uni-bg-color-mask;
	z-index: 999;
}

// 确认对话框
.confirm-dialog {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 80%;
	max-width: 400rpx;
	background-color: $uni-bg-color;
	border-radius: $uni-border-radius-lg;
	box-shadow: $shadow-xl;
	z-index: 1001;
}

.confirm-content {
	padding: 32rpx;
}

.confirm-title {
	font-size: $uni-font-size-lg;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 16rpx;
	display: block;
}

.confirm-message {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-grey;
	margin-bottom: 32rpx;
	display: block;
	line-height: 1.4;
}

.confirm-actions {
	display: flex;
	gap: 16rpx;
}

.confirm-cancel {
	flex: 1;
	padding: 16rpx;
	border: 1rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	background-color: $uni-bg-color;
	color: $uni-text-color;
	font-size: $uni-font-size-sm;
}

.confirm-ok {
	flex: 1;
	padding: 16rpx;
	background-color: $uni-color-error;
	color: white;
	border-radius: $uni-border-radius-base;
	font-size: $uni-font-size-sm;
	font-weight: 500;
	border: none;
}

// 通知提示
.notification {
	position: fixed;
	top: 80rpx;
	right: 24rpx;
	min-width: 300rpx;
	padding: 16rpx 24rpx;
	background-color: $uni-bg-color;
	border-radius: $uni-border-radius-base;
	box-shadow: $shadow-lg;
	z-index: 1002;
	display: flex;
	align-items: center;
	gap: 12rpx;
	animation: slideIn $animation-duration-base ease-out;
}

.notification.success {
	border-left: 4rpx solid $uni-color-success;
}

.notification.error {
	border-left: 4rpx solid $uni-color-error;
}

.notification.warning {
	border-left: 4rpx solid $uni-color-warning;
}

.notification.info {
	border-left: 4rpx solid $primary-cambridge-blue;
}

.notification-icon {
	font-size: 24rpx;
}

.notification-text {
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
	flex: 1;
}

// 动画
@keyframes slideDown {
	from {
		transform: translateY(-100%);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes slideIn {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}

// 响应式设计
@media (max-width: 375px) {
	.toolbar {
		padding: 16rpx;
	}

	.table-view,
	.card-view {
		padding: 0 16rpx;
	}

	.card-grid {
		grid-template-columns: 1fr;
	}

	.edit-panel {
		width: 95%;
		max-width: 95%;
	}

	.panel-content {
		padding: 16rpx;
	}

	.form-group {
		margin-bottom: 20rpx;
	}

	.form-input {
		padding: 16rpx 12rpx;
		font-size: $uni-font-size-sm;
		min-height: 80rpx;
	}

	.form-textarea {
		padding: 16rpx 12rpx;
		font-size: $uni-font-size-sm;
		min-height: 100rpx;
	}

	.bulk-actions {
		flex-direction: column;
		align-items: flex-start;
		gap: 16rpx;
	}

	.bulk-buttons {
		width: 100%;
		justify-content: flex-end;
	}
}

// 移动端优化
@media (max-width: 480px) {
	.view-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 16rpx;
	}

	.filters {
		flex-direction: column;
	}

	.action-buttons {
		flex-direction: column;
	}

	.status-buttons {
		flex-direction: column;
	}

	.image-actions {
		flex-direction: column;
	}

	.edit-panel {
		width: 92%;
		max-width: 92%;
	}

	.form-input {
		font-size: $uni-font-size-base;
		min-height: 84rpx;
		padding: 18rpx 14rpx;
	}

	.form-textarea {
		font-size: $uni-font-size-base;
		min-height: 110rpx;
		padding: 18rpx 14rpx;
	}
}
</style>