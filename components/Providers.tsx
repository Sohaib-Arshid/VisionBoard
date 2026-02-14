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
      console.log("🔑 Fetching ImageKit auth...");
      
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXTAUTH_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/imagekit-auth`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Auth response:", response.status, errorText);
        throw new Error(`Authentication failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Auth data received:", data);
      
      return {
        signature: data.signature,
        expire: data.expire,
        token: data.token
      };
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