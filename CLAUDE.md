# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **uni-app** project for a **Senior Activity Platform (老年活动平台)** - a cross-platform framework for developing applications that can run on multiple platforms (iOS, Android, Web, and various mini-programs) using a single codebase based on Vue.js.

## Application Architecture

### Core Pages Structure
根据 `pages.json` 配置，应用包含12个主要页面：

**主要导航页面**：
- **Home Page** (`pages/index/index.vue`): 活动发现首页，包含轮播图、分类导航、推荐活动和活动网格
- **Profile Page** (`pages/profile/profile.vue`): 个人中心页面，包含用户统计、快捷操作、活动历史和设置

**功能页面**：
- **Information Editing** (`pages/edit-profile/edit-profile.vue`): 个人信息编辑，支持头像上传、表单验证和艺术团体经验管理
- **Activity Publishing** (`pages/create-activity/create-activity.vue`): 活动发布页面，具有智能导航、卡片布局和富文本编辑功能
- **Activity Detail** (`pages/activity-detail/activity-detail.vue`): 活动详情页面
- **Registration** (`pages/registration/registration.vue`): 活动报名页面
- **Settings** (`pages/settings/settings.vue`): 设置页面（自定义导航栏）
- **User Auth** (`pages/user-auth/user-auth.vue`): 用户认证页面（自定义导航栏）
- **Organizer Auth** (`pages/organizer-auth/organizer-auth.vue`): 主办方认证页面（自定义导航栏）

**管理页面**：
- **Activity Review** (`pages/activity-review/activity-review.vue`): 活动审核页面
- **Carousel Admin** (`pages/carousel-admin/carousel-admin.vue`): 轮播图管理页面
- **Webview** (`pages/webview/webview.vue`): 网页浏览页面

### Navigation System
- **Tab Bar**: Bottom navigation with Home and Profile tabs
- **Page Navigation**: Profile page links to edit page via user info/avatar clicks
- **Global Navigation**: Consistent Cambridge blue theme across all navigation bars

### Data Management
- **Local Storage**: User profile data persisted using `uni.setStorageSync()` and `uni.getStorageSync()`
- **Form Validation**: Client-side validation for required fields (name, phone, nickname)
- **Dynamic Components**: Art group experiences managed with add/remove functionality
- **Draft Management**: Auto-save functionality for activity publishing with real-time validation
- **Smart Navigation**: Progress-based navigation system with scroll-aware indicators
- **Activity History**: Complete activity history management with search and filtering capabilities

## Development Environment

- **Framework**: uni-app with Vue.js (dual Vue 2/3 compatibility)
- **Entry Point**: `main.js` - Uses conditional compilation for Vue 2/3 support
- **Main App**: `App.vue` - Application lifecycle management with global input styling
- **Router**: `pages.json` - Page routing and navigation configuration
- **Styling**: SCSS preprocessing with elderly-friendly Cambridge blue theme
- **Vue Version**: Configured for Vue 3 in `manifest.json` but maintains backward compatibility

## Key Configuration Files

### manifest.json
- Platform-specific configurations for iOS, Android, WeChat Mini Program
- App permissions and SDK configurations
- Version information and app metadata

