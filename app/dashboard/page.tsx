"use client";
import { UploadResponse } from "@imagekit/next";
import FileUpload from "../components/FileUpload";

export default function DashboardPage() {
  
  const handleUploadSuccess = (res: UploadResponse) => {
    console.log("File Uploaded Successfully:", res.url);
    alert("File uploaded to ImageKit!");
  };

  const handleProgress = (progress: number) => {
    console.log(`Upload progress: ${progress}%`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-red-500">Vision Board Dashboard</h1>
      
      <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-800 w-full max-w-md">
        <h2 className="text-xl mb-4">Upload New Media</h2>
        
        {/* Aapka component yahan use ho raha hai */}
        <FileUpload 
          fileType="image" 
          onSuccess={handleUploadSuccess} 
          onProgress={handleProgress}
        />
        
        <p className="mt-4 text-sm text-zinc-500">
          Supported formats: Images (JPG, PNG) and Videos (Max 100MB)
        </p>
      </div>
    </div>
  );
}