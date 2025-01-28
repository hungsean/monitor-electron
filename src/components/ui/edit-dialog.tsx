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
import { Button, Flex, IconButton, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";

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

export default EditDialog;