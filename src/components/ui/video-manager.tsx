// src/components/ui/video-merger.tsx
import React, { useRef } from 'react'
import { Button, Box, Text, Progress, Flex } from '@chakra-ui/react'
import { useVideoMerger } from '@/hook/use-video-merger'
import { eventBus, EVENT_TYPES } from '@/utils/event-bus'

export const VideoMerger: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mergeVideos, merging, resultMessage, mergedVideoUrl } = useVideoMerger()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        if (files && files.length > 0) {
            const success = await mergeVideos(files)

            if (success && mergedVideoUrl) {
                // 通知系統播放合併後的影片
                eventBus.emit(EVENT_TYPES.UPDATE_VIDEO_URL, mergedVideoUrl)
            }
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <Box>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".mp4"
                multiple
                style={{ display: 'none' }}
            />

            <Flex direction="column" gap={3}>
                <Button
                    onClick={handleUploadClick}
                    colorScheme="blue"
                    disabled={merging}
                >
                    選擇多個影片進行合併
                </Button>

                {merging && (
                    <Progress.Root maxW="240px" value={null}>
                        <Progress.Track>
                            <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
                )}

                {resultMessage && (
                    <Text
                        color={mergedVideoUrl ? "green.500" : "red.500"}
                        fontWeight="bold"
                    >
                        {resultMessage}
                    </Text>
                )}

                {mergedVideoUrl && (
                    <Text fontSize="sm">
                        已成功合併影片，影片已載入播放器。
                    </Text>
                )}
            </Flex>
        </Box>
    )
}