// contexts/AuthContext.tsx - FIX THIS
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: string;
  subscriberCount: number;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  notifications: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }
    
    try {
      // 🔥 FIX: Email se user find karo, ID se nahi
      const res = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
      
      if (res.ok) {
        const userData = await res.json();
        setUser({
          ...userData,
          id: userData._id.toString()
        });
      } else {
        // User nahi mila to naya banao
        console.log("User not found, creating...");
        const createRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            password: Math.random().toString(36),
            name: session.user.name || session.user.email?.split('@')[0],
            avatar: session.user.image || "",
          }),
        });
        
        if (createRes.ok) {
          const newUser = await createRes.json();
          setUser({
            ...newUser,
            id: newUser._id || newUser.id
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    
    if (session?.user) {
      fetchUser();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status]);

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};