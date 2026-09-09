# Habits — 项目说明与交接

一个极简的**每日习惯追踪器**。移动端优先，桌面端次要。纯前端，数据只存在浏览器 `localStorage`，无后端、无账号、无路由。

## 技术栈

- React 19 + TypeScript + Vite 8
- Lint：`oxlint`（`npm run lint`）
- 无路由库、无状态管理库、无 UI 库、无 CSS 框架 —— 全部手写
- 样式集中在单文件 [src/index.css](src/index.css)，用 CSS 变量做浅色/深色主题

## 命令

```bash
npm run dev       # 开发服务器 localhost:5173
npm run build     # tsc -b && vite build  —— 部署前必须跑通
npm run lint      # oxlint
npm run preview   # 本地起生产版 localhost:4173
```

**环境坑**：本机（Windows）`npm` 默认不在 Claude Code 会话进程的 PATH 里。
Node 装在 `C:\Program Files\nodejs`。已加进用户 PATH，新开的终端没问题；
若会话内报 "npm: command not found"，用 `& "C:\Program Files\nodejs\npm.cmd" ...`。

## 目录结构

- [src/App.tsx](src/App.tsx) —— 主组件：header、Today/Week 切换、骨架屏、空状态
- [src/hooks/useHabits.ts](src/hooks/useHabits.ts) —— 习惯 CRUD + localStorage 持久化 + 跨标签页同步
- [src/lib/habits.ts](src/lib/habits.ts) —— `Habit` 类型、load/save、`toggleToday`、`isDoneToday`、`STORAGE_KEY`
- [src/lib/dates.ts](src/lib/dates.ts) —— 日期键（本地 `YYYY-MM-DD`）、`currentStreak`、`lastSevenDays`
- [src/lib/motivation.ts](src/lib/motivation.ts) —— 每日励志语（按日期哈希取模，当天固定）
- [src/lib/confetti.ts](src/lib/confetti.ts) —— 无依赖五彩纸屑，尊重 `prefers-reduced-motion`
- [src/components/HabitCard.tsx](src/components/HabitCard.tsx) —— 单个习惯卡：SVG 描边对勾、`navigator.vibrate` 触觉、haptic 脉冲、当日首次完成放纸屑
- [src/components/AddHabitForm.tsx](src/components/AddHabitForm.tsx) —— "+ Add habit" 触发按钮 + 模态框（emoji 网格 + 名称，Enter 或 Save 保存）
- [src/components/WeeklyGrid.tsx](src/components/WeeklyGrid.tsx) —— 近 7 天完成度网格
- [src/components/Skeleton.tsx](src/components/Skeleton.tsx) —— 首屏 ~320ms 骨架屏
- [src/main.tsx](src/main.tsx) —— 入口 + 生产环境注册 Service Worker
- `public/` —— `manifest.webmanifest`、`sw.js`、`icon.svg`（源）、`pwa-*.png`、`apple-touch-icon.png`

## 关键决策 / 约定

- **持久化**：`useHabits` 首次渲染不写盘（避免偶发读取失败用空数组覆盖好数据）；只在真实改动后 `saveHabits`。
- **每日励志语**：必须按日期确定性选取，不能用 `Math.random`（否则每次渲染都闪）。
- **动画**：所有动画在 `prefers-reduced-motion` 下降级；纸屑在该模式下完全跳过。
- **触觉**：`navigator.vibrate` 用 `navigator.userActivation?.isActive` 门控，避免无手势时的 Console 报错。
- **配色**：暖色调（奶油白底、暖灰边框、暖近黑文字）。绿色主色 `--accent` 保留作视觉身份；
  **带白字的按钮**必须用更深的 `--accent-btn` 渐变（白字对比度 ≥ AA）。
- **移动端**：`@media (hover: none)` 下删除按钮常驻可见（触摸设备没有 hover）；触摸目标 ≥ 44px；
  周网格在 ≤480px 用流式列避免横向滚动。
- **无障碍**：正文对比度实测 ≥5:1；全局 `:focus-visible`；进度数字 `aria-live`；切换控件是带 `aria-label` 的按钮组。

## 部署

- GitHub：https://github.com/maxalanwu/personal_habit_tracker （`main` 分支）
- 目标平台：**Vercel**，通过 GitHub 集成（vercel.com/new 导入仓库，自动识别 Vite，零配置，push 即自动部署）
- 截至最后一次会话：代码已就绪并推送，**尚未在 Vercel 完成导入**。

## 已知问题 / 待办

- Service Worker 在 Claude Code 内置预览浏览器里注册会报 "unknown error occurred when fetching the script" ——
  是预览沙箱拦截嵌套 SW，**真实 HTTPS/Vercel 上正常**，不用管。
- `pwa-512.png` / `pwa-maskable-512.png` 是 canvas 导出的未优化 PNG（各 ~235KB）。想瘦身可以用 `sharp`/`squoosh` 重新压。
- 部署后建议跑一次 Lighthouse PWA 审计，确认线上 SW 真的注册成功、可安装。
- 尚无测试（无 vitest/testing-library）。逻辑集中在 `src/lib/`，容易补单测。

## 回复语言

用**简体中文**回复。
