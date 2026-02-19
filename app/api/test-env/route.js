// app/api/test-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    publicKeyExists: !!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKeyExists: !!process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpointExists: !!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    publicKeyPrefix: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY?.substring(0, 10),
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  });
}