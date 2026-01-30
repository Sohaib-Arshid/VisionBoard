// import librarys
import mongoose, { Schema, model, models } from "mongoose";

export const Video_dimention = {
    height : 1920,
    width : 1080
} as const;

// Typescript interface
export interface IVideo {
    _id? : mongoose.Types.ObjectId;
    title : string;
    discription : string;
    videoUrl : string;
    thumbnailUrl : string;
    control? : boolean;
    transformation? : boolean;
} git add .
git commit -m "implement User authentication model with hashed passwords"
git push origin main
