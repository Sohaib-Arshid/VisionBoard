// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers"; // ✅ Default import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vision Board",
  description: "Your vision board application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* ✅ This should work now */}
          {children}
        </Providers>
      </body>
    </html>
  );
}