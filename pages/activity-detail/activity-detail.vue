<template>
	<view class="activity-detail">

		<!-- Loading State -->
		<view v-if="!activity" class="loading-state">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- Main Content -->
		<scroll-view v-else class="main-content" scroll-y>
			<!-- Activity Poster with Countdown -->
			<view class="poster-section">
				<view class="countdown-badge">
					<text class="countdown-icon">⏰</text>
					<text class="countdown-text">距开始还有 {{ countdownText }}</text>
				</view>
				<image
					class="activity-poster"
					:src="activity.poster"
					mode="aspectFill"
					:lazy-load="true"
				></image>
			</view>

			<!-- Activity Basic Info -->
			<view class="info-section">
				<!-- Combined Activity Info Card -->
				<view class="card card-activity-info">
					<view class="activity-header">
						<text class="activity-title">{{ activity.title }}</text>
						<br>
						<text class="activity-brief">{{ activity.brief }}</text>
					</view>

					<view class="activity-meta">
						<view class="meta-item">
							<text class="meta-icon">📅</text>
							<view class="meta-content">
								<text class="meta-label">时间</text>
								<text class="meta-value">{{ activity.date }} {{ activity.time }}</text>
							</view>
						</view>
						<view class="meta-item">
							<text class="meta-icon">📍</text>
							<view class="meta-content">
								<text class="meta-label">地点</text>
								<text class="meta-value">{{ activity.location }} {{ activity.room }}</text>
							</view>
						</view>
						<view class="meta-item">
							<text class="meta-icon">👥</text>
							<view class="meta-content">
								<text class="meta-label">报名</text>
								<text class="meta-value">{{ activity.registeredCount }}/{{ activity.maxParticipants }}人</text>
							</view>
						</view>
						<view class="meta-item">
							<text class="meta-icon">💰</text>
							<view class="meta-content">
								<text class="meta-label">费用</text>
								<text class="meta-value">{{ activity.price }}</text>
							</view>
						</view>
					</view>

					<view class="progress-section">
						<view class="progress-bar-container">
							<view
								class="progress-bar"
								:style="{ width: `${(activity.registeredCount / activity.maxParticipants) * 100}%` }"
							></view>
						</view>
						<text class="progress-text">还剩 {{ activity.maxParticipants - activity.registeredCount }} 个名额</text>
					</view>
				</view>

				<!-- Activity Details -->
				<view class="card card-details">
					<text class="detail-text">{{ activity.description }}</text>
					<view class="image-grid">
						<image
							class="detail-image"
							:src="activity.images[0]"
							mode="aspectFill"
							:lazy-load="true"
						></image>
						<image
							class="detail-image"
							:src="activity.images[1]"
							mode="aspectFill"
							:lazy-load="true"
						></image>
					</view>
				</view>

				<!-- Warning Section (Collapsible) -->
				<view class="card card-warning">
					<view class="warning-header" @click="toggleWarning">
						<view class="warning-title">
							<text class="warning-icon">⚠️</text>
							<text class="warning-text">温馨提示</text>
							<view class="badge badge-warning">{{ activity.warnings.length }} 项</view>
						</view>
						<text class="warning-arrow" :class="{ 'rotated': showWarning }">▼</text>
					</view>
					<view v-if="showWarning" class="warning-content">
						<view
							v-for="(item, index) in activity.warnings"
							:key="index"
							class="warning-item"
						>
							<text class="warning-bullet">•</text>
							<text class="warning-item-text">{{ item }}</text>
						</view>
					</view>
				</view>

				<!-- Activity Tags -->
				<view class="card card-tags">
					<view class="tags-header">
						<text class="tags-title">活动标签</text>
						<view class="badge badge-secondary">{{ activity.tags.length }} 个</view>
					</view>
					<view class="tags-container">
						<view
							v-for="(tag, index) in activity.tags"
							:key="index"
							class="badge badge-tag"
						>
							{{ tag }}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- Fixed Bottom Action Bar -->
		<view class="bottom-bar">
			<!-- Organizer Info Card -->
			<view class="card card-organizer">
				<view class="organizer-left">
					<view class="avatar avatar-organizer">
						<text class="avatar-text">🏢</text>
					</view>
					<view class="organizer-details">
						<view class="organizer-name-row">
							<text class="organizer-name">{{ activity.organizer.name }}</text>
							<view class="badge badge-verified">
								<text class="badge-text">已认证</text>
							</view>
						</view>
						<text class="organizer-role">主办方</text>
					</view>
				</view>
				<button class="button button-icon" @click="contactOrganizer">
					<text class="button-icon">📞</text>
				</button>
			</view>

			<!-- Action Buttons -->
			<view class="action-buttons">
				<view class="button-row">
					<button class="button button-secondary" @click="shareActivity">
						<text class="button-icon">📤</text>
						<text class="button-text">活动分享</text>
					</button>
					<button
						class="button button-primary"
						:class="{ 'button-success': isRegistered }"
						@click="registerActivity"
					>
						<text class="button-icon">{{ isRegistered ? '✅' : '👤' }}</text>
						<text class="button-text">{{ isRegistered ? '已报名' : '立即报名' }}</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifndef VUE3
