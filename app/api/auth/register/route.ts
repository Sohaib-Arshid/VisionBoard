// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, avatar } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      avatar: avatar || "",
      role: "user",
      totalVideos: 0,
      totalViews: 0,
      totalLikes: 0,
      subscriberCount: 0,
      notifications: 0,
    });

    return NextResponse.json(
      {
        id: user._id.toString(), // ✅ YEH LO
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}