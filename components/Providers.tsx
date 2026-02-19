// components/Providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "imagekitio-next";
import { AuthProvider } from "@/contexts/AuthContext";
import { VideoProvider } from "@/contexts/VideoContext";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      console.log("🔑 Fetching from /api/auth/imagekit-auth");
      const response = await fetch("/api/auth/imagekit-auth"); 
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Authenticator error:", error);
      throw error;
    }
  };

  return (
    <SessionProvider>
      <ImageKitProvider 
        publicKey={publicKey} 
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <AuthProvider>
          <VideoProvider>
            {children}
          </VideoProvider>
        </AuthProvider>
      </ImageKitProvider>
    </SessionProvider>
  );
}