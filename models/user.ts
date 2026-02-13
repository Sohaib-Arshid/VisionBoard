// models/User.ts
import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    email: string;
    password: string;
    name?: string;              
    avatar?: string;           
    role: "user" | "admin";    
    subscribers: mongoose.Types.ObjectId[];  
    subscriberCount: number;   
    totalVideos: number;       
    totalViews: number;        
    totalLikes: number;        
    notifications: number;     
    weeklyStats: {            
        views: number;
        likes: number;
        subscribers: number;
        weekStart: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        name: { 
            type: String, 
            trim: true,
            default: "" 
        },
        avatar: { 
            type: String, 
            default: "" 
        },
        role: { 
            type: String, 
            enum: ["user", "admin"], 
            default: "user" 
        },
        subscribers: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        subscriberCount: {
            type: Number,
            default: 0
        },
        totalVideos: {
            type: Number,
            default: 0
        },
        totalViews: {
            type: Number,
            default: 0
        },
        totalLikes: {
            type: Number,
            default: 0
        },
        notifications: {
            type: Number,
            default: 0
        },
        weeklyStats: {
            views: { type: Number, default: 0 },
            likes: { type: Number, default: 0 },
            subscribers: { type: Number, default: 0 },
            weekStart: { type: Date, default: Date.now }
        }
    },
    {
        timestamps: true
    }
);
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = models?.User || model<IUser>("User", userSchema);
export default User;