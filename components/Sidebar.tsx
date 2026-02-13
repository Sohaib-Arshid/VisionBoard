// components/Sidebar.tsx
"use client";
import { 
  FiHome, FiClock, FiThumbsUp, FiFolder, 
  FiStar, FiSettings, FiHelpCircle, FiLogOut
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  user: any;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Sidebar({ user, selectedCategory, onCategoryChange }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { id: "all", label: "Home", icon: FiHome },
    { id: "recent", label: "Recent", icon: FiClock },
    { id: "liked", label: "Liked Videos", icon: FiThumbsUp },
    { id: "collections", label: "Collections", icon: FiFolder },
    { id: "saved", label: "Saved", icon: FiStar },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center space-x-3">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name?.charAt(0) || user.email?.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

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
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiSettings className="text-lg" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        
        <button
          onClick={() => router.push('/help')}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiHelpCircle className="text-lg" />
          <span className="text-sm font-medium">Help</span>
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}