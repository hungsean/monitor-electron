import { Box, Center, Text, Flex, Button } from "@chakra-ui/react";
import { ClipboardRoot, ClipboardIconButton } from "../chakra-ui/clipboard";
import { useAppStore } from "@/utils/store";
import { useEffect, useState } from "react";
import TimeManager from "@/utils/time-manager";

const VideoController = () => {

    const { data, setData } = useAppStore()
    
    const [start_time, setStartTime] = useState<string>('');
    const [end_time, setEndTime] = useState<string>('');

    useEffect(() => {
        setStartTime(data.START_REAL_TIME?.toString() ?? '');
        console.log("start real time changed: ", { startTime: data.START_REAL_TIME?.toString() ?? '' })
    }, [data.START_REAL_TIME]);

    useEffect(() => {
        console.log("start time changed: ", { start_time });
    }, [start_time]);

    useEffect(() => {
        setEndTime(data.END_REAL_TIME?.toString() ?? '');
    }, [data.END_REAL_TIME]);



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
            setData({ START_REAL_TIME: newStartRealTime })
            setData({ END_REAL_TIME: newEndRealTime })
        }
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

                <Button size={'sm'} onClick={() => moveTimeHour(-1)}>-1</Button>
                <Button size={'sm'} onClick={() => moveTimeMinute(-30)}>-30</Button>
                <TimeBox inputTime={start_time}></TimeBox>
                <TimeBox inputTime={end_time}></TimeBox>
                <Button size={'sm'} onClick={() => moveTimeMinute(30)}>+30</Button>
                <Button size={'sm'} onClick={() => moveTimeHour(1)}>+1</Button>
            </Flex>
        </Flex>
    )
}

export default VideoController;
