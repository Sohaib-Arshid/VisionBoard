// components/Navbar.tsx
"use client";
import { useState } from "react";
import { FiUpload, FiBell, FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onUploadClick: () => void;
  user: any;
}

export default function Navbar({ onUploadClick, user }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-40">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            Jengo
          </span>
        </div>

        <div className="flex-1 max-w-2xl mx-4">
          <div className={`relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-full border-2 transition-all ${isSearchFocused ? 'border-blue-500 bg-white dark:bg-gray-900' : 'border-transparent'}`}>
            <FiSearch className="absolute left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your videos..."
              className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

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
            {user.notifications > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-xs flex items-center justify-center text-white border-2 border-white dark:border-gray-900">
                {user.notifications}
              </span>
            )}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1.5 transition-colors"
            >
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name || user.email?.split('@')[0]}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FiUser className="mr-2" />
                  Profile
                </button>
                
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}