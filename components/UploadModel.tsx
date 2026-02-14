// components/UploadModal.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiVideo, FiImage } from "react-icons/fi";
import FileUpload from "./FileUpload";

interface UploadModalProps {
  user: any;
  onClose: () => void;
}

export default function UploadModal({ user, onClose }: UploadModalProps) {
  const [uploadType, setUploadType] = useState<"image" | "video">("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const categories = [
    "Education", "Entertainment", "Music", "Gaming",
    "Technology", "Travel", "Food", "Sports", "Other"
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileUploadSuccess = (res: any) => {
    console.log("File uploaded to ImageKit:", res);
    setUploadedFileUrl(res.url);
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!uploadedFileUrl) {
      alert("Please wait for file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const videoData = {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        fileId: `file-${Date.now()}`,
        url: uploadedFileUrl,
        userId: user.id,
        fileType: uploadType,
      };

      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });

      if (res.ok) {
        onClose();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save video");
      }
    } catch (error: any) {
      alert(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload New Video
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Share your content with the world
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiX className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
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
                type="button"
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

            <FileUpload
              fileType={uploadType}
              onSuccess={handleFileUploadSuccess}
              onUploadStart={() => setIsUploading(true)}
              onFileSelect={handleFileSelect}
            />

            {selectedFile && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all text-gray-900 dark:text-white"
                    placeholder="Video title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all text-gray-900 dark:text-white resize-none"
                    placeholder="Describe your video..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all text-gray-900 dark:text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all text-gray-900 dark:text-white"
                      placeholder="comma, separated, tags"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !selectedFile || !uploadedFileUrl}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}