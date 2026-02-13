import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import User from "@/models/user";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { authoption } from "@/lib/auth";

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

    const user = await User.findById(params.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const videos = await Video.find({ userId: params.id });
    
    const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
    const totalLikes = videos.reduce((acc, v) => acc + (v.likeCount || 0), 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyVideos = videos.filter(v => new Date(v.createdAt) > weekAgo);
    const weeklyViews = weeklyVideos.reduce((acc, v) => acc + (v.views || 0), 0);
    const weeklyLikes = weeklyVideos.reduce((acc, v) => acc + (v.likeCount || 0), 0);

    const stats = {
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      subscribers: user.subscriberCount || 0,
      weeklyVideos: weeklyVideos.length,
      weeklyViews,
      weeklyLikes,
      weeklySubscribers: user.weeklyStats?.subscribers || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}