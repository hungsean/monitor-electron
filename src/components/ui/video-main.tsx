import { useKeyDown, useKeyUp } from "@/hook/keyboard";
import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { useAppStore } from "@/utils/store";
import { useEffect, useRef, useState } from "react";

const VideoMain = () => {

    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const videoRef = useRef<HTMLVideoElement>(null);
    const rafRef = useRef<number>();
    const { data, setData } = useAppStore()

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

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    useKeyDown('Space', () => {
        togglePlayPause();
    });

    useKeyDown('Digit4', () => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 4;
        }
    })

    useKeyUp('Digit4', () => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1;
        }
    })

    useKeyDown('AltLeft', () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    })

    useKeyUp('AltLeft', () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    })

    function skipSecond(real_second: number) {
        if (videoRef.current) {
            const start_time_second = data.START_REAL_TIME?.toSeconds() ?? 0;
            const end_time_second = data.END_REAL_TIME?.toSeconds() ?? 0;
            const real_time_length = end_time_second - start_time_second;
            const video_time_length = videoRef.current.duration;
            const video_skip_second = real_second * video_time_length / real_time_length;
            
            videoRef.current.currentTime += video_skip_second;
            setData({ videoCurrentTime: videoRef.current.currentTime });
        }
    }

    useKeyDown('KeyW', () => {
        skipSecond(1);
    });

    useKeyDown('KeyS', () => {
        skipSecond(-1);
    });

    useKeyDown('KeyA', () => {
        skipSecond(-10);
    });

    useKeyDown('KeyD', () => {
        skipSecond(10);
    });


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