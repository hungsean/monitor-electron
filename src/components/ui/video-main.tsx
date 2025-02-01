import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { useAppStore } from "@/utils/store";
import { useEffect, useRef, useState } from "react";

const VideoMain = () => {

    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const videoRef = useRef<HTMLVideoElement>(null);
    const setData = useAppStore(state => state.setData);

    useEffect(() => {
        // 訂閱更新視頻 URL 的事件
        const unsubscribe = eventBus.subscribe(EVENT_TYPES.UPDATE_VIDEO_URL, (url: string) => {
            setVideoUrl(url);
        });

        // 清理訂閱
        return () => unsubscribe();
    }, []);

    return (
        <video controls key={videoUrl}>
            <source src={videoUrl} type="video/mp4" />
        </video>
    )
}

export default VideoMain;