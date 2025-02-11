import { EVENT_TYPES, eventBus } from "@/utils/event-bus";
import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { CiSaveUp2 } from "react-icons/ci";
import { useAppStore } from "@/utils/store";
import TimeManager from "@/utils/time-manager";


const OpenFileButton = () => {

    const { setData } = useAppStore();

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
            const [start_datetime_string, end_datetime_string] = filename_split.slice(-2);
            console.log("start time", start_datetime_string);
            console.log("end time", end_datetime_string);
            const start_time_string = start_datetime_string.split('T')[1];
            const end_time_string = end_datetime_string.split('T')[1];
            const start_time = new TimeManager(start_time_string);
            const end_time = new TimeManager(end_time_string);

            if (start_time.isLaterThan(end_time))
            {
                end_time.addHours(24);
            }
            console.log("realtime update");
            setData({ START_REAL_TIME: start_time });
            setData({ END_REAL_TIME: end_time });

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
                <CiSaveUp2 /> open file
            </Button>
        </>
    )
}
    
export default OpenFileButton;