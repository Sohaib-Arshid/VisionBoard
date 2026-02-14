// models/user.ts
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
    }
  },
  {
    timestamps: true
  }
);

// 🔥 FIX: Password hash middleware
userSchema.pre("save", async function(next) {
  // Sirf tab hash karo jab password modify hua ho
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 🔥 FIX: Password compare method
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const User = models?.User || model<IUser>("User", userSchema);
export default User;