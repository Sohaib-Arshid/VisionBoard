// app/components/VideoGrid.tsx
"use client";
import { FiEye, FiThumbsUp, FiClock, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

interface VideoGridProps {
  videos: UploadResponse[];
  onDelete: (fileId: string) => void;
}

export default function VideoCard({ videos, onDelete }: VideoGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (videos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full flex flex-col items-center justify-center py-16 px-4"
      >
       
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No videos yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          Upload your first video to start building your collection
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <motion.div
          key={video.fileId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-xl"
          onMouseEnter={() => setHoveredId(video.fileId)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-900">
            {video.fileType?.startsWith("image") ? (
              <img 
                src={video.url} 
                alt={video.name || "Video thumbnail"}
                className="w-full h-full object-cover"
              />
            ) : (
              <video 
                src={video.url}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                autoPlay={hoveredId === video.fileId}
              />
            )}
            
            {/* Duration Badge */}
            <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
              {video.duration || "3:45"}
            </span>

            {/* Hover Overlay */}
            {hoveredId === video.fileId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
              >
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:scale-110 transition-transform">
                  <FiEye className="text-xl" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                  {video.name || "Untitled Video"}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {video.uploadedAt ? new Date(video.uploadedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Just now'}
                </p>
                
                {/* Stats */}
                <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <FiEye className="mr-1" />
                    {video.views?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center">
                    <FiThumbsUp className="mr-1" />
                    {video.likes || 0}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" />
                    {video.duration || "3:45"}
                  </span>
                </div>
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <FiMoreVertical />
                </button>
                
                {/* Dropdown Menu - Simplified */}
                <button
                  onClick={() => onDelete(video.fileId)}
                  className="absolute top-0 right-0 p-1 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}