// app/dashboard/page.tsx
"use client";
import { UploadResponse } from "imagekitio-next";
import FileUpload from "../components/FileUpload";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import UploadForm from "../components/UploadForm";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiVideo, FiTrendingUp, FiClock, FiThumbsUp, 
  FiPlayCircle, FiCamera, FiFilm, FiUsers 
} from "react-icons/fi";

export default function DashboardPage() {
  const [uploadedVideos, setUploadedVideos] = useState<UploadResponse[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 12453,
    totalLikes: 892,
    subscribers: 1234
  });

  useEffect(() => {
    // Load saved videos from localStorage
    const savedVideos = localStorage.getItem("jengoVideos");
    if (savedVideos) {
      setUploadedVideos(JSON.parse(savedVideos));
    }
    setIsLoading(false);
  }, []);

  const handleUploadSuccess = (res: UploadResponse) => {
    const newVideo = {
      ...res,
      uploadedAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      duration: "3:45"
    };
    
    setUploadedVideos(prev => [newVideo, ...prev]);
    localStorage.setItem("jengoVideos", JSON.stringify([newVideo, ...uploadedVideos]));
    setIsUploadModalOpen(false);
  };

  const handleDeleteVideo = (fileId: string) => {
    const updated = uploadedVideos.filter(video => video.fileId !== fileId);
    setUploadedVideos(updated);
    localStorage.setItem("jengoVideos", JSON.stringify(updated));
  };

  const categories = [
    { id: "all", label: "All", icon: FiFilm },
    { id: "trending", label: "Trending", icon: FiTrendingUp },
    { id: "recent", label: "Recent", icon: FiClock },
    { id: "liked", label: "Most Liked", icon: FiThumbsUp },
  ];

  const filteredVideos = () => {
    if (selectedCategory === "recent") {
      return [...uploadedVideos].sort((a, b) => 
        new Date(b.uploadedAt || "").getTime() - new Date(a.uploadedAt || "").getTime()
      );
    }
    if (selectedCategory === "liked") {
      return [...uploadedVideos].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return uploadedVideos;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Navbar - Fixed at top */}
      <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <div className="flex pt-16">
        {/* Sidebar - Fixed on left */}
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 lg:p-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-between p-8">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">Welcome to Jengo</h1>
                  <p className="text-lg text-white/90 mb-4">Your creative video platform</p>
                  <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <FiVideo className="mr-2" />
                    Upload Your First Video
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

          {/* Stats Cards */}
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
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% this week</p>
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
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 8% this week</p>
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
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 15% this month</p>
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
                    {uploadedVideos.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCamera className="text-green-600 dark:text-green-400 text-xl" />
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">+{uploadedVideos.length} total</p>
            </motion.div>
          </div>

          {/* Category Tabs */}
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

          {/* Video Grid */}
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
            <VideoCard
              videos={filteredVideos()} 
              onDelete={handleDeleteVideo}
            />
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <UploadForm
            onClose={() => setIsUploadModalOpen(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}