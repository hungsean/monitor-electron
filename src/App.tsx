import { Button, Flex } from '@chakra-ui/react'
import '@/App.css'

import OpenFileButton from './components/ui/open-file-button'
import VideoController from './components/ui/video-controller'
import EditDialog from './components/ui/edit-dialog'
import VideoMain from './components/ui/video-main'

function App() {
    

    const VideoHeader = () => {
        return (
            <Flex width={'100%'} justify={'space-between'} padding={'15px'}>
                <Flex flex={'1'} justify={'flex-start'}>
                    <OpenFileButton/>
                </Flex>
                <Flex flex={'1'} justify={'center'}>
                    <VideoController/>
                </Flex>
                <Flex flex={'1'} justify={'flex-end'} gap={'2'}>
                    <EditDialog/>
                    <Button>dark mode</Button>
                </Flex>
            </Flex>
        )
    }


    return (
        <Flex direction={'column'}>
            <VideoHeader></VideoHeader>
            <VideoMain/>
        </Flex>
    )
}

export default App
