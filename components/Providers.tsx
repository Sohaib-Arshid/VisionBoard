// components/Providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { VideoProvider } from "@/contexts/VideoContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <VideoProvider>
            {children}
          </VideoProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}