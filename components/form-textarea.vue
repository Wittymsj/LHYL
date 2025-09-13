<template>
	<view class="form-textarea-wrapper" :class="wrapperClasses">
		<!-- Label -->
		<text v-if="label" class="form-textarea-label" :class="labelClasses">
			{{label}}
			<text v-if="required" class="required-mark">*</text>
		</text>

		<!-- Textarea Container -->
		<view class="form-textarea-container" :class="containerClasses" @click="focusTextarea">
			<!-- Main Textarea -->
			<textarea
				ref="textareaRef"
				:class="textareaClasses"
				:value="modelValue"
				:placeholder="placeholder"
				:disabled="disabled"
				:readonly="readonly"
				:maxlength="maxlength"
				:auto-height="autoHeight"
				:fixed="fixed"
				:show-confirm-bar="showConfirmBar"
				:cursor-spacing="cursorSpacing"
				@input="onInput"
				@focus="onFocus"
				@blur="onBlur"
				@confirm="onConfirm"
				@keyboardheightchange="onKeyboardHeightChange" />

			<!-- Character Count (if shown inside) -->
			<view v-if="showCharCountInside" class="char-count-inside">
				{{currentLength}}<text v-if="maxlength">/{{maxlength}}</text>
			</view>
		</view>

		<!-- Helper Text -->
		<text v-if="helperText" class="helper-text">{{helperText}}</text>

		<!-- Error Message -->
		<text v-if="error" class="error-text">{{error}}</text>

		<!-- Character Count (if shown outside) -->
		<text v-if="showCharCountOutside" class="char-count-outside">
			{{currentLength}}<text v-if="maxlength">/{{maxlength}}</text>
		</text>
	</view>
</template>

