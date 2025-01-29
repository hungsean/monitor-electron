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
} from "@/components/chakra-ui/dialog"
import { useStore } from "@/utils/store";
import TimeManager from "@/utils/time-manager";
import { Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";

const EditDialog = () => {
    const [start_time_string, setStartTimeString] = useState('');
    const [end_time_string, setEndTimeString] = useState('');
    const { data, setData } = useStore();

    useEffect(() => {
        setStartTimeString(data.START_REAL_TIME?.toString() ?? '');
    }, [data.START_REAL_TIME]);

    useEffect(() => {
        setEndTimeString(data.END_REAL_TIME?.toString() ?? '');
    }, [data.END_REAL_TIME]);

    function updateTime(): void{
        const start_time = new TimeManager(start_time_string);
        const end_time = new TimeManager(end_time_string);
        setData({ START_REAL_TIME: start_time });
        setData({ END_REAL_TIME: end_time });
    }


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
                                value={start_time_string}
                                onChange={(e) => setStartTimeString(e.target.value)}
                            />
                        </Flex>
                        <Flex flex={'1'} direction={'column'}>
                            <Text>End time</Text>
                            <Input
                                value={end_time_string}
                                onChange={(e) => setEndTimeString(e.target.value)}
                            />
                        </Flex>
                    </Flex>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                        <Button onClick={() => updateTime()}>Save</Button>
                    </DialogActionTrigger>
                    
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default EditDialog;