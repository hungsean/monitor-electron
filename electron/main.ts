import { app, BrowserWindow, ipcMain, dialog  } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'

// const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// 設定 ffmpeg 路徑
ffmpeg.setFfmpegPath(ffmpegPath.path)

// 合併影片的函數
async function mergeVideos(files: string[], outputPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // 創建臨時檔案列表
      const tempFile = path.join(app.getPath('temp'), 'mylist.txt')
      const fileContent = files.map(file => `file '${file.replace(/'/g, "'\\''")}'`).join('\n')
      fs.writeFileSync(tempFile, fileContent)

      // 使用 ffmpeg 合併影片
      ffmpeg()
        .input(tempFile)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions('-c:v copy')
        .outputOptions('-c:a copy')
        .save(outputPath)
        .on('end', () => {
          // 刪除臨時檔案
          fs.unlinkSync(tempFile)
          resolve(true)
        })
        .on('error', (err) => {
          console.error('Error during ffmpeg process:', err)
          // 嘗試刪除臨時檔案
          try {
            if (fs.existsSync(tempFile)) {
              fs.unlinkSync(tempFile)
            }
          } catch (e) {
            console.error('Error cleaning up temp file:', e)
          }
          reject(err)
        })
    } catch (error) {
      console.error('Error setting up ffmpeg process:', error)
      reject(error)
    }
  })
}

// 註冊IPC處理程序
ipcMain.handle('merge-videos', async (_event, filePaths: string[]) => {
  try {
    // 讓使用者選擇輸出路徑
    const { filePath } = await dialog.showSaveDialog({
      title: '儲存合併影片',
      defaultPath: path.join(app.getPath('videos'), '合併影片.mp4'),
      filters: [{ name: 'MP4檔案', extensions: ['mp4'] }]
    })

    if (!filePath) {
      return { success: false, message: '未選擇儲存位置' }
    }

    // 執行合併
    await mergeVideos(filePaths, filePath)
    
    return {
      success: true,
      message: '影片合併成功',
      outputPath: filePath
    }
  } catch (error) {
    console.error('合併影片失敗:', error)
    return {
      success: false,
      message: `合併失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
    }
  }
})


function createWindow() {
  // const preloadPath = new URL('./preload.mjs', import.meta.url).pathname
  const iconPath = new URL('./public/electron-vite.svg', import.meta.url).pathname
  const indexHtmlPath = new URL('../dist/index.html', import.meta.url).pathname

  win = new BrowserWindow({
    title: "monitor-electron",
    icon: iconPath,
    webPreferences: {
    preload: path.join(__dirname, 'preload.mjs'),
    contextIsolation: true,
    nodeIntegration: false,
  }
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(indexHtmlPath)
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
