import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL!

if (!MONGODB_URL) {
    throw new Error("please define MONGODB_URL in env veriable")
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { connect: null, promise: null }
}

export async function connectdb() {
    if (cached.connect) {
        return cached.connect;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URL, opts).then(() => mongoose.connection);
    }

    try {
        cached.connect = await cached.promise
    } catch (error) {
        cached.promise = null;
        console.log(error);
    }

    return cached.connect;
}
