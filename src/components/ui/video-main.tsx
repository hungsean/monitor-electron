import { useKeyCombination, useKeyDown, useKeyUp } from "@/hook/keyboard";
import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { useAppStore } from "@/utils/store";
import TimeManager from "@/utils/time-manager";
import { useCallback, useEffect, useRef, useState } from "react";
import { Switch } from "../chakra-ui/switch";
import { Box } from "@chakra-ui/react";

const VideoMain = () => {

    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const [videoControls, setVideoControls] = useState(false);
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
            console.log("video length update")
            setData({ videoLength: videoRef.current.duration });
        }
    }

    // 移除 debounceUpdate，改用 throttle
    const throttleUpdate = useCallback((fn: () => void) => {
        let lastRun = 0;
        const limit = 200; // 200ms

        return () => {
            const now = Date.now();
            if (now - lastRun >= limit) {
                fn();
                lastRun = now;
            }
        };
    }, []);

    const updateStore = throttleUpdate(() => {
        const start_time_second = data.START_REAL_TIME?.toSeconds() ?? 0;
        const end_time_second = data.END_REAL_TIME?.toSeconds() ?? 0;
        const real_time_length = end_time_second - start_time_second;
        const temp_current_time = new TimeManager(
            start_time_second +
            (videoRef.current!.currentTime * real_time_length / videoRef.current!.duration)
        );

        console.log("current time update");
        setData({ videoCurrentTime: temp_current_time });
    });

    // const updateTime = useCallback(() => {
    //     if (videoRef.current) {
            

    //         updateStore();
    //     }

    //     rafRef.current = requestAnimationFrame(updateTime);
    // }, [data.START_REAL_TIME, data.END_REAL_TIME, setData]);

    // 添加清理函數
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // useEffect(() => {
    //     // 清理函數
    //     return () => {
    //         if (rafRef.current) {
    //             cancelAnimationFrame(rafRef.current);
    //         }
    //     };
    // }, []);

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

    const setSpeedRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
        }
    }

    useKeyDown('Digit1', () => {
        setSpeedRate(0.5);
    })

    useKeyDown('Digit2', () => {
        setSpeedRate(2);
    })

    useKeyDown('Digit3', () => {
        setSpeedRate(3);
    })

    useKeyDown('Digit4', () => {
        setSpeedRate(4);
    })

    useKeyDown('Digit5', () => {
        setSpeedRate(10);
    })

    useKeyUp('Digit1', () => {
        setSpeedRate(1);
    })

    useKeyUp('Digit2', () => {
        setSpeedRate(1);
    })

    useKeyUp('Digit3', () => {
        setSpeedRate(1);
    })

    useKeyUp('Digit4', () => {
        setSpeedRate(1);
    })

    useKeyUp('Digit5', () => {
        setSpeedRate(1);
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
            updateStore();
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
        console.info("start read clipboard");
        try {
            const text = await navigator.clipboard.readText();
            console.info("successful read text: ", text)
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
                    console.info("videoRef current exist, start calculate");
                    const paste_time_second = new TimeManager(pasteTime).toSeconds();
                    const start_time_second = data.START_REAL_TIME?.toSeconds() ?? 0;
                    const paste_time_left = paste_time_second - start_time_second;
                    const end_time_second = data.END_REAL_TIME?.toSeconds() ?? 0;
                    const real_time_length = end_time_second - start_time_second;
                    const video_time_length = videoRef.current.duration;
                    const video_current_second = (paste_time_left * video_time_length) / real_time_length;

                    videoRef.current.currentTime = video_current_second;
                    updateStore();
                    console.info("paste time finished");
                }
            } else {
                console.error("no pass");
            }
        }).catch(error => {
            console.error("Failed to read clipboard:", error);
        });
    })

    return (
        <Box>
            <video
                // controls
                key={videoUrl}
                ref={videoRef}
                preload="auto"
                controls={videoControls}
                onLoadedMetadata={handleVideoLengthUpdate}
                // onPlay={handlePlay}
                // onPause={() => {
                //     if (rafRef.current) {
                //         cancelAnimationFrame(rafRef.current);
                //     }
                // }}
                onTimeUpdate={() => {
                    // 在這裡更新時間
                    // const updateStore = throttleUpdate(() => {
                    //     // ... 時間更新邏輯
                    //     updateTime()
                    // });
                    updateStore();
                }}
                
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
            <Switch checked={videoControls} onCheckedChange={(e) => setVideoControls(e.checked)} ></Switch>
        </Box>
        
    )
}

export default VideoMain;