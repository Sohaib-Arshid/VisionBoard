// components/FileUpload.tsx
'use client';

import { IKContext, IKUpload } from 'imagekitio-next';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { data: session } = useSession();

  const onError = (err: any) => {
    console.error("❌ Upload error details:", {
      message: err?.message,
      response: err?.response,
      stack: err?.stack,
      raw: err
    });
    setIsUploading(false);
    setUploadProgress(0);
  };

  const onSuccess = (res: any) => {
    console.log("✅ Upload successful:", res);
    setIsUploading(false);
    setUploadProgress(100);
    // Refresh videos list
    window.location.reload(); // Temporary: refresh page to show new video
  };

  const onUploadProgress = (progress: any) => {
    console.log("📤 Upload progress:", progress);
    setUploadProgress(progress.loaded / progress.total * 100);
  };

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticationEndpoint="/api/auth/imagekit-auth"
    >
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <IKUpload
          fileName={`vision-${Date.now()}`}
          folder={`/users/${session?.user?.id}`}
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          accept="image/*"
          validateFile={(file) => file.size < 5 * 1024 * 1024} // 5MB limit
          className="w-full p-4 cursor-pointer"
          useUniqueFileName={true}
          tags={['vision-board']}
        />
        
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>
    </IKContext>
  );
}