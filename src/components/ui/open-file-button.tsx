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
            console.log(file.name);
            const url = URL.createObjectURL(file);
            const filename_no_ext = file.name.split('.')[0];
            const filename_split = filename_no_ext.split('_');
            console.log(filename_split);
            const [start_time, end_time] = filename_split.slice(-2);
            console.log("start time", start_time);
            console.log("end time", end_time);

            eventBus.emit(EVENT_TYPES.UPDATE_VIDEO_URL, url);
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
                accept=".mp4,video/mp4"
                style={{ display: 'none' }}
            />
            <Button onClick={handleUploadClick}>
                <CiSaveUp2 /> Upload file
            </Button>
        </>
    )
}
    
export default OpenFileButton;