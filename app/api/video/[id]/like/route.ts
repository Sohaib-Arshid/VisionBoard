// app/api/videos/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import Video from "@/models/video";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authoption } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authoption);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectdb();

    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const userId = session.user.id;
    
    if (video.likes.includes(userId)) {
      return NextResponse.json(
        { error: "Video already liked" },
        { status: 400 }
      );
    }

    video.likes.push(userId);
    video.likeCount = video.likes.length;
    await video.save();

    await User.findByIdAndUpdate(video.userId, {
      $inc: { totalLikes: 1 },
    });

    return NextResponse.json({ 
      message: "Video liked successfully",
      likeCount: video.likeCount 
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Failed to like video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authoption);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectdb();

    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const userId = session.user.id;
    
    video.likes = video.likes.filter((id: string) => id.toString() !== userId);
    video.likeCount = video.likes.length;
    await video.save();

    await User.findByIdAndUpdate(video.userId, {
      $inc: { totalLikes: -1 },
    });

    return NextResponse.json({ 
      message: "Video unliked successfully",
      likeCount: video.likeCount 
    });
  } catch (error) {
    console.error("Unlike error:", error);
    return NextResponse.json(
      { error: "Failed to unlike video" },
      { status: 500 }
    );
  }
}