### pages.json
- Page routing structure with 12 pages across navigation, functional, and admin categories
- Global navigation bar styles (Cambridge blue theme #75b09c)
- Tab bar configuration with Home and Profile tabs
- Launch page configuration (index page first)
- Individual page style configurations with platform-specific settings
- Missing tabbar icons: home.png, home-active.png, profile.png, profile-active.png

### uni.scss
- Senior Activity Platform theme variables
- Cambridge blue color palette ($primary-cambridge-blue, $primary-pistachio, $primary-old-gold)
- Elderly-friendly typography and spacing variables
- Gradient definitions and animation timing

## Styling System

### Design Principles
- **Minimalist and Rounded**: Clean interface with rounded corners (20rpx-50rpx radius)
- **Elderly-Friendly**: Larger fonts, high contrast, generous spacing
- **Consistent Spacing**: 24rpx base spacing system with 16rpx for small screens
- **Responsive Design**: Uses rpx units for cross-platform consistency

### Color Scheme
- **Primary**: Cambridge blue (#75b09c) and pistachio (#a0ca92)
- **Accent**: Old gold (#998650) and mindaro (#d8f793)
- **Status Colors**: Green for success, amber for warnings, blue for info
- **Backgrounds**: Light gray (#f8fafc) with white content areas

### Component Patterns
- **Cards**: White backgrounds with subtle shadows, 20rpx border radius
- **Buttons**: Gradient backgrounds with scale animations on active state
- **Inputs**: Advanced form components with validation, multiple variants (default, filled, outlined)
- **Images**: Aspect ratio containers with object-fit cover
- **Smart Navigation**: Progress indicators with step-by-step guidance
- **Rich Text**: Enhanced text editing with character counting and mobile optimization
- **Tag Systems**: Flexible selection with emoji icons and preview displays
- **History Selector**: Dropdown components with search functionality and form filling

## Platform Compatibility

Uses conditional compilation blocks:
- `// #ifndef VUE3` - Vue 2 specific code
- `// #ifdef VUE3` - Vue 3 specific code
- `// #endif` - End conditional compilation block

## Common Development Tasks

### Adding New Pages
1. Create page directory under `pages/`
2. Add page configuration to `pages.json`
3. Update navigation structure if needed
4. Follow existing component structure and styling patterns

### Styling Components
1. Use existing SCSS variables from `uni.scss`
2. Maintain consistent spacing (24rpx base, 16rpx small screens)
3. Apply rounded corners consistently (16rpx-50rpx)
4. Include responsive design with `@media (max-width: 375px)` queries

### Form Handling
1. Use `v-model` for two-way data binding
2. Implement validation on blur events
3. Show error messages with conditional rendering
4. Persist data using local storage methods
5. Use dedicated component classes to avoid CSS conflicts (e.g., `.history-search-input` instead of generic `.search-input`)

## Build and Development Commands

**重要提示**: 此 uni-app 项目需要 HBuilderX IDE 进行开发和构建，无传统的 package.json 脚本。

### HBuilderX 开发工作流

**开发环境设置**：
1. 打开 HBuilderX IDE
2. 文件 → 打开目录 → 选择项目根目录
3. 项目将自动识别为 uni-app 项目

**开发和调试**：
- **浏览器预览**: 运行 → 运行到浏览器 → Chrome
- **手机模拟器**: 运行 → 运行到手机或模拟器 → 选择设备
- **微信开发者工具**: 运行 → 运行到小程序模拟器 → 微信开发者工具

**构建和发布**：
- **Web构建**: 发行 → 网站H5手机版
- **安卓App**: 发行 → 原生App-云打包
- **iOSApp**: 发行 → 原生App-云打包
- **微信小程序**: 发行 → 小程序-微信
- **其他平台**: 发行 → 选择目标平台（支付宝、百度、字节跳动等）

### 开发注意事项

**跨平台测试**：
- 由于 uni-app 编译差异，需要在每个目标平台上进行手动测试
- 每个平台可能有不同的 API 限制和样式表现
- 建议在开发过程中定期在目标平台上测试

**调试技巧**：
- 使用 `console.log()` 进行调试
- HBuilderX 提供内置的调试器和控制台
- 浏览器开发者工具可用于 Web 版本调试
- 真机调试推荐使用 USB 连接调试
- 输入框调试参考 `App.vue` 中的全局样式和 Known Issues 部分

## File Structure

基于 `pages.json` 的实际项目结构：

```
fronted/
├── pages/                          # 页面文件目录
│   ├── index/
│   │   └── index.vue              # 活动发现首页
│   ├── profile/
│   │   └── profile.vue            # 个人中心页面
│   ├── edit-profile/
│   │   └── edit-profile.vue       # 个人信息编辑页面
│   ├── create-activity/
│   │   └── create-activity.vue    # 活动发布页面
│   ├── activity-detail/
│   │   └── activity-detail.vue    # 活动详情页面
│   ├── registration/
│   │   └── registration.vue       # 活动报名页面
│   ├── settings/
│   │   └── settings.vue           # 设置页面
│   ├── user-auth/
│   │   └── user-auth.vue          # 用户认证页面
│   ├── organizer-auth/
│   │   └── organizer-auth.vue     # 主办方认证页面
│   ├── activity-review/
│   │   └── activity-review.vue    # 活动审核页面
│   ├── carousel-admin/
│   │   └── carousel-admin.vue     # 轮播图管理页面
│   └── webview/
│       └── webview.vue            # 网页浏览页面
├── components/                     # 可复用组件
│   ├── form-input.vue             # 高级输入框组件
│   └── form-textarea.vue          # 高级文本域组件
├── static/                         # 静态资源
│   ├── logo.png                    # 应用Logo
│   └── tabbar/
│       └── README.md               # Tabbar图标要求文档
├── App.vue                         # 根应用组件（包含全局输入样式重置）
├── main.js                         # 应用入口点（Vue 2/3兼容）
├── manifest.json                   # 平台配置文件（Vue 3配置）
├── pages.json                      # 页面路由和导航配置
├── uni.scss                        # 全局SCSS变量和主题
├── test-*.html                     # 功能测试页面
└── index.html                      # Web平台模板
```

**关键配置文件说明**：
- `manifest.json`: 包含所有平台（iOS、Android、小程序）的配置和权限设置，Vue 3配置
- `pages.json`: 定义12个页面的路由、导航栏样式和tabbar配置，剑桥蓝主题
- `App.vue`: 包含重要的全局输入框样式重置，解决跨平台兼容性问题
- `uni.scss`: 老年活动平台主题变量和设计系统定义
- `components/`: 可复用的高级表单组件，支持多种状态和验证

## Known Issues and Dependencies

### Missing Tabbar Icons
应用引用了不存在的 tabbar 图标文件：
- `static/tabbar/home.png` 和 `static/tabbar/home-active.png`
- `static/tabbar/profile.png` 和 `static/tabbar/profile-active.png`

图标要求：48x48像素 PNG 格式，透明背景。详见 `static/tabbar/README.md`。

### Input Field Debugging
全局输入框重置样式在 `App.vue` 中定义，确保跨平台行为一致。调试输入框问题（点击性、内容输入）时：

1. 检查 CSS `pointer-events` 和 `z-index` 属性
2. 避免使用通用类名（如 `.search-input`），使用组件特定类名（如 `.history-search-input`）
3. 确保正确的文本显示设置：`white-space: pre`, `overflow: visible`, `text-overflow: clip`
4. 验证事件处理器正确附加
5. 使用浏览器开发者工具测试元素交互
6. 参考 `App.vue` 中的全局样式覆盖规则和 `components/form-input.vue` 的高级实现

### Build Tools Limitations
无 package.json 或传统构建工具 - uni-app 需要 HBuilderX IDE 进行：
- 开发和调试
- 平台特定构建
- 跨平台编译
- 模拟器/模拟器测试

### Platform Compatibility
使用条件编译块：
- `// #ifndef VUE3` - Vue 2 特定代码
- `// #ifdef VUE3` - Vue 3 特定代码
- `// #endif` - 结束条件编译块

配置为 Vue 3 (`manifest.json` 第71行) 但保持向后兼容。

## Mobile Optimization Features

### Smart Navigation System
The activity publishing page includes an advanced navigation system with:
- **Progress Indicators**: Visual progress bars showing completion status
- **Step Navigation**: Clickable step indicators for direct section access
- **Scroll Awareness**: Automatic progress updates based on scroll position
- **Touch Optimization**: Mobile-friendly touch targets and gestures

### Card-Based Layout Design
Modern shadcn-inspired component patterns:
- **Modular Sections**: Content organized in distinct card components
- **Visual Hierarchy**: Clear separation between different form sections
- **Responsive Layout**: Adaptive layouts for different screen sizes
- **Consistent Styling**: Unified design language across all components

### Enhanced Form Experience
- **Real-time Validation**: Immediate feedback on form inputs
- **Draft Management**: Auto-save functionality with change detection
- **Rich Text Editing**: Character counting and formatting support
- **Mobile-First Design**: Touch-optimized controls and keyboard handling
- **History Integration**: Activity history selector with search and form filling capabilities

## Component Architecture

### Reusable Components
- **FormInput** (`components/form-input.vue`): Advanced input component with multiple variants, validation states, and accessibility features
  - Supports text, number, email, password, tel, idcard, digit types
  - Three size variants: small, default, large
  - Three style variants: default, filled, outlined
  - Built-in validation, character counting, and clear functionality
  - Comprehensive mobile optimization and accessibility support

### Key Implementation Patterns
- **CSS Specificity**: Use component-specific class names to avoid style conflicts
- **Event Handling**: Proper event propagation and focus management
- **State Management**: Reactive validation and error states
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Mobile Optimization**: Touch targets, keyboard handling, and platform-specific fixes