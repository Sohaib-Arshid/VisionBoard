// app/components/Navbar.tsx
"use client";
import { FiUpload, FiBell, FiSearch, FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

interface NavbarProps {
  onUploadClick: () => void;
}

export default function Navbar({ onUploadClick }: NavbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-40"
    >
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <FiMenu className="text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">VB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
            Vision Board
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className={`
            relative flex items-center bg-gray-100 dark:bg-gray-800 
            rounded-full border-2 transition-all
            ${isSearchFocused ? 'border-blue-500 bg-white dark:bg-gray-900' : 'border-transparent'}
          `}>
            <FiSearch className="absolute left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onUploadClick}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
          >
            <FiUpload />
            <span className="hidden sm:inline">Upload</span>
          </button>
          
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
            <FiBell className="text-gray-700 dark:text-gray-300 text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}