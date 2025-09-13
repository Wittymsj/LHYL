<template>
	<view class="container">
		<!-- 轮播横幅 -->
		<view class="carousel-section">
			<swiper
				class="carousel"
				:indicator-dots="true"
				:autoplay="true"
				:interval="5000"
				:duration="500"
				indicator-color="rgba(255,255,255,0.3)"
				indicator-active-color="#ffffff">
				<swiper-item v-for="(item, index) in carouselItems" :key="index">
					<view class="carousel-item">
						<image :src="item.image" mode="aspectFill" class="carousel-image"></image>
						<view class="carousel-overlay">
							<view class="carousel-content">
								<text class="carousel-title">{{item.title}}</text>
								<text class="carousel-subtitle">{{item.subtitle}}</text>
								<view class="carousel-btn" @click="handleCarouselAction(item.action)">
									<text class="carousel-btn-text">{{item.buttonText}}</text>
								</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 活动分类 -->
		<view class="category-section">
			<view class="section-header">
				<text class="section-title">活动分类</text>
			</view>
			<scroll-view class="category-scroll" scroll-x="true" show-scrollbar="false">
				<view
					class="category-chip"
					:class="{'category-chip-active': selectedCategory === category.id}"
					v-for="category in categories"
					:key="category.id"
					@click="selectCategory(category.id)">
					<text class="category-emoji">{{category.icon}}</text>
					<text class="category-label">{{category.name}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 今日推荐 -->
		<view class="featured-section">
			<view class="featured-card">
				<view class="featured-content">
					<view class="featured-nav-floating">
						<view class="nav-pill" @click="prevFeatured">
							<text class="nav-icon">‹</text>
						</view>
						<view class="nav-pill" @click="nextFeatured">
							<text class="nav-icon">›</text>
						</view>
					</view>
					<text class="featured-title">特别推荐：春节联欢会</text>
					<text class="featured-subtitle">与邻里共度新春佳节，精彩演出等你来</text>
					<view class="featured-footer">
						<text class="featured-date">📅 2025-02-10</text>
						<view class="featured-btn" @click="registerActivity">
							<text class="featured-btn-text">立即报名</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 推荐活动 -->
		<view class="activities-section" id="recommended-activities">
			<view class="section-header">
				<text class="section-title">推荐活动</text>
				<text class="section-more" @click="viewMoreActivities">查看更多 →</text>
			</view>
			<view class="activities-grid">
				<view
					class="activity-card"
					v-for="activity in activities"
					:key="activity.id"
					@click="viewActivityDetail(activity.id)">
					<view class="activity-media">
						<image :src="activity.image" mode="aspectFill" class="activity-image"></image>
						<view class="activity-badge" v-if="activity.tag" :class="`badge-${activity.tagType}`">
							<text class="badge-text">{{activity.tag}}</text>
						</view>
						<view class="activity-date-badge">
							<text class="badge-text">{{activity.date}}</text>
						</view>
					</view>
					<view class="activity-body">
						<text class="activity-title">{{activity.title}}</text>
						<view class="activity-meta">
							<view class="meta-item">
								<text class="meta-icon">📍</text>
								<text class="meta-text">{{activity.location}}</text>
							</view>
							<view class="meta-item">
								<text class="meta-icon">🏢</text>
								<text class="meta-text">{{activity.organizer}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedCategory: null,
			carouselItems: [
				{
					title: '平台介绍',
					subtitle: '专为老年朋友打造的精彩活动平台',
					buttonText: '立即探索',
					image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop',
					action: 'explore'
				},
				{
					title: '公益活动',
					subtitle: '关爱老人，温暖社会',
					buttonText: '参与活动',
					image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop',
					action: 'charity'
				},
				{
					title: '文化活动',
					subtitle: '传承文化，乐享生活',
					buttonText: '了解更多',
					image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&h=400&fit=crop',
					action: 'culture'
				}
			],
			categories: [
				{ id: 'second-life', name: '第二人生', icon: '❤️' },
				{ id: 'arts', name: '琴棋书画', icon: '🎨' },
				{ id: 'health', name: '自然健康', icon: '🤝' },
				{ id: 'medicine', name: '中医养生', icon: '🌿' },
				{ id: 'heritage', name: '非遗文化', icon: '📚' },
				{ id: 'travel', name: '文旅研学', icon: '📍' },
				{ id: 'lifestyle', name: '品鉴生活', icon: '⭐' },
				{ id: 'charity', name: '公益行动', icon: '👥' },
				{ id: 'tech', name: '时代科技', icon: '⚡' },
				{ id: 'cooking', name: '美食烹饪', icon: '👨‍🍳' },
				{ id: 'music', name: '音乐舞蹈', icon: '🎵' },
				{ id: 'reading', name: '阅读分享', icon: '📖' }
			],
			activities: [
				{
					id: 1,
					title: '书法班入门',
					date: '2025-01-20',
					location: '社区活动中心',
					organizer: '文化协会',
					image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=200&fit=crop'
				},
				{
					id: 2,
					title: '健康讲座',
					date: '2025-01-22',
					location: '健康中心',
					organizer: '健康协会',
					image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=200&fit=crop'
				},
				{
					id: 3,
					title: '摄影交流',
					date: '2025-01-25',
					location: '公园',
					organizer: '摄影协会',
					tag: '限免',
					tagType: 'free',
					image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
				},
				{
					id: 4,
					title: '太极拳班',
					date: '2025-01-28',
					location: '体育场',
					organizer: '体育协会',
					tag: '推荐',
					tagType: 'recommended',
					image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop'
				}
			]
		}
	},
	onLoad() {
		console.log('页面加载完成')
	},
	methods: {
		selectCategory(categoryId) {
			this.selectedCategory = categoryId
			console.log('选择分类:', categoryId)
		},

		handleCarouselAction(action) {
			console.log('轮播操作:', action)
			uni.showToast({
				title: `操作: ${action}`,
				icon: 'none'
			})
		},

		viewAllCategories() {
			console.log('查看所有分类')
			uni.showToast({
				title: '查看所有分类',
				icon: 'none'
			})
		},

		prevFeatured() {
			console.log('上一个推荐')
		},

		nextFeatured() {
			console.log('下一个推荐')
		},

		registerActivity() {
			console.log('报名活动')
			uni.navigateTo({
				url: '/pages/registration/registration'
			})
		},

		viewMoreActivities() {
			console.log('查看更多活动')
			uni.showToast({
				title: '查看更多活动',
				icon: 'none'
			})
		},

		viewActivityDetail(activityId) {
			console.log('查看活动详情:', activityId)
			uni.navigateTo({
				url: `/pages/activity-detail/activity-detail?id=${activityId}`
			})
		},

		}
}
</script>

