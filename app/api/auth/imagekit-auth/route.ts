// app/api/auth/imagekit-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ImageKit from '@imagekit/nodejs';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
});

export async function GET(req: NextRequest) {
  try {
    console.log("ImageKit Auth API called");
    console.log("Public Key:", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.substring(0, 5) + '...');
    console.log("URL Endpoint:", process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);

    // Generate authentication parameters
    const authParams = imagekit.getAuthenticationParameters();
    
    console.log("✅ Auth params generated successfully");
    
    return NextResponse.json(authParams, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error("ImageKit Auth error:", error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}