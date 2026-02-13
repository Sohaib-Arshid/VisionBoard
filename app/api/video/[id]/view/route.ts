import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import Video from "@/models/video";
import User from "@/models/user";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectdb();

    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    video.views += 1;
    await video.save();

    await User.findByIdAndUpdate(video.userId, {
      $inc: { totalViews: 1 },
    });

    return NextResponse.json({ 
      message: "View counted",
      views: video.views 
    });
  } catch (error) {
    console.error("View count error:", error);
    return NextResponse.json(
      { error: "Failed to count view" },
      { status: 500 }
    );
  }
}