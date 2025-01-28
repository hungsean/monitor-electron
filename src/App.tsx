import { Box, Button, Center, Flex, IconButton, Input, Text } from '@chakra-ui/react'
import { ClipboardIconButton, ClipboardRoot } from "@/components/ui/clipboard"
import '@/App.css'

import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { CiEdit, CiSaveUp2 } from 'react-icons/ci'
import { useEffect, useRef, useState } from 'react'

function App() {
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (videoUrl) {
            console.log('Video URL updated:', videoUrl);
        }
    }, [videoUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    

    const UploadButton = () => {
        return (
            <>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="video/*"
                    style={{ display: 'none' }}
                />
                <Button onClick={handleUploadClick}>
                    <CiSaveUp2 /> Upload file
                </Button>
            </>
        )
    }

    const VideoController = () => {
        interface TimeBoxProps {
            inputTime: string;
        }

        const TimeBox = ({ inputTime }: TimeBoxProps) => {
            return (
                <Box
                    borderWidth={'2px'}
                    borderRadius='lg'
                    width={'100px'}
                >
                    <Center height={'100%'}>
                        <Text>{inputTime}</Text>
                    </Center>
                </Box>
            );
        }
        return (
            <Flex direction={'column'} align={'center'} gap={'2'}>
                <Flex gap={'2'}>
                    <TimeBox inputTime='22:10:30'></TimeBox>
                    <ClipboardRoot value={""} timeout={400}>
                        <ClipboardIconButton />
                    </ClipboardRoot>
                </Flex>
                <Flex gap={'2'}>
                    
                    <Button size={'sm'}>-1</Button>
                    <Button size={'sm'}>-30</Button>
                    <TimeBox inputTime='10:00:00'></TimeBox>
                    <TimeBox inputTime='10:00:00'></TimeBox>
                    <Button size={'sm'}>+30</Button>
                    <Button size={'sm'}>+1</Button>
                </Flex>
            </Flex>
        )
    }

    const EditDialog = () => {
        const [startTime, setStartTime] = useState('10:00:00');
        return (
            <DialogRoot>
                <DialogTrigger asChild>
                    <IconButton>
                        <CiEdit />
                    </IconButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit time</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Flex width={'100%'}>
                            <Flex flex={'1'} direction={'column'}>
                                <Text>Start time</Text>
                                <Input
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </Flex>
                            <Flex flex={'1'} direction={'column'}>
                                <Text>End time</Text>
                                <Input></Input>
                            </Flex>
                        </Flex>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button>Save</Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        )
        
    }

    const VideoHeader = () => {
        return (
            <Flex width={'100%'} justify={'space-between'} padding={'15px'}>
                <Flex flex={'1'} justify={'flex-start'}>
                    <UploadButton></UploadButton>
                </Flex>
                <Flex flex={'1'} justify={'center'}>
                    <VideoController></VideoController>
                </Flex>
                <Flex flex={'1'} justify={'flex-end'} gap={'2'}>
                    <EditDialog></EditDialog>
                    <Button>dark mode</Button>
                </Flex>
            </Flex>
        )
    }    


    return (
        <Flex direction={'column'}>
            <VideoHeader></VideoHeader>
            <video controls key={videoUrl}>
                <source src={videoUrl} type="video/mp4" />
            </video>
        </Flex>
    )
}

export default App
