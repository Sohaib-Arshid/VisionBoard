// components/FileUpload.tsx
"use client";
import { IKUpload } from "imagekitio-next";
import { UploadResponse } from "imagekitio-next";
import { FiUploadCloud } from "react-icons/fi";
import { useState, useRef } from "react";

interface FileUploadProps {
  fileType: "image" | "video" | "all";
  onSuccess: (res: UploadResponse) => void;
  onUploadStart?: () => void;
  onFileSelect?: (file: File) => void;
}

export default function FileUpload({ 
  fileType, 
  onSuccess, 
  onUploadStart,
  onFileSelect 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const acceptTypes = {
    image: "image/*",
    video: "video/*",
    all: "image/*,video/*",
  }[fileType];

  const onError = (err: UploadResponse) => {
    console.error("Upload error:", err);
    alert("Upload failed: " + (err.message || "Unknown error"));
  };

  const handleClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      className="relative"
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={() => setIsDragging(false)}
    >
      <IKUpload
        ref={uploadRef}
        fileName={`vision-${Date.now()}`}
        onError={onError}
        onSuccess={onSuccess}
        onUploadStart={onUploadStart}
        onChange={handleFileChange}
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
        folder={`/users/${typeof window !== 'undefined' ? localStorage.getItem('userId') : 'anonymous'}/uploads`}
      />

      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <FiUploadCloud className="text-4xl text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {fileType === "image" ? "PNG, JPG, GIF up to 50MB" : 
           fileType === "video" ? "MP4, WebM up to 100MB" : 
           "Images & Videos up to 100MB"}
        </p>
      </button>
    </div>
  );
}