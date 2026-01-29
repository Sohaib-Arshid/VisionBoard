import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: String;
    password: String;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userschema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
},
    {
        timestamps: true
    }
)