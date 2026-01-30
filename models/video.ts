// import librarys
import mongoose, { Schema, model, models } from "mongoose";

export const Video_dimention = {
    height: 1920,
    width: 1080
} as const;

// Typescript interface
export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    discription: string;
    videoUrl: string;
    thumbnailUrl: string;
    control?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality: number;
    };
}

// Video Schema
const videoschema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        discription: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        control: { type: Boolean, required: true },
        transformation: {
            height: { type: Number, default: Video_dimention.height },
            width: { type: Number, default: Video_dimention.width },
            quality: { type: Number, min: 1, max: 1000 }
        }
    },
    {
        timestamps : true
    }
)

// model for schema 
const Video = models?.Video || model<IVideo>('Video', videoschema);

export default Video;
