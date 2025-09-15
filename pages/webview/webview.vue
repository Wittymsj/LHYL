<template>
	<view class="webview-container">
		<!-- web-view组件用于加载外部网页 -->
		<web-view :src="webUrl" @message="handleMessage" @load="handleLoad" @error="handleError"></web-view>

		<!-- 加载状态指示器 -->
		<view class="loading-overlay" v-if="isLoading">
			<view class="loading-content">
				<text class="loading-icon">⏳</text>
				<text class="loading-text">正在加载网页...</text>
			</view>
		</view>

		<!-- 错误提示 -->
		<view class="error-overlay" v-if="showError">
			<view class="error-content">
				<text class="error-icon">❌</text>
				<text class="error-title">加载失败</text>
				<text class="error-message">{{errorMessage}}</text>
				<view class="error-actions">
					<button class="retry-btn" @click="retryLoad">重新加载</button>
					<button class="back-btn" @click="goBack">返回</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webUrl: '', // 要加载的网页URL
				isLoading: true, // 加载状态
				showError: false, // 错误状态
				errorMessage: '', // 错误信息
				loadTimeout: null // 加载超时定时器
			}
		},

		onLoad(options) {
			// 从页面参数中获取URL
			if (options.url) {
				this.webUrl = decodeURIComponent(options.url)
				console.log('WebView加载URL:', this.webUrl)
			} else {
				this.showError = true
				this.errorMessage = '未提供有效的网页地址'
				this.isLoading = false
			}

			// 设置加载超时（15秒）
			this.loadTimeout = setTimeout(() => {
				if (this.isLoading) {
					this.isLoading = false
					this.showError = true
					this.errorMessage = '网页加载超时，请检查网络连接'
				}
			}, 15000)
		},

		onUnload() {
			// 清理定时器
			if (this.loadTimeout) {
				clearTimeout(this.loadTimeout)
			}
		},

		methods: {
			// 处理网页加载完成
			handleLoad(event) {
				console.log('网页加载完成', event)
				this.isLoading = false
				this.showError = false

				// 清理超时定时器
				if (this.loadTimeout) {
					clearTimeout(this.loadTimeout)
					this.loadTimeout = null
				}
			},

			// 处理加载错误
			handleError(event) {
				console.error('网页加载错误', event)
				this.isLoading = false
				this.showError = true

				// 根据错误类型显示不同的错误信息
				if (event.detail && event.detail.message) {
					this.errorMessage = event.detail.message
				} else {
					this.errorMessage = '网页加载失败，请检查网络连接或链接是否有效'
				}

				// 清理超时定时器
				if (this.loadTimeout) {
					clearTimeout(this.loadTimeout)
					this.loadTimeout = null
				}
			},

			// 处理来自网页的消息
			handleMessage(event) {
				console.log('收到来自网页的消息', event)
				// 可以在这里处理网页发送过来的消息
			},

			// 重新加载
			retryLoad() {
				this.showError = false
				this.isLoading = true

				// 重新设置加载超时
				this.loadTimeout = setTimeout(() => {
					if (this.isLoading) {
						this.isLoading = false
						this.showError = true
						this.errorMessage = '网页加载超时，请检查网络连接'
					}
				}, 15000)
			},

			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.webview-container {
	width: 100%;
	height: 100vh;
	position: relative;
	background-color: $uni-bg-color;
}

// web-view组件样式
web-view {
	width: 100%;
	height: 100%;
}

// 加载状态遮罩
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx;
	background-color: $uni-bg-color;
	border-radius: 20rpx;
	box-shadow: $shadow-lg;
}

.loading-icon {
	font-size: 60rpx;
	margin-bottom: 20rpx;
	animation: spin 2s linear infinite;
}

.loading-text {
	font-size: $uni-font-size-lg;
	color: $uni-text-color;
	font-weight: 500;
}

// 错误提示遮罩
.error-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.error-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx;
	background-color: $uni-bg-color;
	border-radius: 20rpx;
	box-shadow: $shadow-lg;
	max-width: 600rpx;
	width: 90%;
}

.error-icon {
	font-size: 60rpx;
	margin-bottom: 20rpx;
}

.error-title {
	font-size: $uni-font-size-xl;
	color: $uni-text-color;
	font-weight: 600;
	margin-bottom: 16rpx;
}

.error-message {
	font-size: $uni-font-size-base;
	color: $uni-text-color-grey;
	text-align: center;
	line-height: 1.5;
	margin-bottom: 40rpx;
}

.error-actions {
	display: flex;
	gap: 20rpx;
}

.retry-btn, .back-btn {
	padding: 20rpx 40rpx;
	border-radius: 12rpx;
	font-size: $uni-font-size-base;
	font-weight: 500;
	border: none;
	min-width: 160rpx;
}

.retry-btn {
	background-color: $primary-cambridge-blue;
	color: #ffffff;
}

.back-btn {
	background-color: $uni-bg-color-grey;
	color: $uni-text-color;
	border: 1rpx solid $uni-border-color;
}

// 按钮点击效果
.retry-btn:active, .back-btn:active {
	transform: scale(0.95);
	opacity: 0.8;
}

// 加载动画
@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

// 移动端优化
@media (max-width: 375px) {
	.loading-content, .error-content {
		padding: 40rpx;
		margin: 40rpx;
	}

	.error-title {
		font-size: $uni-font-size-lg;
	}

	.loading-text, .error-message {
		font-size: $uni-font-size-sm;
	}

	.retry-btn, .back-btn {
		padding: 16rpx 32rpx;
		font-size: $uni-font-size-sm;
		min-width: 140rpx;
	}
}

// 大字体模式适配
.webview-container.large-font {
	.loading-text, .error-message {
		font-size: $uni-font-size-lg;
	}

	.error-title {
		font-size: $uni-font-size-xl;
	}

	.retry-btn, .back-btn {
		font-size: $uni-font-size-lg;
		padding: 24rpx 48rpx;
		min-width: 180rpx;
	}
}
</style>