// app/api/auth/imagekit-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET(req: NextRequest) {
  try {
    console.log("🔧 ImageKit Auth API called");
    
    // Check environment variables with CORRECT names
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    
    console.log("Public Key exists:", !!publicKey);
    console.log("Private Key exists:", !!privateKey);
    console.log("URL Endpoint exists:", !!urlEndpoint);
    
    // Log first few characters for verification
    if (publicKey) console.log("📌 Public Key starts with:", publicKey.substring(0, 10) + '...');
    if (urlEndpoint) console.log("📌 URL Endpoint:", urlEndpoint);
    
    // Validate environment variables
    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("❌ Missing ImageKit environment variables:", {
        publicKey: !!publicKey,
        privateKey: !!privateKey,
        urlEndpoint: !!urlEndpoint
      });
      
      return NextResponse.json(
        { error: 'ImageKit configuration missing' },
        { status: 500 }
      );
    }

    // Initialize ImageKit
    const imagekit = new ImageKit({
      publicKey: publicKey,
      privateKey: privateKey,
      urlEndpoint: urlEndpoint
    });

    // Generate authentication parameters
    const authParams = imagekit.getAuthenticationParameters();
    
    console.log("✅ Auth params generated successfully");
    
    return NextResponse.json(authParams, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      },
    });
  } catch (error) {
    console.error("❌ ImageKit Auth error:", error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}