import { connectdb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Video, { IVideo } from "@/models/video";
import { getServerSession } from "next-auth";
import { authoption } from "@/lib/auth";

export async function GET() {
    try {
        await connectdb();
        const videos = await Video.find({}).sort({ createdAT: -1 }).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 400 })
        }

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authoption)
        if (!session) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 })
        }

        await connectdb();

        const body: IVideo = await request.json();

        if (
            !body.title || !body._id || !body.discription || !body.videoUrl || body.thumbnailUrl
        ) {
            return NextResponse.json({ error: "Something required fields" }, { status: 400 })
        }

        const videodata = {
            ...body,
            control: body?.control ?? true,
            trnsformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100,
            }

        }
        const newvideo = await Video.create(videodata)
        return NextResponse.json(newvideo)

    } catch (error) {
        return NextResponse.json({ error: "failed to create video" }, { status: 500 })
    }
}