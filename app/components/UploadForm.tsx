// app/components/UploadModal.tsx
"use client";
import { UploadResponse } from "imagekitio-next";
import FileUpload from "./FileUpload";
import { motion } from "framer-motion";
import { FiX, FiVideo, FiImage } from "react-icons/fi";
import { useState } from "react";

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (res: UploadResponse) => void;
}

export default function UploadForm({ onClose, onUploadSuccess }: UploadModalProps) {
  const [uploadType, setUploadType] = useState<"image" | "video">("video");
  const [isUploading, setIsUploading] = useState(false);

  const handleSuccess = (res: UploadResponse) => {
    setIsUploading(false);
    onUploadSuccess(res);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload to Jengo
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Upload Type Selector */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setUploadType("video")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                uploadType === "video"
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FiVideo className={`text-2xl mb-2 ${
                uploadType === "video" ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                uploadType === "video" ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Video
              </span>
            </button>
            
            <button
              onClick={() => setUploadType("image")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                uploadType === "image"
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FiImage className={`text-2xl mb-2 ${
                uploadType === "image" ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                uploadType === "image" ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Image
              </span>
            </button>
          </div>

          {/* File Upload Component */}
          <FileUpload
            fileType={uploadType}
            onSuccess={handleSuccess}
            onUploadStart={() => setIsUploading(true)}
          />

          {/* Upload Tips */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Tips for better uploads
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Use high-quality MP4 or WebM format for videos</li>
              <li>• Images should be at least 1280x720 for best quality</li>
              <li>• Maximum file size: 100MB for videos, 50MB for images</li>
              <li>• Supported formats: MP4, WebM, JPG, PNG, GIF</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}