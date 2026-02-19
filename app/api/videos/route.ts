import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { authoption } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authoption);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    console.log("📹 Fetching videos for userId:", userId);

    await connectdb();

    const filter: any = {};
    if (userId) {
      filter.userId = userId;
    }

    const skip = (page - 1) * limit;

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(" Videos found:", videos.length);

    const total = await Video.countDocuments(filter);

    // ✅ EMPTY ARRAY return karo, 404 nahi
    return NextResponse.json({
      videos: videos || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return NextResponse.json(
      { videos: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } },
      { status: 200 } // ✅ 200 OK with empty array
    );
  }
}