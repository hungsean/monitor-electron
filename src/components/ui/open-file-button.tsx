import { Button } from "@chakra-ui/react";
import { CiSaveUp2 } from "react-icons/ci";
import { useFileHandler } from "@/hook/use-file-handler";

const OpenFileButton = () => {
    const { fileInputRef, handleFileChange, handleUploadClick } = useFileHandler();

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".mp4,video/mp4"
                style={{ display: 'none' }}
                multiple
            />
            <Button onClick={handleUploadClick}>
                <CiSaveUp2 /> open file
            </Button>
        </>
    );
};

export default OpenFileButton;