<script>
export default {
	name: 'FormTextarea',

	props: {
		// Model value
		modelValue: {
			type: String,
			default: ''
		},

		// Basic props
		label: {
			type: String,
			default: ''
		},

		placeholder: {
			type: String,
			default: ''
		},

		// State props
		disabled: {
			type: Boolean,
			default: false
		},

		readonly: {
			type: Boolean,
			default: false
		},

		required: {
			type: Boolean,
			default: false
		},

		error: {
			type: String,
			default: ''
		},

		// Validation props
		maxlength: {
			type: [Number, String],
			default: -1
		},

		// Textarea specific props
		rows: {
			type: [Number, String],
			default: 3
		},

		autoHeight: {
			type: Boolean,
			default: true
		},

		fixed: {
			type: Boolean,
			default: false
		},

		showConfirmBar: {
			type: Boolean,
			default: true
		},

		cursorSpacing: {
			type: [Number, String],
			default: 0
		},

		// Visual props
		helperText: {
			type: String,
			default: ''
		},

		size: {
			type: String,
			default: 'default',
			validator: (value) => ['small', 'default', 'large'].includes(value)
		},

		variant: {
			type: String,
			default: 'default',
			validator: (value) => ['default', 'filled', 'outlined'].includes(value)
		},

		// Character count position
		charCountPosition: {
			type: String,
			default: 'outside',
			validator: (value) => ['inside', 'outside', 'none'].includes(value)
		}
	},

	data() {
		return {
			isFocused: false,
			currentLength: 0
		}
	},

	computed: {
		wrapperClasses() {
			return {
				'form-textarea-wrapper--disabled': this.disabled,
				'form-textarea-wrapper--readonly': this.readonly,
				'form-textarea-wrapper--error': !!this.error,
				'form-textarea-wrapper--focused': this.isFocused,
				[`form-textarea-wrapper--size-${this.size}`]: this.size
			}
		},

		containerClasses() {
			return {
				'form-textarea-container--disabled': this.disabled,
				'form-textarea-container--readonly': this.readonly,
				'form-textarea-container--error': !!this.error,
				'form-textarea-container--focused': this.isFocused,
				[`form-textarea-container--variant-${this.variant}`]: this.variant,
				[`form-textarea-container--size-${this.size}`]: this.size,
				'form-textarea-container--auto-height': this.autoHeight,
				'form-textarea-container--show-char-count': this.showCharCountInside
			}
		},

		textareaClasses() {
			return {
				'form-textarea--disabled': this.disabled,
				'form-textarea--readonly': this.readonly,
				'form-textarea--error': !!this.error,
				'form-textarea--focused': this.isFocused,
				[`form-textarea--size-${this.size}`]: this.size,
				[`form-textarea--variant-${this.variant}`]: this.variant
			}
		},

		labelClasses() {
			return {
				'form-textarea-label--disabled': this.disabled,
				'form-textarea-label--readonly': this.readonly,
				'form-textarea-label--error': !!this.error,
				'form-textarea-label--focused': this.isFocused,
				[`form-textarea-label--size-${this.size}`]: this.size
			}
		},

		showCharCountInside() {
			return this.charCountPosition === 'inside' && this.maxlength > 0
		},

		showCharCountOutside() {
			return this.charCountPosition === 'outside' && this.maxlength > 0
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			handler(newValue) {
				this.currentLength = String(newValue || '').length
			}
		}
	},

	mounted() {
		// Ensure textarea is properly initialized
		this.$nextTick(() => {
			if (this.$refs.textareaRef) {
				this.setupTextareaEvents()
			}
		})
	},

	methods: {
		// Focus management
		focusTextarea() {
			if (this.disabled || this.readonly) return

			this.$nextTick(() => {
				if (this.$refs.textareaRef) {
					this.$refs.textareaRef.focus()
				}
			})
		},

		blurTextarea() {
			if (this.$refs.textareaRef) {
				this.$refs.textareaRef.blur()
			}
		},

		// Event handlers
		onInput(event) {
			const value = event.detail.value || ''
			this.currentLength = value.length
			this.$emit('update:modelValue', value)
			this.$emit('input', event)
		},

		onFocus(event) {
			this.isFocused = true
			this.$emit('focus', event)

			// Ensure the textarea stays focused
			setTimeout(() => {
				if (this.$refs.textareaRef && !this.$refs.textareaRef.focus) {
					this.$refs.textareaRef.focus()
				}
			}, 100)
		},

		onBlur(event) {
			this.isFocused = false
			this.$emit('blur', event)
			this.$emit('validate') // Trigger validation on blur
		},

		onConfirm(event) {
			this.$emit('confirm', event)
		},

		onKeyboardHeightChange(event) {
			this.$emit('keyboardheightchange', event)
		},

		// Setup events
		setupTextareaEvents() {
			const textarea = this.$refs.textareaRef
			if (!textarea) return

			// Ensure proper event handling
			textarea.addEventListener('click', (e) => {
				e.stopPropagation()
				this.focusTextarea()
			})

			textarea.addEventListener('touchstart', (e) => {
				e.stopPropagation()
				this.focusTextarea()
			})

			// Prevent default focus stealing
			textarea.addEventListener('mousedown', (e) => {
				e.preventDefault()
				e.stopPropagation()
			})
		},

		// Public methods
		select() {
			if (this.$refs.textareaRef) {
				this.$refs.textareaRef.select()
			}
		},

		setSelectionRange(start, end) {
			if (this.$refs.textareaRef) {
				this.$refs.textareaRef.setSelectionRange(start, end)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

// Main wrapper
.form-textarea-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	width: 100%;
	box-sizing: border-box;
}

// Size variants
.form-textarea-wrapper--size-small {
	--textarea-font-size: 24rpx;
	--textarea-padding: 16rpx;
	--textarea-min-height: 96rpx;
	--label-font-size: 24rpx;
}

.form-textarea-wrapper--size-default {
	--textarea-font-size: 28rpx;
	--textarea-padding: 24rpx;
	--textarea-min-height: 120rpx;
	--label-font-size: 28rpx;
}

.form-textarea-wrapper--size-large {
	--textarea-font-size: 32rpx;
	--textarea-padding: 32rpx;
	--textarea-min-height: 144rpx;
	--label-font-size: 32rpx;
}

// Label
.form-textarea-label {
	font-size: var(--label-font-size);
	font-weight: 500;
	color: $uni-text-color;
	transition: color 0.2s ease;
}

.form-textarea-label--focused {
	color: $primary-cambridge-blue;
}

.form-textarea-label--error {
	color: $uni-color-error;
}

.form-textarea-label--disabled {
	color: $uni-text-color-disable;
}

.required-mark {
	color: $uni-color-error;
	margin-left: 4rpx;
}

// Textarea container
.form-textarea-container {
	position: relative;
	display: flex;
	width: 100%;
	min-height: var(--textarea-min-height);
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	background-color: $uni-bg-color;
	transition: all 0.2s ease;
	overflow: hidden;
	box-sizing: border-box;
}

// Variant styles
.form-textarea-container--variant-default {
	border: 2rpx solid $uni-border-color;
	background-color: $uni-bg-color;
}

.form-textarea-container--variant-filled {
	border: 2rpx solid transparent;
	background-color: $uni-bg-color-hover;
}

.form-textarea-container--variant-outlined {
	border: 2rpx solid $uni-border-color;
	background-color: transparent;
}

// State styles
.form-textarea-container--focused {
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1);
}

.form-textarea-container--error {
	border-color: $uni-color-error;
}

.form-textarea-container--error.form-textarea-container--focused {
	box-shadow: 0 0 0 6rpx rgba(221, 82, 77, 0.1);
}

.form-textarea-container--disabled {
	opacity: 0.6;
	pointer-events: none;
	background-color: $uni-bg-color-hover;
}

.form-textarea-container--readonly {
	background-color: $uni-bg-color-hover;
}

// Character count inside
.form-textarea-container--show-char-count {
	padding-bottom: 40rpx;
}

.char-count-inside {
	position: absolute;
	bottom: 8rpx;
	right: 16rpx;
	font-size: 20rpx;
	color: $uni-text-color-grey;
	background-color: rgba(255, 255, 255, 0.9);
	padding: 4rpx 8rpx;
	border-radius: 4rpx;
}

// Textarea element
.form-textarea {
	flex: 1;
	width: 100%;
	min-height: var(--textarea-min-height);
	padding: var(--textarea-padding);
	font-size: var(--textarea-font-size);
	line-height: 1.5;
	color: $uni-text-color;
	background: transparent;
	border: none;
	outline: none;
	resize: vertical;
	transition: all 0.2s ease;
	box-sizing: border-box;
	pointer-events: auto !important;
	position: relative !important;
	z-index: 10 !important;
	-webkit-appearance: none !important;
	-moz-appearance: none !important;
	appearance: none !important;
}

// Auto height
.form-textarea-container--auto-height .form-textarea {
	min-height: var(--textarea-min-height);
	height: auto;
}

// Focus state
.form-textarea--focused {
	outline: none !important;
}

// Helper text
.helper-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
}

// Error text
.error-text {
	font-size: 24rpx;
	color: $uni-color-error;
	margin-top: 4rpx;
}

// Character count outside
.char-count-outside {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
	text-align: right;
}

// Hover effects for non-touch devices
@media (hover: hover) {
	.form-textarea-container:hover:not(.form-textarea-container--disabled):not(.form-textarea-container--readonly) {
		border-color: $primary-cambridge-blue;
	}
}

// Touch optimization
@media (hover: none) {
	.form-textarea-container:active:not(.form-textarea-container--disabled):not(.form-textarea-container--readonly) {
		border-color: $primary-cambridge-blue;
		transform: scale(0.995);
	}
}

// Accessibility improvements
.form-textarea-wrapper:focus-within .form-textarea-label {
	color: $primary-cambridge-blue;
}

// High contrast mode support
@media (prefers-contrast: high) {
	.form-textarea-container {
		border-width: 3rpx;
	}

	.form-textarea-container--focused {
		border-width: 4rpx;
	}
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
	.form-textarea-container,
	.form-textarea {
		transition: none;
	}
}

// Mobile-specific optimizations
@media (max-width: 375px) {
	.form-textarea-wrapper--size-default {
		--textarea-padding: 20rpx;
		--textarea-min-height: 108rpx;
		--textarea-font-size: 26rpx;
	}

	.form-textarea-container--show-char-count {
		padding-bottom: 36rpx;
	}

	.char-count-inside {
		bottom: 6rpx;
		right: 12rpx;
		font-size: 18rpx;
	}
}

// Force textarea to be clickable and focusable
.form-textarea {
	pointer-events: auto !important;
	touch-action: manipulation !important;
	-webkit-user-select: auto !important;
	user-select: auto !important;
	-webkit-touch-callout: default !important;
}

// Override any platform-specific styles
.form-textarea::before,
.form-textarea::after {
	display: none !important;
}

// Ensure proper z-index layering
.form-textarea-wrapper {
	position: relative;
	z-index: 1;
}

.form-textarea-container {
	position: relative;
	z-index: 2;
}

.form-textarea {
	position: relative;
	z-index: 3;
}

// Handle line breaks properly
.form-textarea {
	white-space: pre-wrap;
	word-wrap: break-word;
}
</style>