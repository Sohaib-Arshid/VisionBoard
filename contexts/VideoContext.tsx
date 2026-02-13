// contexts/VideoContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Video {
  _id?: string;
  fileId: string;
  userId: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: string;
  size: number;
  fileType: string;
  views: number;
  likeCount: number;
  likes: string[];
  category: string;
  tags: string[];
  uploadedAt: string;
}

interface VideoContextType {
  videos: Video[];
  isLoading: boolean;
  uploadVideo: (file: File, metadata: Partial<Video>) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  likeVideo: (videoId: string) => Promise<void>;
  unlikeVideo: (videoId: string) => Promise<void>;
  getUserVideos: (userId: string) => Promise<Video[]>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchVideos();
    } else {
      setVideos([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchVideos = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(`/api/videos?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || data);
      }
    } catch  {
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVideo = async (file: File, metadata: Partial<Video>) => {
    if (!user?.id) throw new Error("User not authenticated");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);
    formData.append("title", metadata.title || file.name);
    formData.append("description", metadata.description || "");
    formData.append("category", metadata.category || "Other");
    formData.append("tags", JSON.stringify(metadata.tags || []));

    const res = await fetch("/api/videos", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Upload failed");
    }

    const newVideo = await res.json();
    setVideos(prev => [newVideo, ...prev]);
    await fetchVideos();
  };

  const deleteVideo = async (videoId: string) => {
    if (!user?.id) throw new Error("User not authenticated");

    const res = await fetch(`/api/videos/${videoId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setVideos(prev => prev.filter(v => v._id !== videoId && v.fileId !== videoId));
    }
  };

  const likeVideo = async (videoId: string) => {
    if (!user?.id) throw new Error("User not authenticated");

    const res = await fetch(`/api/videos/${videoId}/like`, {
      method: "POST",
    });

    if (res.ok) {
      setVideos(prev => prev.map(v => 
        v._id === videoId || v.fileId === videoId
          ? { ...v, likeCount: v.likeCount + 1, likes: [...v.likes, user.id] }
          : v
      ));
    }
  };

  const unlikeVideo = async (videoId: string) => {
    if (!user?.id) throw new Error("User not authenticated");

    const res = await fetch(`/api/videos/${videoId}/like`, {
      method: "DELETE",
    });

    if (res.ok) {
      setVideos(prev => prev.map(v => 
        v._id === videoId || v.fileId === videoId
          ? { ...v, likeCount: Math.max(0, v.likeCount - 1), likes: v.likes.filter(id => id !== user.id) }
          : v
      ));
    }
  };

  const getUserVideos = async (userId: string) => {
    try {
      const res = await fetch(`/api/videos?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        return data.videos || data;
      }
      return [];
    } catch  {
      return [];
    }
  };

  return (
    <VideoContext.Provider value={{
      videos,
      isLoading,
      uploadVideo,
      deleteVideo,
      likeVideo,
      unlikeVideo,
      getUserVideos,
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideos must be used within a VideoProvider");
  }
  return context;
};