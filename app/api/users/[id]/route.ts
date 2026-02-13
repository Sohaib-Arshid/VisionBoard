// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authoption } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authoption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectdb();

    // 🔥 FIX: Invalid ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      // Email se user find karo
      const userByEmail = await User.findOne({ email: session.user.email }).select("-password");
      if (userByEmail) {
        return NextResponse.json(userByEmail);
      }
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(params.id).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}