<style>
/* 基础容器样式 */
.container {
	background-color: #f8fafc;
	min-height: 100vh;
	padding: 0 24rpx 140rpx;
}

/* 轮播样式 - 简约圆润 */
.carousel-section {
	background-color: #ffffff;
	margin-bottom: 6rpx;
	border-radius: 0;
	overflow: hidden;
}

.carousel {
	height: 320rpx;
	border-radius: 0;
}

.carousel-item {
	position: relative;
	height: 100%;
}

.carousel-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.carousel-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.carousel-content {
	text-align: center;
	color: #ffffff;
	padding: 48rpx 32rpx;
}

.carousel-title {
	font-size: 40rpx;
	font-weight: 600;
	margin-bottom: 12rpx;
	display: block;
	letter-spacing: 1rpx;
}

.carousel-subtitle {
	font-size: 28rpx;
	margin-bottom: 32rpx;
	display: block;
	opacity: 0.95;
	line-height: 1.5;
}

.carousel-btn {
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(16rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50rpx;
	padding: 20rpx 48rpx;
	transition: all 0.3s ease;
}

.carousel-btn:active {
	transform: scale(0.95);
	background-color: rgba(255, 255, 255, 0.3);
}

.carousel-btn-text {
	color: #ffffff;
	font-size: 28rpx;
	font-weight: 500;
}

/* 分类导航样式 - 极简圆角 */
.category-section {
	background: linear-gradient(135deg, #68b090, #aaca97);
	margin-bottom: 6rpx;
	padding: 13rpx 32rpx;
	border-radius: 24rpx;
}


.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1f2937;
}

.section-more {
	font-size: 24rpx;
	color: #75b09c;
}

.category-scroll {

	white-space: nowrap;
	padding: 4rpx 0;
}

.category-chip {
	display: inline-flex;
	align-items: center;
	padding: 6rpx 20rpx;
	margin-right: 6rpx;
	background-color: #87b551;
	border: 2rpx solid #70f0f0;
	border-radius: 50rpx;
	transition: all 0.2s ease;
	cursor: pointer;
}

.category-chip:active {
	transform: scale(0.95);
}

.category-chip-active {
	background-color: #75b09c;
	border-color: #75b09c;
}

.category-chip-active .category-label {
	color: #ffffff;
}

.category-emoji {
	margin-right: 8rpx;
	font-size: 20rpx;
}

.category-label {
	font-size: 24rpx;
	font-weight: 500;
	color: #1f2937;
}

/* 推荐部分样式 - 现代简约 */
.featured-section {
	background-color: #ffffff;
	margin-bottom: 6rpx;
	padding: 13rpx 0;
	border-radius: 0;
}

.featured-nav {
	display: flex;
	gap: 12rpx;
}

.featured-nav-floating {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	display: flex;
	gap: 6rpx;
	z-index: 10;
}

.nav-pill {
	width: 40rpx;
	height: 40rpx;
	background-color: #f1f5f9;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	cursor: pointer;
}

.featured-nav-floating .nav-pill {
	width: 32rpx;
	height: 32rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(8rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.nav-pill:active {
	transform: scale(0.9);
	background-color: #e2e8f0;
}

.nav-icon {
	font-size: 16rpx;
	font-weight: 600;
	color: #64748b;
}

.featured-card {
	background: linear-gradient(135deg, #75b09c, #a0ca92);
	padding: 6rpx 32rpx;
	border-radius: 24rpx;
	color: #ffffff;
	position: relative;
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(117, 176, 156, 0.25);
}

.featured-card::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -50%;
	width: 200%;
	height: 200%;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
	animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% { transform: scale(1); opacity: 0.5; }
	50% { transform: scale(1.1); opacity: 0.8; }
}

.featured-content {
	position: relative;
	z-index: 1;
}

.featured-title {
	font-size: 28rpx;
	font-weight: 600;
	margin-bottom: 4rpx;
	display: block;
	letter-spacing: 0.5rpx;
}

.featured-subtitle {
	font-size: 20rpx;
	margin-bottom: 8rpx;
	display: block;
	opacity: 0.95;
	line-height: 1.4;
}

.featured-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.featured-date {
	font-size: 16rpx;
	opacity: 0.9;
}

.featured-btn {
	background-color: #998650;
	backdrop-filter: blur(16rpx);
	border: 2rpx solid #998650;
	border-radius: 40rpx;
	padding: 8rpx 24rpx;
	transition: all 0.2s ease;
}

.featured-btn:active {
	transform: scale(0.95);
	background-color: #7a6a3e;
	border-color: #7a6a3e;
}

.featured-btn-text {
	color: #ffffff;
	font-size: 20rpx;
	font-weight: 500;
}

/* 活动卡片样式 - 简洁圆润 */
.activities-section {
	padding: 0 0 10rpx;
}

.activities-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
}

.activity-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	border: 1rpx solid #f1f5f9;
}

.activity-card:active {
	transform: scale(0.96);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.activity-media {
	position: relative;
	width: 100%;
	aspect-ratio: 16/9;
	overflow: hidden;
}

.activity-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

.activity-card:active .activity-image {
	transform: scale(1.05);
}

.activity-badge {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	padding: 6rpx 12rpx;
	border-radius: 20rpx;
	font-size: 18rpx;
	font-weight: 500;
	backdrop-filter: blur(8rpx);
}

.activity-date-badge {
	position: absolute;
	bottom: 12rpx;
	right: 12rpx;
	background-color: rgba(0, 0, 0, 0.7);
	color: #ffffff;
	padding: 6rpx 12rpx;
	border-radius: 16rpx;
	font-size: 18rpx;
	font-weight: 500;
	backdrop-filter: blur(8rpx);
}

.badge-free {
	background-color: rgba(239, 68, 68, 0.9);
	color: #ffffff;
}

.badge-recommended {
	background-color: rgba(34, 197, 94, 0.9);
	color: #ffffff;
}

.badge-text {
	color: #ffffff;
}

.activity-body {
	padding: 20rpx;
}

.activity-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 12rpx;
	display: block;
	line-height: 1.3;
}

.activity-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.activity-meta {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.activity-date {
	font-size: 20rpx;
	color: #6b7280;
	background-color: #f3f4f6;
	padding: 4rpx 8rpx;
	border-radius: 12rpx;
	white-space: nowrap;
}

.meta-item {
	display: flex;
	align-items: center;
}

.meta-icon {
	margin-right: 8rpx;
	font-size: 18rpx;
}

.meta-text {
	font-size: 20rpx;
	color: #6b7280;
}

</style>
