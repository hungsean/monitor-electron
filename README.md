# Monitor Electron

一個基於 Electron 的影片監控與處理工具，提供影片播放、時間控制和多影片合併功能。

## 功能特色

### 📹 影片播放與監控

- 支援 MP4 影片檔案播放
- 即時時間顯示和時間軸控制
- 開始/結束時間設定與管理
- 時間快速調整按鈕（±30分鐘、±1小時、±24小時）

### 🎬 影片合併

- 多檔案 MP4 影片合併功能
- 自動檔名格式驗證
- 使用 FFmpeg 進行無損合併
- 支援大量檔案批次處理

### 🎨 使用者介面

- 基於 Chakra UI 的現代化介面
- 響應式設計，支援不同螢幕尺寸
- 直觀的操作控制面板

## 技術架構

- **前端框架**: React 19 + TypeScript
- **桌面應用**: Electron 30
- **UI 組件**: Chakra UI v3
- **影片處理**: FFmpeg + fluent-ffmpeg
- **狀態管理**: Zustand
- **建置工具**: Vite + electron-builder

## 安裝與執行

### 開發環境需求

- Node.js 18+
- pnpm (推薦)

### 安裝依賴

```bash
pnpm install
```

### 開發模式

```bash
pnpm dev
```

### 建置應用程式

```bash
pnpm build
```

## 專案結構

```plaintext
src/
├── components/
│   ├── ui/
│   │   ├── video-controller.tsx    # 影片控制器
│   │   ├── video-manager.tsx       # 影片合併管理
│   │   ├── video-main.tsx          # 主要影片顯示
│   │   └── open-file-button.tsx    # 檔案開啟按鈕
│   └── chakra-ui/                  # Chakra UI 組件
├── hook/
│   ├── use-video-merger.ts         # 影片合併邏輯
│   └── use-file-handler.ts         # 檔案處理邏輯
├── utils/
│   ├── check-filename.ts           # 檔名驗證工具
│   ├── time-manager.ts             # 時間管理工具
│   ├── store.ts                    # Zustand 狀態管理
│   └── event-bus.ts               # 事件總線
└── electron/
    ├── main.ts                     # Electron 主程序
    └── preload.ts                  # 預載腳本
```

## 使用說明

1. **開啟影片**: 點擊「開啟檔案」按鈕選擇 MP4 檔案
2. **時間控制**: 使用控制面板調整開始/結束時間
3. **影片合併**: 選擇多個影片檔案進行合併處理
4. **時間調整**: 使用快速調整按鈕進行時間偏移

## 檔名格式要求

影片合併功能要求檔案名稱遵循特定格式以確保正確排序：

- 支援數字序列檔名（如：001.mp4, 002.mp4）
- 自動驗證檔案連續性

## 作者

Created by hungsean
