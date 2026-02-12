// app/components/Sidebar.tsx
"use client";
import { 
  FiHome, FiTrendingUp, FiVideo, FiClock, 
  FiThumbsUp, FiSettings, FiHelpCircle, 
  FiLogOut, FiFolder, FiStar 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { id: "all", label: "Home", icon: FiHome },
    { id: "trending", label: "Trending", icon: FiTrendingUp },
    { id: "recent", label: "Recent", icon: FiClock },
    { id: "liked", label: "Liked Videos", icon: FiThumbsUp },
    { id: "collections", label: "Collections", icon: FiFolder },
    { id: "saved", label: "Saved", icon: FiStar },
  ];

  const bottomMenu = [
    { id: "settings", label: "Settings", icon: FiSettings },
    { id: "help", label: "Help", icon: FiHelpCircle },
    { id: "logout", label: "Logout", icon: FiLogOut },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col"
    >
      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onCategoryChange(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === item.id
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <item.icon className="text-lg" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        {bottomMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => item.id === 'logout' && router.push('/login')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <item.icon className="text-lg" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.aside>
  );
}