# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開發命令

- **開發模式**: `pnpm dev` - 啟動 Vite 開發伺服器和 Electron 應用
- **建置**: `pnpm build` - 編譯 TypeScript、建置 Vite 專案並打包 Electron 應用
- **程式碼檢查**: `pnpm lint` - 執行 ESLint 檢查 TypeScript 和 TSX 檔案

## 專案架構

這是一個 Electron + React + TypeScript 的桌面應用程式，用於影片監控和處理。

### 核心技術棧
- **桌面框架**: Electron 30 (主程序在 `electron/main.ts`)
- **前端**: React 19 + TypeScript，使用 Vite 作為建置工具
- **UI 庫**: Chakra UI v3 (組件位於 `src/components/chakra-ui/`)
- **狀態管理**: Zustand (全域狀態在 `src/utils/store.ts`)
- **影片處理**: 透過 FFmpeg 進行影片合併

### 目錄結構
```
src/
├── components/
│   ├── chakra-ui/          # 自訂 Chakra UI 組件
│   └── ui/                 # 應用程式 UI 組件
├── hook/                   # 自訂 React hooks
├── utils/                  # 工具函數和狀態管理
└── electron/               # Electron 主程序和預載腳本
```

### 關鍵架構模式

**狀態管理**: 使用 Zustand 管理應用程式狀態，主要狀態包括：
- `videoCurrentTime`: 目前影片時間 (TimeManager 類別)
- `videoLength`: 影片總長度
- `START_REAL_TIME` / `END_REAL_TIME`: 開始/結束時間管理

**時間管理**: 自訂 `TimeManager` 類別處理時間相關操作，位於 `src/utils/time-manager.ts`

**事件通訊**: 使用事件匯流排模式 (`src/utils/event-bus.ts`) 處理組件間通訊

**路徑別名**: 使用 `@/` 作為 `src/` 目錄的別名

### UI 組件架構
- `VideoMain`: 主要影片顯示組件
- `VideoController`: 影片控制器 (播放、暫停、時間調整)
- `OpenFileButton`: 檔案開啟功能
- `EditDialog`: 編輯對話框

### Electron 配置
- 主程序檔案: `electron/main.ts`
- 預載腳本: `electron/preload.ts`
- 開發時使用 `vite-plugin-electron` 整合

使用 pnpm 作為套件管理器。專案配置了 React Compiler (babel-plugin-react-compiler) 以提升效能。
