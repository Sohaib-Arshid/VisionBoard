// components/VideoCard.tsx
"use client";
import { useState } from "react";
import { FiEye, FiThumbsUp, FiClock, FiTrash2 } from "react-icons/fi";
import { useVideos } from "@/contexts/VideoContext";
import { useRouter } from "next/navigation";

interface VideoCardProps {
  video: any;
  currentUserId: string;
  onDelete: (id: string) => Promise<void>;
}

export default function VideoCard({ video, currentUserId, onDelete }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { likeVideo, unlikeVideo } = useVideos();
  const router = useRouter();

  const isLiked = video.likes?.includes(currentUserId);
  const likeCount = video.likeCount || video.likes?.length || 0;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      await unlikeVideo(video._id || video.fileId);
    } else {
      await likeVideo(video._id || video.fileId);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this video?')) {
      setIsDeleting(true);
      await onDelete(video._id || video.fileId);
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    router.push(`/video/${video._id || video.fileId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-video bg-gray-900">
        {video.fileType?.startsWith("image") ? (
          <img 
            src={video.url} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video 
            src={video.url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay={isHovered}
          />
        )}
        
        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
          {video.duration || "0:00"}
        </span>

        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:scale-110 transition-transform">
              <FiEye className="text-xl" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
              {video.title || "Untitled Video"}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {formatDate(video.uploadedAt)}
            </p>
            
            <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <FiEye className="mr-1" />
                {video.views?.toLocaleString() || 0}
              </span>
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${isLiked ? 'text-red-600' : ''}`}
              >
                <FiThumbsUp className={isLiked ? 'fill-current' : ''} />
                <span>{likeCount}</span>
              </button>
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {video.duration || "0:00"}
              </span>
            </div>
          </div>

          {currentUserId === video.userId && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FiTrash2 className={isDeleting ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}