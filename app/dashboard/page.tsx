// app/dashboard/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVideos } from "@/contexts/VideoContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import UploadModal from "@/components/UploadModel";
import { motion } from "framer-motion";
import { 
  FiVideo, FiTrendingUp, FiClock, FiThumbsUp, 
  FiPlayCircle, FiCamera, FiFilm, FiUsers 
} from "react-icons/fi";

export default function DashboardPage() {
  const { user } = useAuth();
  const { videos, isLoading, deleteVideo } = useVideos();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const stats = {
    totalVideos: videos.length,
    totalViews: videos.reduce((acc, v) => acc + (v.views || 0), 0),
    totalLikes: videos.reduce((acc, v) => acc + (v.likeCount || 0), 0),
    subscribers: user?.subscriberCount || 0
  };

  const filteredVideos = () => {
    if (selectedCategory === "recent") {
      return [...videos].sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    }
    if (selectedCategory === "liked") {
      return [...videos].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    }
    return videos;
  };

  const categories = [
    { id: "all", label: "All", icon: FiFilm },
    { id: "recent", label: "Recent", icon: FiClock },
    { id: "liked", label: "Most Liked", icon: FiThumbsUp },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Navbar onUploadClick={() => setIsUploadModalOpen(true)} user={user} />
      
      <div className="flex pt-16">
        <Sidebar 
          user={user}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <main className="flex-1 ml-64 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-between p-8">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user.name || user.email?.split('@')[0]}!
                  </h1>
                  <p className="text-lg text-white/90 mb-4">
                    You have {videos.length} video{videos.length !== 1 ? 's' : ''} in your collection
                  </p>
                  <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <FiVideo className="mr-2" />
                    Upload New Video
                  </button>
                </div>
                <div className="hidden lg:block">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
                      <p className="text-sm text-white/70">Videos</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <p className="text-2xl font-bold text-white">{stats.subscribers}</p>
                      <p className="text-sm text-white/70">Subscribers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiPlayCircle className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalLikes.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FiThumbsUp className="text-red-600 dark:text-red-400 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.subscribers.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiUsers className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalVideos}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCamera className="text-green-600 dark:text-green-400 text-xl" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <category.icon className="text-sm" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
                  <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos().map((video, index) => (
                <VideoCard 
                  key={video._id || video.fileId} 
                  video={video}
                  currentUserId={user.id}
                  onDelete={deleteVideo}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {isUploadModalOpen && (
        <UploadModal
          user={user}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}