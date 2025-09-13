<template>
	<view class="form-input-wrapper" :class="wrapperClasses">
		<!-- Label -->
		<text v-if="label" class="form-input-label" :class="labelClasses">
			{{label}}
			<text v-if="required" class="required-mark">*</text>
		</text>

		<!-- Input Container -->
		<view class="form-input-container" :class="containerClasses" @click="focusInput">
			<!-- Prefix Icon/Symbol -->
			<view v-if="prefix" class="input-prefix">
				<text class="prefix-text">{{prefix}}</text>
			</view>

			<!-- Main Input -->
			<input
				ref="inputRef"
				:class="inputClasses"
				:type="type"
				:value="modelValue"
				:placeholder="placeholder"
				:disabled="disabled"
				:readonly="readonly"
				:maxlength="maxlength"
				:min="min"
				:max="max"
				:step="step"
				@input="onInput"
				@focus="onFocus"
				@blur="onBlur"
				@confirm="onConfirm"
				@keyboardheightchange="onKeyboardHeightChange" />

			<!-- Clear Button -->
			<view
				v-if="showClear"
				class="input-clear"
				@click.stop="clearValue">
				<text class="clear-icon">✕</text>
			</view>

			<!-- Suffix Icon/Symbol -->
			<view v-if="suffix" class="input-suffix">
				<text class="suffix-text">{{suffix}}</text>
			</view>
		</view>

		<!-- Helper Text -->
		<text v-if="helperText" class="helper-text">{{helperText}}</text>

		<!-- Error Message -->
		<text v-if="error" class="error-text">{{error}}</text>

		<!-- Character Count -->
		<text v-if="showCharCount" class="char-count-text">
			{{currentLength}}<text v-if="maxlength">/{{maxlength}}</text>
		</text>
	</view>
</template>

