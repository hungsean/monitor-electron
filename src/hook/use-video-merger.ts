// src/hook/use-video-merger.ts
import { useState } from 'react'
import { validateMP4FileNames, extractFileNames } from '@/utils/check-filename'

// 在全局窗口類型中聲明 electron 接口
declare global {
  interface Window {
    electron: {
      mergeVideos: (filePaths: string[]) => Promise<{
        success: boolean
        message: string
        outputPath?: string
      }>
    }
  }
}

export const useVideoMerger = () => {
  const [merging, setMerging] = useState(false)
  const [resultMessage, setResultMessage] = useState('')
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string | null>(null)

  const mergeVideos = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setResultMessage('請選擇要合併的影片檔')
      return false
    }

    // 檢查檔案名稱是否符合格式
    const filenames = extractFileNames(files)
    if (!validateMP4FileNames(filenames)) {
      setResultMessage('檔案名稱格式不正確或影片不連續')
      return false
    }

    setMerging(true)
    setResultMessage('正在處理影片合併，請稍候...')

    try {
      // 由於安全原因，Electron 不允許直接傳遞 File 對象，需要暫時保存檔案
      // 這裡我們將依賴 main 進程中的對話框讓用戶先選擇保存的檔案
      
      // 獲取文件路徑數組
      const filePaths = Array.from(files).map(file => file.path)
      
      // 呼叫 main 進程的方法進行合併
      const result = await window.electron.mergeVideos(filePaths)
      
      setResultMessage(result.message)
      
      if (result.success && result.outputPath) {
        // 創建合併後影片的URL以供播放
        setMergedVideoUrl(`file://${result.outputPath}`)
        return true
      }
      
      return false
    } catch (error) {
      console.error('合併影片時發生錯誤:', error)
      setResultMessage(`合併失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
      return false
    } finally {
      setMerging(false)
    }
  }

  return {
    mergeVideos,
    merging,
    resultMessage,
    mergedVideoUrl,
    resetMerger: () => {
      setResultMessage('')
      setMergedVideoUrl(null)
    }
  }
}