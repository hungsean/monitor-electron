import { useKeyCombination, useKeyDown, useKeyUp } from "@/hook/keyboard";
import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { useAppStore } from "@/utils/store";
import TimeManager from "@/utils/time-manager";
import { useCallback, useEffect, useRef, useState } from "react";

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

    const debounceUpdate = useCallback((fn: () => void) => {
        let timeoutId: NodeJS.Timeout;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn();
            }, 50); 
        };
    }, []);

    const updateTime = useCallback(() => {
        if (videoRef.current) {
            const updateStore = debounceUpdate(() => {
                const start_time_second = data.START_REAL_TIME?.toSeconds() ?? 0;
                const end_time_second = data.END_REAL_TIME?.toSeconds() ?? 0;
                const real_time_length = end_time_second - start_time_second;
                const temp_current_time = new TimeManager(
                    start_time_second +
                    (videoRef.current!.currentTime * real_time_length / videoRef.current!.duration)
                );

                setData({ videoCurrentTime: temp_current_time });
            });

            updateStore();
        }

        rafRef.current = requestAnimationFrame(updateTime);
    }, [data.START_REAL_TIME, data.END_REAL_TIME, setData]);


    const handlePlay = () => {
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
            updateTime();
            // setData({ videoCurrentTime: videoRef.current.currentTime });
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                // 可以在這裡加入成功的提示
                console.log('Text copied to clipboard');
            })
            .catch((err) => {
                // 處理錯誤
                console.error('Failed to copy text: ', err);
            });
    };

    useKeyCombination(['ControlLeft', 'KeyC'], () => {
        copyToClipboard(data.videoCurrentTime.toString())
    })

    const readFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (err) {
            console.error('Failed to read clipboard:', err);
            return '';
        }
    };

    useKeyCombination(['ControlLeft', 'KeyV'], () => {
        console.log("get ctrl+v");

        readFromClipboard().then(pasteTime => {
            const regex = /^-?([0-9]|[0-9][0-9]):([0-5][0-9]):([0-5][0-9])$/;
            if (regex.test(pasteTime)) {
                console.log("start pasting")
                if (videoRef.current) {
                    const paste_time_second = new TimeManager(pasteTime).toSeconds();
                    const start_time_second = data.START_REAL_TIME?.toSeconds() ?? 0;
                    const paste_time_left = paste_time_second - start_time_second;
                    const end_time_second = data.END_REAL_TIME?.toSeconds() ?? 0;
                    const real_time_length = end_time_second - start_time_second;
                    const video_time_length = videoRef.current.duration;
                    const video_current_second = (paste_time_left * video_time_length) / real_time_length;

                    videoRef.current.currentTime = video_current_second;
                    updateTime();
                    console.log("paste time");
                }
            } else {
                console.log("no pass");
            }
        }).catch(error => {
            console.error("Failed to read clipboard:", error);
        });
    })

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