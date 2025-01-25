import { Box, Button, Center, Code, Flex } from '@chakra-ui/react'
import { ClipboardIconButton, ClipboardRoot } from "@/components/ui/clipboard"
import '@/App.css'

function App() {

    const VideoController = () => {

        const nowTime = new Date().toLocaleString();
        return (
            <Flex direction={'column'}>
                <Flex>
                    <Code>{"time this "}</Code>
                    <ClipboardRoot value={nowTime} timeout={300}>
                        <ClipboardIconButton />
                    </ClipboardRoot>
                </Flex>
            </Flex>
        )
    }

    const VideoHeader = () => {
        return (
            <Flex width={'100%'} justify={'space-between'} gap={'4'}>
                <Button>test</Button>
                <Center>
                    <Box borderWidth={'1px'} >
                        <VideoController></VideoController>
                    </Box>
                </Center>
                
                <Button>dark mode</Button>
            </Flex>
        )
    }    


    return (
        <Flex direction={'column'}>
            <VideoHeader></VideoHeader>
            <video></video>
        </Flex>
    )
}

export default App
