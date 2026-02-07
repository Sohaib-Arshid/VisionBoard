import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({
                error: "Email and password are required"
            },
                { status: 400 }
            )
        }

        await connectdb();

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return NextResponse.json({
                error: "Email are already registerd"
            },
                { status: 400 }
            );
        }

        const newuser = await User.create({
            email,
            password,
        })

        return NextResponse.json(
            { massage: "User registered successfully" }
        )
    } catch (error) {
        return NextResponse.json({
            error: "Faild to register user"
        },
            { status: 400 }
        );
    }
}
