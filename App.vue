<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */

	/* 全局输入框重置样式 - 增强版 */
	input, textarea {
		pointer-events: auto !important;
		position: relative !important;
		z-index: 100 !important;
		-webkit-appearance: none !important;
		-moz-appearance: none !important;
		appearance: none !important;
		-webkit-user-select: auto !important;
		user-select: auto !important;
		-webkit-touch-callout: default !important;
		touch-action: manipulation !important;
	}

	input:focus, textarea:focus {
		outline: none !important;
	}

	input:disabled, textarea:disabled {
		pointer-events: none !important;
		opacity: 0.6 !important;
	}

	input[readonly], textarea[readonly] {
		pointer-events: none !important;
	}

	/* 确保所有可交互元素都能正常工作 */
	view, button, picker {
		pointer-events: auto !important;
	}

	/* 防止事件冒泡影响输入框 */
	.form-input-wrapper, .form-textarea-wrapper {
		pointer-events: auto !important;
	}

	/* 修复z-index层级问题 */
	.form-input-container, .form-textarea-container {
		position: relative !important;
		z-index: 50 !important;
	}

	.form-input, .form-textarea {
		position: relative !important;
		z-index: 100 !important;
	}

	/* 移动端特殊处理 - 但允许页面级覆盖 */
	@media (max-width: 768px) {
		input, textarea {
			font-size: 16px !important; /* 防止iOS缩放 */
		}

		/* 确保足够的点击区域，但不强制最小高度 */
		input:not(.form-input), textarea:not(.form-textarea) {
			min-height: 44px !important;
		}
	}
</style>
