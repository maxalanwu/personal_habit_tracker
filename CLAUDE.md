# Habits — 專案說明與交接

一個極簡的**每日習慣追蹤器**。行動裝置優先，桌面次要。純前端，資料只存在瀏覽器 `localStorage`，無後端、無帳號、無路由。

## 技術棧

- React 19 + TypeScript + Vite 8
- Lint：`oxlint`（`npm run lint`）
- 無路由函式庫、無狀態管理函式庫、無 UI 函式庫、無 CSS 框架 —— 全部手寫
- 樣式集中在單一檔案 [src/index.css](src/index.css)，用 CSS 變數做淺色/深色主題

## 指令

```bash
npm run dev       # 開發伺服器 localhost:5173
npm run build     # tsc -b && vite build  —— 部署前必須跑通
npm run lint      # oxlint
npm run preview   # 本機起生產版 localhost:4173
```

**環境陷阱**：本機（Windows）`npm` 預設不在 Claude Code 工作階段行程的 PATH 裡。
Node 裝在 `C:\Program Files\nodejs`。已加進使用者 PATH，新開的終端機沒問題；
若工作階段內出現 "npm: command not found"，用 `& "C:\Program Files\nodejs\npm.cmd" ...`。

## 目錄結構

- [src/App.tsx](src/App.tsx) —— 主元件：header、Today/Week 切換、骨架屏、空狀態
- [src/hooks/useHabits.ts](src/hooks/useHabits.ts) —— 習慣 CRUD + localStorage 持久化 + 跨分頁同步
- [src/lib/habits.ts](src/lib/habits.ts) —— `Habit` 型別、load/save、`toggleToday`、`isDoneToday`、`STORAGE_KEY`
- [src/lib/dates.ts](src/lib/dates.ts) —— 日期鍵（本地 `YYYY-MM-DD`）、`currentStreak`、`lastSevenDays`
- [src/lib/motivation.ts](src/lib/motivation.ts) —— 每日勵志語（依日期雜湊取模，當天固定）
- [src/lib/confetti.ts](src/lib/confetti.ts) —— 無相依的彩帶動畫，尊重 `prefers-reduced-motion`
- [src/components/HabitCard.tsx](src/components/HabitCard.tsx) —— 單個習慣卡：SVG 描邊勾號、`navigator.vibrate` 觸覺、haptic 脈衝、當日首次完成放彩帶
- [src/components/AddHabitForm.tsx](src/components/AddHabitForm.tsx) —— 「+ Add habit」觸發按鈕 + 對話框（emoji 網格 + 名稱，Enter 或 Save 儲存）
- [src/components/WeeklyGrid.tsx](src/components/WeeklyGrid.tsx) —— 近 7 天完成度網格
- [src/components/Skeleton.tsx](src/components/Skeleton.tsx) —— 首屏 ~320ms 骨架屏
- [src/main.tsx](src/main.tsx) —— 進入點 + 生產環境註冊 Service Worker
- `public/` —— `manifest.webmanifest`、`sw.js`、`icon.svg`（原始檔）、`pwa-*.png`、`apple-touch-icon.png`

## 關鍵決策 / 慣例

- **持久化**：`useHabits` 首次 render 不寫入（避免偶發讀取失敗時用空陣列覆蓋好資料）；只在真實變更後才 `saveHabits`。
- **每日勵志語**：必須依日期做確定性選取，不能用 `Math.random`（否則每次 render 都閃動）。
- **動畫**：所有動畫在 `prefers-reduced-motion` 下降級；彩帶在該模式下完全跳過。
- **觸覺**：`navigator.vibrate` 用 `navigator.userActivation?.isActive` 把關，避免無手勢時的 Console 錯誤。
- **配色**：暖色調（奶油白底、暖灰邊框、暖近黑文字）。綠色主色 `--accent` 保留作視覺識別；
  **含白字的按鈕**必須用較深的 `--accent-btn` 漸層（白字對比度 ≥ AA）。
- **行動裝置**：`@media (hover: none)` 下刪除按鈕常駐可見（觸控裝置沒有 hover）；觸控目標 ≥ 44px；
  週網格在 ≤480px 用彈性欄避免橫向捲動。
- **無障礙**：內文對比度實測 ≥5:1；全域 `:focus-visible`；進度數字 `aria-live`；切換控制項是帶 `aria-label` 的按鈕群組。

## 部署

- GitHub：https://github.com/maxalanwu/personal_habit_tracker （`main` 分支）
- 目標平台：**Vercel**，透過 GitHub 整合（vercel.com/new 匯入儲存庫，自動辨識 Vite，零設定，push 即自動部署）
- 截至最後一次工作階段：程式碼已就緒並推送，**尚未在 Vercel 完成匯入**。

## 已知問題 / 待辦

- Service Worker 在 Claude Code 內建預覽瀏覽器裡註冊會報 "unknown error occurred when fetching the script" ——
  是預覽沙箱攔截巢狀 SW，**真實 HTTPS/Vercel 上正常**，不用理會。
- `pwa-512.png` / `pwa-maskable-512.png` 是 canvas 匯出的未最佳化 PNG（各 ~235KB）。想瘦身可用 `sharp`/`squoosh` 重新壓縮。
- 部署後建議跑一次 Lighthouse PWA 稽核，確認線上 SW 真的註冊成功、可安裝。
- 尚無測試（無 vitest/testing-library）。邏輯集中在 `src/lib/`，容易補單元測試。

## 回覆語言

用**繁體中文**回覆。
