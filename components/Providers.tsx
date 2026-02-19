// components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { IKContext } from "imagekitio-react";
import { AuthProvider } from "@/contexts/AuthContext";
import { VideoProvider } from "@/contexts/VideoContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

// ✅ Make sure this is a default export
export default function Providers({ children }: ProvidersProps) {
  console.log("🔧 Providers mounted"); // Debug log
  
  return (
    <SessionProvider>
      <IKContext
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        authenticationEndpoint="/api/auth/imagekit-auth"
      >
        <AuthProvider>
          <VideoProvider>
            {children}
          </VideoProvider>
        </AuthProvider>
      </IKContext>
    </SessionProvider>
  );
}