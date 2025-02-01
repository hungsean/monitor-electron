import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { useAppStore } from "@/utils/store";
import { useEffect, useRef, useState } from "react";

const VideoMain = () => {

    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { setData } = useAppStore()

    useEffect(() => {
        // 訂閱更新視頻 URL 的事件
        const unsubscribe = eventBus.subscribe(EVENT_TYPES.UPDATE_VIDEO_URL, (url: string) => {
            setVideoUrl(url);
        });

        // 清理訂閱
        return () => unsubscribe();
    }, []);


    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setData({ videoCurrentTime: videoRef.current.currentTime });
            // setData({ videoLength: videoRef.current.duration });
            console.log("update time!", videoRef.current.currentTime);
            // console.log("length: ", videoRef.current.duration);
        }
    };

    const handleVideoLengthUpdate = () => {
        if (videoRef.current) {
            setData({ videoLength: videoRef.current.duration });
            console.log("length: ", videoRef.current.duration);
        }
    }

    return (
        <video
            controls
            key={videoUrl}
            ref={videoRef}
            onLoadedMetadata={handleVideoLengthUpdate}
            onTimeUpdate={handleTimeUpdate}
        >
            <source src={videoUrl} type="video/mp4" />
        </video>
    )
}

export default VideoMain;