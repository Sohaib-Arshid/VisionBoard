// import librarys
import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// typescript Type for feutre data 
export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for User information
const userschema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},
    {
        timestamps: true
    }
)

// Hook/Midlewere for password pre save in DB
userschema.pre('save', async function () {
    if (this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)
});

// model for schema 
const User = models?.User || model<IUser>('User', userschema);

export default User;