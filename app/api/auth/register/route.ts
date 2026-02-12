import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs"; 

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        await connectdb();

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return NextResponse.json(
                { error: "Email is already registered" },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await User.create({
            email,
            password: hashedPassword, 
        })

        return NextResponse.json(
            { message: "User registered successfully" }, 
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}