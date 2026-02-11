"use client"
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUplodeProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType: "image" | "video"

}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUplodeProps) => {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("please upload a valid video file")
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("File size must be less then 100 MB")
            }
            return true
        }

        const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>)=>{
            const file = e.target.files.[0];
            if(!file || !validateFile(file))return

            setUploading(true);
            setError(null)

            try {
                await fetch("/api/auth/imagekit-auth")
            } catch (error) {
                
            }
        }

        return (
            <>
                <input type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                />
            </>
        );
    };

    export default FileUpload;