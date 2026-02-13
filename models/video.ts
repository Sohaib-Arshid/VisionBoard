// models/Video.ts
import mongoose, { Schema, model, models } from "mongoose";

export const Video_dimension = {
    height: 1080,
    width: 1920
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;      // spelling mistake thi
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;       // control nahi, controls
    transformation?: {
        height: number;
        width: number;
        quality: number;
    };
    userId: mongoose.Types.ObjectId | string;  
    views: number;            
    likes: string[];          
    likeCount: number;        
    duration: string;         
    fileId: string;           
    fileType: string;         
    size: number;             
    category: string;        
    tags: string[];          
    status: "processing" | "ready" | "failed";
}

const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true, default: "" },  // description
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true, default: "" },
        controls: { type: Boolean, default: true },  // controls
        transformation: {
            height: { type: Number, default: Video_dimension.height },
            width: { type: Number, default: Video_dimension.width },
            quality: { type: Number, default: 80, min: 1, max: 100 }
        },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        views: { type: Number, default: 0 },
        likes: [{ type: String }],
        likeCount: { type: Number, default: 0 },
        duration: { type: String, default: "0:00" },
        fileId: { type: String, required: true, unique: true },
        fileType: { type: String, required: true },
        size: { type: Number, required: true },
        category: { type: String, default: "Other" },
        tags: [{ type: String }],
        status: { type: String, enum: ["processing", "ready", "failed"], default: "ready" }
    },
    {
        timestamps: true
    }
);

// Indexes for faster queries
videoSchema.index({ userId: 1, createdAt: -1 });
videoSchema.index({ category: 1 });
videoSchema.index({ views: -1 });

const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;