import Vue from 'vue'
// #endif

export default {
	data() {
		return {
			activity: null, // 初始化为null，等待数据加载
			isFavorited: false,
			isRegistered: false,
			showWarning: false,
			countdownText: '',
			countdownInterval: null
		}
	},

	onLoad(options) {
		console.log('Activity detail page loaded with options:', options)

		// 如果有传入活动ID，加载对应的活动数据
		if (options.id) {
			this.loadActivityData(options.id)
		} else {
			// 如果没有ID，默认加载第一个活动
			this.loadActivityData('1')
		}
	},

	onUnload() {
		// 清理倒计时定时器
		if (this.countdownInterval) {
			clearInterval(this.countdownInterval)
		}
	},

	methods: {
		loadActivityData(id) {
			console.log('Loading activity data for ID:', id)

			// Mock activity data - in real app, this would come from API
			const activityData = {
				1: {
					id: '1',
					title: '传统文化书法体验班',
					brief: '感受中华传统文化魅力，学习书法艺术精髓',
					poster: 'https://images.unsplash.com/photo-1511632765486-a01980e01aeb?w=400&h=300&fit=crop',
					date: '2025年1月20日',
					time: '14:00 - 16:00',
					location: '朝阳区文化中心',
					room: '3楼书法教室',
					description: '本次书法体验班特邀著名书法家王老师亲自授课，为零基础的老年朋友们提供专业的书法指导。课程将涵盖书法基础知识、基本笔画练习、简单作品创作等内容。',
					images: [
						'https://images.unsplash.com/photo-1533106498998-0168ef5125ee?w=300&h=200&fit=crop',
						'https://images.unsplash.com/photo-1568605114967-8130f3a36bb4?w=300&h=200&fit=crop'
					],
					courseContent: [
						'书法历史与文化背景介绍',
						'正确握笔姿势和坐姿指导',
						'基本笔画练习（横、竖、撇、捺）',
						'简单汉字书写练习',
						'个人作品创作与展示'
					],
					targetAudience: '60岁以上老年人，有无书法基础均可参加。我们提供全套书法用具，包括毛笔、墨汁、宣纸等。',
					warnings: [
						'场馆内禁止携带打火机等易燃物品',
						'高血压、心脏病患者请谨慎参与',
						'行动不便者建议有家属陪同',
						'请穿着舒适的衣物，避免过于华丽的装饰'
					],
					tags: ['琴棋书画', '文化教育', '线下活动', '传统文化', '适合初学者'],
					organizer: {
						name: '文化科技有限公司',
						phone: '400-123-4567'
					},
					maxParticipants: 50,
					registeredCount: 23,
					price: '免费',
					startTime: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3天后
				},
				2: {
					id: '2',
					title: '健康讲座',
					brief: '关爱老人健康，专家面对面指导',
					poster: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop',
					date: '2025年1月22日',
					time: '09:30 - 11:30',
					location: '健康中心',
					room: '多功能厅',
					description: '本次健康讲座特别邀请知名中医专家，为老年朋友们讲解冬季养生知识。讲座内容包括常见老年疾病的预防、日常保健方法、饮食营养搭配等实用内容。',
					images: [
						'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
						'https://images.unsplash.com/photo-1576243388700-4c7794f2d9c5?w=300&h=200&fit=crop'
					],
					courseContent: [
						'冬季养生基本原则',
						'常见老年疾病预防',
						'饮食营养搭配指导',
						'运动保健方法',
						'心理健康维护'
					],
					targetAudience: '55岁以上老年朋友，欢迎携带家人一同参加。',
					warnings: [
						'请提前记录想要咨询的健康问题',
						'如有特殊疾病史请提前告知工作人员',
						'建议携带常用药品清单',
						'活动期间请保持安静'
					],
					tags: ['健康养生', '讲座培训', '医疗健康', '专家指导'],
					organizer: {
						name: '健康协会',
						phone: '400-234-5678'
					},
					maxParticipants: 80,
					registeredCount: 45,
					price: '免费',
					startTime: Date.now() + (5 * 24 * 60 * 60 * 1000) // 5天后
				},
				3: {
					id: '3',
					title: '摄影交流',
					brief: '春日摄影，记录美好时光',
					poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
					date: '2025年1月25日',
					time: '08:00 - 12:00',
					location: '人民公园',
					room: '南门集合',
					description: '春天是摄影的好季节！摄影协会将组织户外摄影活动，带领老年朋友们走进公园，用镜头记录春天的美好瞬间。活动包括摄影技巧讲解、实地拍摄指导和作品分享。',
					images: [
						'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=300&h=200&fit=crop',
						'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop'
					],
					courseContent: [
						'摄影基础知识讲解',
						'构图技巧指导',
						'光线运用技巧',
						'实地拍摄练习',
						'作品点评与分享'
					],
					targetAudience: '50岁以上老年朋友，身体健康，能够行走2小时。',
					warnings: [
						'请穿着舒适的鞋子',
						'根据天气情况准备防晒或保暖用品',
						'建议家人陪同参加',
						'请携带饮用水'
					],
					tags: ['户外活动', '摄影艺术', '交流学习', '春季活动'],
					organizer: {
						name: '摄影协会',
						phone: '400-345-6789'
					},
					maxParticipants: 30,
					registeredCount: 18,
					price: '免费',
					startTime: Date.now() + (8 * 24 * 60 * 60 * 1000) // 8天后
				},
				4: {
					id: '4',
					title: '太极拳班',
					brief: '强身健体，修身养性',
					poster: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
					date: '2025年1月28日',
					time: '06:30 - 07:30',
					location: '体育场',
					room: '中央广场',
					description: '太极拳是中国传统武术的瑰宝，适合老年朋友练习。本课程从基础动作开始，教授24式简化太极拳，帮助老年人强身健体，延缓衰老。',
					images: [
						'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
						'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop'
					],
					courseContent: [
						'太极拳基本姿势',
						'24式简化太极拳教学',
						'呼吸配合方法',
						'练习注意事项',
						'长期练习建议'
					],
					targetAudience: '55岁以上老年朋友，身体健康，无严重心脑血管疾病。',
					warnings: [
						'请提前15分钟到达现场',
						'清晨气温较低，请注意保暖',
						'如有不适请立即停止练习',
						'建议穿着运动服装和运动鞋'
					],
					tags: ['体育运动', '传统武术', '健康养生', '晨练活动'],
					organizer: {
						name: '体育协会',
						phone: '400-456-7890'
					},
					maxParticipants: 40,
					registeredCount: 28,
					price: '免费',
					startTime: Date.now() + (11 * 24 * 60 * 60 * 1000) // 11天后
				}
			}

			this.activity = activityData[id]
			if (!this.activity) {
				console.warn('Activity not found for ID:', id, 'using default activity 1')
				this.activity = activityData[1]
			}

			console.log('Loaded activity data:', this.activity)

			// 数据加载完成后启动倒计时
			this.startCountdown()
		},

		startCountdown() {
			this.updateCountdown()
			this.countdownInterval = setInterval(() => {
				this.updateCountdown()
			}, 1000)
		},

		updateCountdown() {
			const now = new Date().getTime()
			const distance = this.activity.startTime - now

			if (distance < 0) {
				this.countdownText = '活动已开始'
				clearInterval(this.countdownInterval)
				return
			}

			const days = Math.floor(distance / (1000 * 60 * 60 * 24))
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((distance % (1000 * 60)) / 1000)

			if (days > 0) {
				this.countdownText = `${days}天 ${hours}小时`
			} else if (hours > 0) {
				this.countdownText = `${hours}小时 ${minutes}分钟`
			} else {
				this.countdownText = `${minutes}分钟 ${seconds}秒`
			}
		},

		goBack() {
			uni.navigateBack()
		},

		shareActivity() {
			uni.showActionSheet({
				itemList: ['分享给好友', '复制链接', '生成海报'],
				success: (res) => {
					switch (res.tapIndex) {
						case 0:
							this.shareToFriends()
							break
						case 1:
							this.copyLink()
							break
						case 2:
							this.generatePoster()
							break
					}
				}
			})
		},

		shareToFriends() {
			// 检查平台API支持
			if (uni.shareWithSystem) {
				uni.shareWithSystem({
					type: 0,
					title: this.activity.title,
					summary: this.activity.brief,
					imageUrl: this.activity.poster,
					href: `https://example.com/activity/${this.activity.id}`,
					success: () => {
						uni.showToast({ title: '分享成功', icon: 'success' })
					},
					fail: (err) => {
						uni.showToast({ title: '分享失败', icon: 'none' })
					}
				})
			} else {
				// 降级方案：复制链接
				this.copyLink()
			}
		},

		copyLink() {
			uni.setClipboardData({
				data: `https://example.com/activity/${this.activity.id}`,
				success: () => {
					uni.showToast({ title: '链接已复制', icon: 'success' })
				}
			})
		},

		generatePoster() {
			uni.showToast({ title: '海报生成功能开发中', icon: 'none' })
		},

		toggleFavorite() {
			this.isFavorited = !this.isFavorited
			uni.showToast({
				title: this.isFavorited ? '已添加到收藏' : '已取消收藏',
				icon: 'success'
			})
		},

		contactOrganizer() {
			uni.showModal({
				title: '联系主办方',
				content: `是否拨打主办方电话：${this.activity.organizer.phone}？`,
				success: (res) => {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: this.activity.organizer.phone
						})
					}
				}
			})
		},

		toggleWarning() {
			this.showWarning = !this.showWarning
		},

		registerActivity() {
			if (this.isRegistered) {
				uni.showToast({ title: '您已经报名过了', icon: 'none' })
				return
			}

			if (this.activity.registeredCount >= this.activity.maxParticipants) {
				uni.showToast({ title: '报名人数已满', icon: 'none' })
				return
			}

			uni.navigateTo({
				url: `/pages/registration/registration?activityId=${this.activity.id}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
// 使用相对路径导入
@import '../../uni.scss';

.activity-detail {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: $uni-bg-color-grey;
}

/* Loading State */
.loading-state {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: $uni-bg-color-grey;
}

.loading-text {
	font-size: 32rpx;
	color: $uni-text-color-grey;
}

/* Main Content */
.main-content {
	flex: 1;
	overflow-y: auto;
	padding-bottom: 320rpx;
}

/* Poster Section */
.poster-section {
	position: relative;
}

.countdown-badge {
	position: absolute;
	top: 32rpx;
	right: 32rpx;
	z-index: 10;
	background: linear-gradient(135deg, $primary-old-gold, $primary-lion);
	padding: 16rpx 32rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	box-shadow: $shadow-md;
}

.countdown-icon {
	font-size: 24rpx;
	color: white;
}

.countdown-text {
	color: white;
	font-size: 24rpx;
	font-weight: 500;
}

.activity-poster {
	width: 100%;
	height: 400rpx;
	border-radius: 24rpx;
	box-shadow: $shadow-md;
}

/* Info Section */
.info-section {
	padding: 32rpx 24rpx;
}

/* Card margins reduced for compact layout */
.card {
	margin-bottom: 24rpx;
}

/* Cards Grid */
.cards-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.info-card {
	background: $uni-bg-color;
	border: 2rpx solid $uni-border-color;
	border-radius: 24rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	transition: all 0.3s ease;
}

.info-card:active {
	transform: translateY(-4rpx);
	box-shadow: $shadow-lg;
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.time-icon {
	background: $primary-cambridge-blue;
}

.location-icon {
	background: $primary-pistachio;
}

.card-icon .icon {
	font-size: 48rpx;
	color: $uni-text-color-inverse;
}

.card-content {
	flex: 1;
}

.card-label {
	font-size: 28rpx;
	color: $uni-text-color-grey;
}

.card-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-top: 8rpx;
}

.card-subtitle {
	font-size: 28rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
}

/* Detail Section */
.detail-section {
	margin-bottom: 48rpx;
}

.section-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 32rpx;
}

.section-icon {
	font-size: 40rpx;
}

.section-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $primary-cambridge-blue;
}

.detail-content {
	background: $uni-bg-color;
	border-radius: 32rpx;
	padding: 48rpx;
}

.detail-text {
	font-size: 32rpx;
	color: $uni-text-color;
	line-height: 1.8;
	margin-bottom: 32rpx;
}

.image-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 24rpx;
	margin: 48rpx 0;
}

.detail-image {
	width: 100%;
	height: 320rpx;
	border-radius: 24rpx;
	object-fit: cover;
}

.content-list {
	margin-bottom: 32rpx;
}

.list-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 24rpx;
}

.list-item {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.list-bullet {
	font-size: 32rpx;
	color: $primary-cambridge-blue;
	flex-shrink: 0;
	margin-top: 8rpx;
}

.list-text {
	font-size: 32rpx;
	color: $uni-text-color;
	line-height: 1.6;
	flex: 1;
}

.target-audience {
	margin-top: 32rpx;
}

.audience-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $uni-text-color;
	margin-bottom: 16rpx;
}

.audience-text {
	font-size: 32rpx;
	color: $uni-text-color;
	line-height: 1.6;
}

/* Warning Section */
.warning-section {
	background: linear-gradient(135deg, #fef3c7, #fde68a);
	border: 2rpx solid #f59e0b;
	border-radius: 32rpx;
	margin-bottom: 48rpx;
	overflow: hidden;
}

.warning-header {
	padding: 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.warning-title {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.warning-icon {
	font-size: 40rpx;
	color: #f59e0b;
}

.warning-text {
	font-size: 36rpx;
	font-weight: 600;
	color: #92400e;
}

.warning-arrow {
	font-size: 32rpx;
	color: #f59e0b;
	transition: transform 0.3s ease;
}

.warning-arrow.rotated {
	transform: rotate(180deg);
}

.warning-content {
	padding: 0 32rpx 32rpx;
}

.warning-item {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.warning-bullet {
	font-size: 32rpx;
	color: #f59e0b;
	flex-shrink: 0;
	margin-top: 8rpx;
}

.warning-item-text {
	font-size: 32rpx;
	color: #92400e;
	line-height: 1.6;
	flex: 1;
}

/* Tags Section */
.tags-section {
	margin-bottom: 48rpx;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.tag-chip {
	background: $uni-bg-color-hover;
	color: $uni-text-color-grey;
	border: 2rpx solid $uni-border-color;
	border-radius: 999rpx;
	padding: 16rpx 32rpx;
	font-size: 28rpx;
	transition: all 0.2s ease;
}

.tag-chip:active {
	background: $primary-mindaro;
	color: $uni-text-color;
	transform: scale(1.05);
}

/* Bottom Bar */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: $uni-bg-color;
	border-top: 2rpx solid $uni-border-color;
}

.organizer-info {
	padding: 24rpx 32rpx;
	border-bottom: 2rpx solid $uni-border-color;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.organizer-left {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.organizer-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, $primary-old-gold, $primary-lion);
	display: flex;
	align-items: center;
	justify-content: center;
}

.organizer-icon {
	font-size: 32rpx;
	color: $uni-text-color-inverse;
}

.organizer-details {
	flex: 1;
}

.organizer-name-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.organizer-name {
	font-size: 32rpx;
	font-weight: 600;
	color: $uni-text-color;
}

.verified-badge {
	background: linear-gradient(135deg, $primary-old-gold, $primary-lion);
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
}

.verified-text {
	font-size: 20rpx;
	color: $uni-text-color-inverse;
	font-weight: 500;
}

.organizer-role {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
}

.contact-button {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: $uni-bg-color-hover;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.contact-button:active {
	background: $uni-border-color;
	transform: scale(0.95);
}

.contact-icon {
	font-size: 36rpx;
	color: $uni-text-color;
}

.action-buttons {
	padding: 24rpx 32rpx;
}

.stats-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-label {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.stat-value {
	font-size: 28rpx;
	font-weight: 600;
	color: $primary-cambridge-blue;
	margin-top: 4rpx;
}

.stat-value.registered {
	color: $uni-color-success;
}

.stat-value.free {
	color: $uni-color-success;
}

.button-row {
	display: flex;
	gap: 24rpx;
}

.share-button {
	flex: 1;
	background: $uni-bg-color-hover;
	color: $uni-text-color;
	padding: 32rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	transition: all 0.3s ease;
}

.share-button:active {
	background: $uni-border-color;
	transform: translateY(-2rpx);
}

.share-icon {
	font-size: 36rpx;
}

.share-text {
	font-size: 32rpx;
	font-weight: 500;
}

.register-button {
	flex: 1;
	background: $gradient-primary;
	color: $uni-text-color-inverse;
	padding: 32rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	transition: all 0.3s ease;
}

.register-button:active {
	transform: translateY(-2rpx);
	box-shadow: $shadow-lg;
}

.register-button.registered {
	background: $uni-color-success;
}

.register-icon {
	font-size: 36rpx;
}

.register-text {
	font-size: 32rpx;
	font-weight: 500;
}

/* Responsive Design */
@media (max-width: 750rpx) {
	.activity-poster {
		height: 400rpx;
		border-radius: 16rpx;
	}

	.info-card {
		border-radius: 16rpx;
		padding: 24rpx;
	}

	.detail-content {
		border-radius: 16rpx;
		padding: 32rpx;
	}

	.image-grid {
		grid-template-columns: 1fr;
	}

	.detail-image {
		height: 240rpx;
		border-radius: 16rpx;
	}
}

/* Animations */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.title-section,
.cards-grid > view,
.detail-section,
.warning-section,
.tags-section {
	animation: fadeIn 0.6s ease-out;
}

.cards-grid > view:nth-child(2) {
	animation-delay: 0.1s;
}

.detail-section {
	animation-delay: 0.2s;
}

.warning-section {
	animation-delay: 0.3s;
}

.tags-section {
	animation-delay: 0.4s;
}

/* Shadcn-Inspired Components */

/* Card Components */
.card {
	background: $uni-bg-color;
	border: 2rpx solid $uni-border-color;
	border-radius: 24rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: $shadow-sm;
	transition: all 0.3s ease;
}

.card:active {
	transform: translateY(-4rpx);
	box-shadow: $shadow-md;
}

.card-title {
	background: linear-gradient(135deg, $primary-cambridge-blue, $primary-pistachio);
	color: $uni-text-color-inverse;
	border: none;
}

.card-info {
	display: flex;
	align-items: center;
	gap: 32rpx;
}

.card-progress {
	background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
	border-color: $primary-cambridge-blue;
}

.card-activity-info {
	background: linear-gradient(135deg, $primary-cambridge-blue, $primary-pistachio);
	border: none;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: $shadow-md;
	color: $uni-text-color-inverse;
}

.card-activity-info:active {
	transform: translateY(-2rpx);
	box-shadow: $shadow-lg;
}

.card-details {
	background: $uni-bg-color;
	border: 2rpx solid $uni-border-color;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: $shadow-sm;
}

.card-details:active {
	transform: translateY(-2rpx);
	box-shadow: $shadow-md;
}

.card-warning {
	background: linear-gradient(135deg, #fef3c7, #fde68a);
	border-color: #f59e0b;
}

.card-tags {
	background: linear-gradient(135deg, #f0fdf4, #dcfce7);
	border-color: $primary-pistachio;
}

.card-organizer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	margin-bottom: 0;
	border-radius: 0;
	border-bottom: 2rpx solid $uni-border-color;
}

.card-actions {
	margin-bottom: 0;
	border-radius: 0;
}

/* Badge Components */
.badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
	font-size: 24rpx;
	font-weight: 500;
	transition: all 0.2s ease;
}

.badge-warning {
	background: #f59e0b;
	color: white;
}

.badge-secondary {
	background: $uni-bg-color-hover;
	color: $uni-text-color-grey;
}

.badge-success {
	background: $uni-color-success;
	color: white;
}

.badge-free {
	background: $primary-old-gold;
	color: white;
}

.badge-verified {
	background: linear-gradient(135deg, $primary-old-gold, $primary-lion);
	color: $uni-text-color-inverse;
}

.badge-tag {
	background: $uni-bg-color-hover;
	color: $uni-text-color-grey;
	border: 2rpx solid $uni-border-color;
	padding: 12rpx 24rpx;
	margin: 8rpx;
}

.badge-tag:active {
	background: $primary-mindaro;
	color: $uni-text-color;
	transform: scale(1.05);
}

/* Progress Component */
.progress-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.progress-title {
	font-size: 32rpx;
	font-weight: 600;
	color: $primary-cambridge-blue;
}

.progress-stats {
	font-size: 28rpx;
	color: $uni-text-color-grey;
}

.progress-bar-container {
	width: 100%;
	height: 16rpx;
	background: $uni-bg-color-hover;
	border-radius: 999rpx;
	overflow: hidden;
	margin-bottom: 16rpx;
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, $primary-cambridge-blue, $primary-pistachio);
	border-radius: 999rpx;
	transition: width 0.3s ease;
}

.progress-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.progress-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
}

.progress-percentage {
	font-size: 24rpx;
	font-weight: 600;
	color: $primary-cambridge-blue;
}

/* Simplified Detail Component */
.card-details .detail-text {
	font-size: 32rpx;
	color: $uni-text-color;
	line-height: 1.6;
	margin-bottom: 32rpx;
}

.card-details .image-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 24rpx;
}

.card-details .detail-image {
	width: 100%;
	height: 320rpx;
	border-radius: 16rpx;
	object-fit: cover;
}

/* Avatar Component */
.avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.avatar-organizer {
	background: linear-gradient(135deg, $primary-old-gold, $primary-lion);
}

.avatar-text {
	font-size: 32rpx;
	color: $uni-text-color-inverse;
}

/* Button Components */
.button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	padding: 32rpx;
	border-radius: 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	transition: all 0.3s ease;
	border: none;
	outline: none;
}

.button:active {
	transform: translateY(-2rpx);
}

.button-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: $uni-bg-color-hover;
	padding: 0;
}

.button-icon:active {
	background: $uni-border-color;
	transform: scale(0.95);
}

.button-secondary {
	background: $uni-bg-color-hover;
	color: $uni-text-color;
}

.button-secondary:active {
	background: $uni-border-color;
}

.button-primary {
	background: $gradient-primary;
	color: $uni-text-color-inverse;
}

.button-primary:active {
	box-shadow: $shadow-lg;
}

.button-success {
	background: $uni-color-success;
	color: white;
}

.button-text {
	font-size: 32rpx;
	font-weight: 500;
}

/* Enhanced Card Styles */
.card-title .card-content {
	padding: 32rpx;
}

.card-title .activity-title {
	font-size: 40rpx;
	font-weight: 700;
	color: $uni-text-color-inverse;
	line-height: 1.2;
}

.card-title .activity-brief {
	font-size: 30rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1;
	margin-top: 10rpx;
}

/* Activity Info Card Styles */
.activity-header {
	margin-bottom: 32rpx;
}

.activity-header .activity-title {
	font-size: 40rpx;
	font-weight: 700;
	color: $uni-text-color-inverse;
	line-height: 1.2;
	margin-bottom: 12rpx;
}

.activity-header .activity-brief {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.4;
}

.activity-meta {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.meta-item {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
}

.meta-icon {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.8);
	flex-shrink: 0;
	margin-top: 4rpx;
}

.meta-content {
	flex: 1;
}

.meta-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 4rpx;
}

.meta-value {
	font-size: 28rpx;
	color: $uni-text-color-inverse;
	font-weight: 500;
	line-height: 1.3;
}

.progress-section {
	background: rgba(255, 255, 255, 0.2);
	border-radius: 16rpx;
	padding: 20rpx;
}

.progress-bar-container {
	width: 100%;
	height: 12rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 999rpx;
	overflow: hidden;
	margin-bottom: 12rpx;
}

.progress-bar {
	height: 100%;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 999rpx;
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	text-align: center;
}

/* Tags Header */
.tags-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.tags-title {
	font-size: 36rpx;
	font-weight: 600;
	color: $primary-cambridge-blue;
}
</style>