<script>
export default {
	name: 'FormInput',

	props: {
		// Model value
		modelValue: {
			type: [String, Number],
			default: ''
		},

		// Basic props
		type: {
			type: String,
			default: 'text',
			validator: (value) => [
				'text', 'number', 'digit', 'idcard', 'password', 'tel', 'email'
			].includes(value)
		},

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

		min: {
			type: [Number, String],
			default: null
		},

		max: {
			type: [Number, String],
			default: null
		},

		step: {
			type: [Number, String],
			default: null
		},

		// Visual props
		prefix: {
			type: String,
			default: ''
		},

		suffix: {
			type: String,
			default: ''
		},

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
		}
	},

	data() {
		return {
			isFocused: false,
			isHovered: false,
			currentLength: 0
		}
	},

	computed: {
		wrapperClasses() {
			return {
				'form-input-wrapper--disabled': this.disabled,
				'form-input-wrapper--readonly': this.readonly,
				'form-input-wrapper--error': !!this.error,
				'form-input-wrapper--focused': this.isFocused,
				[`form-input-wrapper--size-${this.size}`]: this.size
			}
		},

		containerClasses() {
			return {
				'form-input-container--disabled': this.disabled,
				'form-input-container--readonly': this.readonly,
				'form-input-container--error': !!this.error,
				'form-input-container--focused': this.isFocused,
				'form-input-container--has-prefix': !!this.prefix,
				'form-input-container--has-suffix': !!this.suffix || this.showClear,
				[`form-input-container--variant-${this.variant}`]: this.variant,
				[`form-input-container--size-${this.size}`]: this.size
			}
		},

		inputClasses() {
			return {
				'form-input--disabled': this.disabled,
				'form-input--readonly': this.readonly,
				'form-input--error': !!this.error,
				'form-input--focused': this.isFocused,
				[`form-input--type-${this.type}`]: this.type,
				[`form-input--size-${this.size}`]: this.size,
				[`form-input--variant-${this.variant}`]: this.variant
			}
		},

		labelClasses() {
			return {
				'form-input-label--disabled': this.disabled,
				'form-input-label--readonly': this.readonly,
				'form-input-label--error': !!this.error,
				'form-input-label--focused': this.isFocused,
				[`form-input-label--size-${this.size}`]: this.size
			}
		},

		showClear() {
			return !this.disabled && !this.readonly && this.modelValue && (this.type === 'text' || this.type === 'email' || this.type === 'tel')
		},

		showCharCount() {
			return this.maxlength > 0
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
		// Ensure input is properly initialized
		this.$nextTick(() => {
			if (this.$refs.inputRef) {
				this.setupInputEvents()
			}
		})
	},

	methods: {
		// Focus management
		focusInput() {
			if (this.disabled || this.readonly) return

			this.$nextTick(() => {
				if (this.$refs.inputRef) {
					// Force focus using native methods
					this.$refs.inputRef.focus()
				}
			})
		},

		blurInput() {
			if (this.$refs.inputRef) {
				this.$refs.inputRef.blur()
			}
		},

		// Event handlers
		onInput(event) {
			const value = event.detail.value || ''
			this.currentLength = value.length

			// Handle numeric inputs
			let processedValue = value
			if (this.type === 'number' || this.type === 'digit') {
				processedValue = value.replace(/[^\d.-]/g, '')
			}

			this.$emit('update:modelValue', processedValue)
			this.$emit('input', event)
		},

		onFocus(event) {
			this.isFocused = true
			this.$emit('focus', event)

			// Ensure the input stays focused
			setTimeout(() => {
				if (this.$refs.inputRef && !this.$refs.inputRef.focus) {
					this.$refs.inputRef.focus()
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

		// Utility methods
		clearValue() {
			this.$emit('update:modelValue', '')
			this.$emit('clear')
			this.focusInput() // Refocus after clearing
		},

		setupInputEvents() {
			const input = this.$refs.inputRef
			if (!input) return

			// Ensure proper event handling
			input.addEventListener('click', (e) => {
				e.stopPropagation()
				this.focusInput()
			})

			input.addEventListener('touchstart', (e) => {
				e.stopPropagation()
				this.focusInput()
			})

			// Prevent default focus stealing
			input.addEventListener('mousedown', (e) => {
				e.preventDefault()
				e.stopPropagation()
			})
		},

		// Public methods for parent components
		select() {
			if (this.$refs.inputRef) {
				this.$refs.inputRef.select()
			}
		},

		setSelectionRange(start, end) {
			if (this.$refs.inputRef) {
				this.$refs.inputRef.setSelectionRange(start, end)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

// Main wrapper
.form-input-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	width: 100%;
	box-sizing: border-box;
}

// Size variants
.form-input-wrapper--size-small {
	--input-font-size: 24rpx;
	--input-padding: 16rpx;
	--input-height: 64rpx;
	--label-font-size: 24rpx;
}

.form-input-wrapper--size-default {
	--input-font-size: 28rpx;
	--input-padding: 24rpx;
	--input-height: 80rpx;
	--label-font-size: 28rpx;
}

.form-input-wrapper--size-large {
	--input-font-size: 32rpx;
	--input-padding: 32rpx;
	--input-height: 96rpx;
	--label-font-size: 32rpx;
}

// Label
.form-input-label {
	font-size: var(--label-font-size);
	font-weight: 500;
	color: $uni-text-color;
	transition: color 0.2s ease;
}

.form-input-label--focused {
	color: $primary-cambridge-blue;
}

.form-input-label--error {
	color: $uni-color-error;
}

.form-input-label--disabled {
	color: $uni-text-color-disable;
}

.required-mark {
	color: $uni-color-error;
	margin-left: 4rpx;
}

// Input container
.form-input-container {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: var(--input-height);
	border: 2rpx solid $uni-border-color;
	border-radius: $uni-border-radius-base;
	background-color: $uni-bg-color;
	transition: all 0.2s ease;
	overflow: hidden;
	box-sizing: border-box;
}

// Variant styles
.form-input-container--variant-default {
	border: 2rpx solid $uni-border-color;
	background-color: $uni-bg-color;
}

.form-input-container--variant-filled {
	border: 2rpx solid transparent;
	background-color: $uni-bg-color-hover;
}

.form-input-container--variant-outlined {
	border: 2rpx solid $uni-border-color;
	background-color: transparent;
}

// State styles
.form-input-container--focused {
	border-color: $primary-cambridge-blue;
	box-shadow: 0 0 0 6rpx rgba(117, 176, 156, 0.1);
}

.form-input-container--error {
	border-color: $uni-color-error;
}

.form-input-container--error.form-input-container--focused {
	box-shadow: 0 0 0 6rpx rgba(221, 82, 77, 0.1);
}

.form-input-container--disabled {
	opacity: 0.6;
	pointer-events: none;
	background-color: $uni-bg-color-hover;
}

.form-input-container--readonly {
	background-color: $uni-bg-color-hover;
}

// With prefix/suffix
.form-input-container--has-prefix {
	padding-left: 0;
}

.form-input-container--has-suffix {
	padding-right: 0;
}

// Input element
.form-input {
	flex: 1;
	width: 100%;
	height: 100%;
	padding: var(--input-padding);
	font-size: var(--input-font-size);
	color: $uni-text-color;
	background: transparent;
	border: none;
	outline: none;
	transition: all 0.2s ease;
	box-sizing: border-box;
	pointer-events: auto !important;
	position: relative !important;
	z-index: 10 !important;
	-webkit-appearance: none !important;
	-moz-appearance: none !important;
	appearance: none !important;
}

// Force focus state
.form-input--focused {
	outline: none !important;
}

// Type-specific styles
.form-input--type-password {
	font-family: monospace;
	letter-spacing: 2rpx;
}

.form-input--type-number,
.form-input--type-digit {
	text-align: left;
}

// Prefix and suffix
.input-prefix,
.input-suffix {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 16rpx;
	height: 100%;
	min-width: 60rpx;
	flex-shrink: 0;
}

.prefix-text,
.suffix-text {
	font-size: var(--input-font-size);
	color: $uni-text-color-grey;
}

// Clear button
.input-clear {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32rpx;
	height: 32rpx;
	margin-right: 12rpx;
	border-radius: 50%;
	background-color: $uni-text-color-grey;
	opacity: 0.6;
	transition: all 0.2s ease;
	cursor: pointer;
	flex-shrink: 0;
}

.input-clear:hover {
	opacity: 1;
	background-color: $uni-text-color;
}

.clear-icon {
	color: $uni-text-color-inverse;
	font-size: 20rpx;
	line-height: 1;
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

// Character count
.char-count-text {
	font-size: 24rpx;
	color: $uni-text-color-grey;
	margin-top: 4rpx;
	text-align: right;
}

// Hover effects for non-touch devices
@media (hover: hover) {
	.form-input-container:hover:not(.form-input-container--disabled):not(.form-input-container--readonly) {
		border-color: $primary-cambridge-blue;
	}
}

// Touch optimization
@media (hover: none) {
	.form-input-container:active:not(.form-input-container--disabled):not(.form-input-container--readonly) {
		border-color: $primary-cambridge-blue;
		transform: scale(0.995);
	}

	.input-clear:active {
		transform: scale(0.9);
	}
}

// Accessibility improvements
.form-input-wrapper:focus-within .form-input-label {
	color: $primary-cambridge-blue;
}

// High contrast mode support
@media (prefers-contrast: high) {
	.form-input-container {
		border-width: 3rpx;
	}

	.form-input-container--focused {
		border-width: 4rpx;
	}
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
	.form-input-container,
	.form-input,
	.input-clear {
		transition: none;
	}
}

// Mobile-specific optimizations
@media (max-width: 375px) {
	.form-input-wrapper--size-default {
		--input-padding: 20rpx;
		--input-height: 72rpx;
		--input-font-size: 26rpx;
	}

	.input-prefix,
	.input-suffix {
		padding: 0 12rpx;
		min-width: 48rpx;
	}
}

// Force input to be clickable and focusable
.form-input {
	pointer-events: auto !important;
	touch-action: manipulation !important;
	-webkit-user-select: auto !important;
	user-select: auto !important;
	-webkit-touch-callout: default !important;
}

// Override any platform-specific styles
.form-input::before,
.form-input::after {
	display: none !important;
}

// Ensure proper z-index layering
.form-input-wrapper {
	position: relative;
	z-index: 1;
}

.form-input-container {
	position: relative;
	z-index: 2;
}

.form-input {
	position: relative;
	z-index: 3;
}
</style>