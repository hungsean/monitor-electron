import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { CiSaveUp2 } from "react-icons/ci";


const OpenFileButton = () => {

    // temp testing function
    // const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

    const fileInputRef = useRef<HTMLInputElement>(null);
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            eventBus.emit(EVENT_TYPES.UPDATE_VIDEO_URL, url)
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

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
    
export default OpenFileButton;