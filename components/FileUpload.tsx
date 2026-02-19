// components/FileUpload.tsx
'use client';

import { IKContext, IKUpload } from 'imagekitio-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { data: session } = useSession();

  // Debug: Check environment variables
  console.log("🔍 Public Key from env:", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
  console.log("🔍 URL Endpoint from env:", process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);

  const onError = (err: any) => {
    console.error("❌ Upload error details:", err);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const onSuccess = (res: any) => {
    console.log("✅ Upload successful:", res);
    setIsUploading(false);
    setUploadProgress(100);
    window.location.reload();
  };

  const onUploadProgress = (progress: any) => {
    console.log("📤 Upload progress:", progress);
    setUploadProgress((progress.loaded / progress.total) * 100);
  };

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: ImageKit configuration missing. Please check environment variables.
      </div>
    );
  }

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticationEndpoint="/api/auth/imagekit-auth"
    >
      <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
        <IKUpload
          fileName={`vision-${Date.now()}`}
          folder={`/users/${session?.user?.id || 'anonymous'}`}
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          accept="image/*"
          validateFile={(file) => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
              alert('Only images are allowed!');
              return false;
            }
            if (file.size > 50 * 1024 * 1024) {
              alert('File size should be less than 50MB');
              return false;
            }
            return true;
          }}
          className="w-full p-8 cursor-pointer text-gray-600 dark:text-gray-300"
          useUniqueFileName={true}
          tags={['vision-board']}
        />
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          PNG, JPG, GIF up to 50MB
        </p>
        
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </div>
    </IKContext>
  );
}