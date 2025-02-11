import { Box, Center, Text, Flex, Button } from "@chakra-ui/react";
import { useAppStore } from "@/utils/store";
import { useEffect, useState } from "react";
import TimeManager from "@/utils/time-manager";

const VideoController = () => {

    const { data, setData } = useAppStore()
    
    const [start_time, setStartTime] = useState<TimeManager>();
    const [end_time, setEndTime] = useState<TimeManager>();
    const [current_time, setCurrentTime] = useState<TimeManager>();
    // const [video_length, setVideoLength] = useState<number>(0);

    useEffect(() => {
        setStartTime(data.START_REAL_TIME);
        console.log("start real time changed: ", { startTime: data.START_REAL_TIME?.toString() ?? '' })
    }, [data.START_REAL_TIME]);

    useEffect(() => {
        // console.log("start time changed: ", { start_time });
    }, [start_time]);

    useEffect(() => {
        setEndTime(data.END_REAL_TIME);
    }, [data.END_REAL_TIME]);

    useEffect(() => {
        setCurrentTime(data.videoCurrentTime);
    }, [data.videoCurrentTime]);

    // useEffect(() => {
    //     setVideoLength(data.videoLength);
    // }, [data.videoLength]);




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

    function moveTimeHour(time: number): void{
        const currentStartRealTime = data.START_REAL_TIME;
        const currentEndRealTime = data.END_REAL_TIME;
        if (currentStartRealTime && currentEndRealTime) {
            const newStartRealTime = new TimeManager(currentStartRealTime.toString());
            const newEndRealTime = new TimeManager(currentEndRealTime.toString());
            newStartRealTime.addHours(time);
            newEndRealTime.addHours(time);
            console.log("realtime update");
            setData({ START_REAL_TIME: newStartRealTime })
            setData({ END_REAL_TIME: newEndRealTime })
        }
    }

    function moveTimeMinute(time: number): void {
        const currentStartRealTime = data.START_REAL_TIME;
        const currentEndRealTime = data.END_REAL_TIME;
        if (currentStartRealTime && currentEndRealTime) {
            const newStartRealTime = new TimeManager(currentStartRealTime.toString());
            const newEndRealTime = new TimeManager(currentEndRealTime.toString());
            newStartRealTime.addMinutes(time);
            newEndRealTime.addMinutes(time);
            console.log("realtime update");
            setData({ START_REAL_TIME: newStartRealTime })
            setData({ END_REAL_TIME: newEndRealTime })
        }
    }

    return (
        <Flex direction={'column'} align={'center'} gap={'2'}>
            <Flex gap={'2'}>
                <TimeBox inputTime={current_time?.toString() ?? ''}></TimeBox>
                {/*<ClipboardRoot value={""} timeout={400}>
                    <ClipboardIconButton />
                </ClipboardRoot>*/}
            </Flex>
            <Flex gap={'2'}>
                <Button size={'sm'} onClick={() => moveTimeHour(-24)}>-24</Button>
                <Button size={'sm'} onClick={() => moveTimeHour(-1)}>-1</Button>
                <Button size={'sm'} onClick={() => moveTimeMinute(-30)}>-30</Button>
                <TimeBox inputTime={start_time?.toString() ?? ''}></TimeBox>
                <TimeBox inputTime={end_time?.toString() ?? ''}></TimeBox>
                <Button size={'sm'} onClick={() => moveTimeMinute(30)}>+30</Button>
                <Button size={'sm'} onClick={() => moveTimeHour(1)}>+1</Button>
                <Button size={'sm'} onClick={() => moveTimeHour(24)}>24</Button>
            </Flex>
        </Flex>
    )
}

export default VideoController;
