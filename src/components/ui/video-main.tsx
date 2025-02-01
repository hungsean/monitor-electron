import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { useAppStore } from "@/utils/store";
import { useEffect, useRef, useState } from "react";

const VideoMain = () => {

    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const videoRef = useRef<HTMLVideoElement>(null);
    const rafRef = useRef<number>();
    const { setData } = useAppStore()

    useEffect(() => {
        // 訂閱更新視頻 URL 的事件
        const unsubscribe = eventBus.subscribe(EVENT_TYPES.UPDATE_VIDEO_URL, (url: string) => {
            setVideoUrl(url);
        });

        // 清理訂閱
        return () => unsubscribe();
    }, []);

    const handleVideoLengthUpdate = () => {
        if (videoRef.current) {
            setData({ videoLength: videoRef.current.duration });
            console.log("length: ", videoRef.current.duration);
        }
    }

    const handlePlay = () => {
        const updateTime = () => {
            if (videoRef.current) {
                // 在這裡處理時間更新邏輯
                setData({ videoCurrentTime: videoRef.current.currentTime });
                console.log("update time!", videoRef.current.currentTime);
            }

            rafRef.current = requestAnimationFrame(updateTime);
        };

        updateTime();
    };

    useEffect(() => {
        // 清理函數
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return (
        <video
            controls
            key={videoUrl}
            ref={videoRef}
            onLoadedMetadata={handleVideoLengthUpdate}
            onPlay={handlePlay}
            onPause={() => {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
            }}
        >
            <source src={videoUrl} type="video/mp4" />
        </video>
    )
}

export default VideoMain;