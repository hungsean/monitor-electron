1. upload file -> open file
2. ~~效能問題(記憶體過度佔用)~~
   1. ~~長按按鍵記得lock~~
3. 載入新影片時上面的實時顯示並不會更新上下限
4. switch來顯示控制項
5. wasd反應速度過慢(尤其是alt後馬上a/d)
6. 釋放影片url記憶體


keyboard.ts:43 Error in key event callback: TypeError: Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.
    at skipSecond (video-main.tsx:155:30)
    at video-main.tsx:166:9
    at handleKeyPress (keyboard.ts:41:27)