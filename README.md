# 🐂 黄牛记账 (Yellow Cattle Bookkeeping)

一个简洁优雅的纯前端记账工具，支持语音输入、AI 智能解析，并融入佛教财富观提供有温度的生活开支分析。

![版本](https://img.shields.io/badge/version-1.0.0-green)
![技术栈](https://img.shields.io/badge/tech-HTML/CSS/JS-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ 功能特性

### 📊 核心记账功能
- **5 大核心字段**：类型（收入/支出）、名称、金额、时间、标签
- **月度视图**：快速切换月份，查看收支汇总
- **分类标签**：预设 14 个支出标签、8 个收入标签，覆盖日常消费场景
- **本地存储**：基于 localStorage，数据完全存储在浏览器本地

### 🎙 语音记账
- **Web Speech API**：支持中文语音识别，说话即可录入
- **智能解析**：语音转文字后，自动提取金额、类型、标签等字段
- **降级方案**：无 API Key 时使用内置正则解析，离线也可用

### ✦ AI 智能增强
- **DeepSeek API 集成**：配置 API Key 后，调用 DeepSeek 大模型进行高精度字段提取
- **智能分析**：选择时间段，AI 结合佛教财富观分析收支情况
- **安全存储**：API Key 仅保存在浏览器本地，不随代码泄露

### 🏯 佛教财富观分析（特色功能）
AI 分析融入佛教财富观视角，包括：
- **正命角度**：收入来源是否清净正当
- **知足少欲角度**：消费是否过度追求物质
- **中道角度**：是否走在中道上
- **布施角度**：是否有公益慈善支出
- **五家共有角度**：引导不把财富当永恒安全感来源

分析语气平和温暖，像一位有智慧的朋友在分享，不批判、不说教。

### 🎨 Apple 风格 UI
- 遵循 **iOS Human Interface Guidelines** 设计规范
- 毛玻璃效果（frosted glass）导航栏
- 底部抽屉式交互（bottom sheet）
- 系统级设计语言：圆角、阴影、字体、配色均参考 iOS

---

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| **HTML5** | 语义化结构 |
| **CSS3** | Apple Design Tokens（CSS 变量）、毛玻璃、动画 |
| **JavaScript (Vanilla)** | 无框架依赖，纯原生 JS |
| **localStorage** | 数据持久化 |
| **Web Speech API** | 语音识别 |
| **DeepSeek API** | AI 智能解析（可选） |

---

## 📂 项目结构

```
huangniu-bookkeeping/
├── index.html      # 记账主页面
├── analysis.html   # 收支分析页面
├── app.js          # 共享核心逻辑（数据层、工具函数、抽屉组件）
├── config.js       # DeepSeek API 配置（留空，通过 UI 输入）
└── styles.css      # Apple 风格样式（iOS HIG 规范）
```

---

## 🚀 快速开始

### 1. 直接打开（最简单）
双击 `index.html` 用浏览器打开即可使用（部分功能受限）。

### 2. 通过本地服务器（推荐）
语音功能需要 HTTPS 或 `localhost`，推荐用本地服务器启动：

```bash
# 用 Python 启动
cd apps/huangniu-bookkeeping
python -m http.server 8080
```
然后访问 `http://localhost:8080`

### 3. 配置 AI 功能（可选）
如需 AI 智能解析和分析功能：
1. 点击右上角 ⚙ 设置按钮
2. 输入 [DeepSeek API Key](https://platform.deepseek.com)
3. 点击保存，Key 仅存储在浏览器本地

---

## 📱 使用指南

### 记账
1. 点击底部 **「+ 记一笔」** 按钮
2. 选择 **收入/支出** 类型
3. 填写名称、金额、日期、标签
4. 点击 **「✓ 确认记账」**

### 语音记账
1. 点击底部 **🎙 麦克风按钮**（或右上角麦克风）
2. 对着麦克风说话（如："午饭花了 35 元"）
3. 说完点击 **「⏹ 停止录音」**
4. AI 自动填写字段，核对后确认

### 收支分析
1. 点击底部导航 **「分析」** 标签
2. 选择分析周期（本月 / 近 3 个月 / 近 6 个月 / 自定义）
3. 点击 **「✦ 让 AI 分析我的收支」**
4. 查看结合佛教财富观的 AI 分析报告

---

## ⚙️ 设置说明

| 设置项 | 说明 |
|--------|------|
| **DeepSeek API Key** | 用于 AI 字段解析和收支分析，留空则使用内置规则解析 |
| **API Key 存储** | 仅存储在浏览器 `localStorage`，不会上传服务器 |

---

## 🎨 UI 设计亮点

- **iOS 毛玻璃导航栏**：`backdrop-filter: blur(20px)`
- **底部抽屉交互**：从屏幕底部滑出，符合单手操作习惯
- **FAB 悬浮按钮**：语音 + 记账双按钮，随时快速操作
- **语音状态指示**：录音时顶部出现脉冲红点状态栏
- **AI 徽章**：配置 API Key 后显示 ✦ AI 标识
- **响应式布局**：适配各种屏幕尺寸，移动端体验优秀

---

## 🔒 隐私声明

- **纯前端应用**，无任何后端服务器
- **所有数据**均存储在用户浏览器 `localStorage` 中
- **API Key** 仅保存在本地，不会随代码泄露

---

## 🐛 已知问题 / 待优化

- [ ] 数据导出/导入功能（备份到 JSON）
- [ ] 多设备同步（需接入后端）
- [ ] 图表可视化增强（引入 Chart.js）
- [ ] 深色模式

## 📄 开源协议

[MIT License](./LICENSE)

---

## 🙏 致谢

- UI 设计参考 [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- 佛教财富观理论参考济群法师《佛教的财富观》
- AI 能力由 [DeepSeek](https://www.deepseek.com) 提供

---

> 🐂 **黄牛记账** —— 记账，不只看数字，更看心声。