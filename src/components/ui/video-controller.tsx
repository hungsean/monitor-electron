import { Box, Center, Text, Flex, Button } from "@chakra-ui/react";
import { ClipboardRoot, ClipboardIconButton } from "../chakra-ui/clipboard";

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

export default VideoController;
