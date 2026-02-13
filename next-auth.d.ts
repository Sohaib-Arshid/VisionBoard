// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      totalVideos?: number;
      totalViews?: number;
      totalLikes?: number;
      subscribers?: number;
      notifications?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}