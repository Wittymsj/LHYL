# 输入框功能测试说明

## 测试目的
验证 `pages/edit-profile/edit-profile.vue` 中的输入框组件是否可以正常点击和输入内容。

## 测试步骤

### 1. 检查控制台输出
- 打开浏览器开发者工具 (F12)
- 切换到 Console 标签
- 尝试点击各个输入框
- 查看是否出现以下调试信息：
  - "输入框获得焦点: [event object]"
  - "输入框输入: [输入的值]"
  - "输入框失去焦点: [event object]"

### 2. 测试具体输入框
依次测试以下输入框：

1. **昵称输入框** (class="nickname-input")
   - 位置：头像下方
   - v-model: formData.nickname

2. **姓名输入框** (class="form-input")
   - 位置：基本信息部分
   - v-model: formData.name
   - 必填字段

3. **联系电话输入框** (class="form-input")
   - 类型：tel
   - v-model: formData.phone
   - 必填字段

4. **微信号输入框** (class="form-input")
   - v-model: formData.wechat

5. **所在城市输入框** (class="form-input")
   - v-model: formData.city

6. **年龄输入框** (class="form-input")
   - 类型：number
   - v-model: formData.age

7. **职业输入框** (class="form-input")
   - v-model: formData.occupation

8. **艺术团名称输入框** (class="art-group-input")
   - 动态生成
   - v-model: formData.artGroups[index].name

## 预期结果

### 成功指标
- 点击输入框时显示焦点状态（边框颜色变化）
- 可以通过键盘输入文字
- 输入的值正确绑定到对应的 data 属性
- 控制台显示相应的调试信息

### 常见问题排查

1. **无法点击输入框**
   - 检查 CSS 中是否有 `pointer-events: none`
   - 检查是否有其他元素覆盖
   - 检查 z-index 设置

2. **可以点击但无法输入**
   - 检查 input 元素的 type 属性
   - 检查是否有 JavaScript 阻止默认行为
   - 检查 v-model 绑定是否正确

3. **输入后值不更新**
   - 检查 formData 对象结构
   - 检查数据绑定语法

## 调试技巧

### 1. 检查元素样式
在浏览器开发者工具中：
1. 右键点击输入框 → "检查元素"
2. 查看 Computed 标签中的样式
3. 特别关注：
   - pointer-events
   - z-index
   - position
   - opacity

### 2. 监控事件
使用以下代码监控所有事件：
```javascript
// 在控制台中执行
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('click', (e) => console.log('click:', e));
  input.addEventListener('focus', (e) => console.log('focus:', e));
  input.addEventListener('input', (e) => console.log('input:', e));
  input.addEventListener('blur', (e) => console.log('blur:', e));
});
```

### 3. 检查数据绑定
在控制台中检查 Vue 实例：
```javascript
// 检查组件实例
const vm = document.querySelector('#app').__vue__.$children.find(child =>
  child.$el.querySelector('.form-input')
);
console.log('组件实例:', vm);
console.log('formData:', vm.formData);
```

## 已实施的修复措施

1. **CSS 样式优化**
   - 所有输入框添加 `!important` 声明确保样式优先级
   - 设置 `pointer-events: auto !important` 确保可交互
   - 设置适当的 z-index 层级

2. **全局样式重置**
   - 在 App.vue 中添加全局 input 元素重置样式
   - 确保所有平台的一致性

3. **调试功能**
   - 添加事件监听器用于调试
   - 在控制台输出事件信息

## 联系信息
如果问题仍然存在，请提供：
1. 具体的错误信息
2. 浏览器控制台的完整输出
3. 测试环境和设备信息