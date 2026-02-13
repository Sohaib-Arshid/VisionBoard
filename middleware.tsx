// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        
        const publicRoutes = [
          "/",
          "/login",
          "/register",
          "/api/auth",
          "/api/register",
          "/api/imagekit-auth",
          "/api/videos",
          "/api/video",
        ];
        
        if (publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + "/")
        )) {
          return true;
        }
        
        return !!token;
      }
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};