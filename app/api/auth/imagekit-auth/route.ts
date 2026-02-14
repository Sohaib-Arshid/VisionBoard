// app/api/imagekit-auth/route.ts
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET() {
  try {
    console.log("🔧 ImageKit Auth API called");
    console.log("📌 Public Key:", process.env.NEXT_PUBLIC_PUBLIC_KEY?.substring(0, 5) + "...");
    console.log("📌 URL Endpoint:", process.env.NEXT_PUBLIC_URL_ENDPOINT);
    

    if (!process.env.NEXT_PUBLIC_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_URL_ENDPOINT) {
      console.error("❌ Missing ImageKit environment variables");
      return NextResponse.json(
        { error: "ImageKit configuration missing" },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
    });

    const authParams = imagekit.getAuthenticationParameters();
    
    console.log("✅ Auth params generated successfully");
    
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("❌ ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}