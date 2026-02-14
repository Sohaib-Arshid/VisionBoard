// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectdb();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    console.log("🔐 Creating new user:", email);

    // Create user with plain password - model middleware hash karega
    const user = await User.create({
      email,
      password: password, // plain password, model middleware hash karega
      name: name || email.split('@')[0],
      avatar: "",
      role: "user",
      totalVideos: 0,
      totalViews: 0,
      totalLikes: 0,
      subscriberCount: 0,
      notifications: 0,
    });

    console.log("✅ User created successfully:", user._id);
    console.log("🔑 Hashed password stored:", user.password.substring(0, 10) + "...");

    return NextResponse.json(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}