// components/FileUpload.tsx
"use client";
import { IKUpload } from "imagekitio-next";
import { FiUploadCloud } from "react-icons/fi";
import { useState, useRef } from "react";

interface FileUploadProps {
  fileType: "image" | "video" | "all";
  onSuccess: (res: any) => void;
  onUploadStart?: () => void;
}

export default function FileUpload({ 
  fileType, 
  onSuccess, 
  onUploadStart 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadRef = useRef<any>(null);

  const acceptTypes = {
    image: "image/*",
    video: "video/*",
    all: "image/*,video/*",
  }[fileType];

  const onError = (err: any) => {
    console.error("❌ Upload error:", err);
    setIsUploading(false);
    
    let errorMessage = "Upload failed: ";
    if (err?.message?.includes("404")) {
      errorMessage = "Authentication server not found. Please check configuration.";
    } else if (err?.message?.includes("authenticator")) {
      errorMessage = "Authentication configuration error.";
    } else {
      errorMessage += err?.message || "Unknown error";
    }
    
    alert(errorMessage);
  };

  const handleSuccess = (res: any) => {
    console.log("✅ Upload success:", res);
    setIsUploading(false);
    onSuccess(res);
  };

  const handleUploadStart = () => {
    console.log("📤 Upload started");
    setIsUploading(true);
    onUploadStart?.();
  };

  return (
    <div className="relative">
      <IKUpload
        ref={uploadRef}
        fileName={`vision-${Date.now()}`}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleUploadStart}
        validateFile={(file: File) => {
          const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
          if (file.size > maxSize) {
            alert(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
            return false;
          }
          return true;
        }}
        className="hidden"
        id="ik-upload"
        accept={acceptTypes}
        useUniqueFileName={true}
        folder="/uploads"
      />

      <button
        type="button"
        onClick={() => uploadRef.current?.click()}
        disabled={isUploading}
        className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <FiUploadCloud className={`text-4xl mb-3 ${isUploading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
        <p className="text-sm font-medium text-gray-700">
          {isUploading ? (
            <span className="text-blue-600">Uploading...</span>
          ) : (
            <>
              <span className="text-blue-600">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF up to 50MB
        </p>
      </button>
    </div>
  );
}