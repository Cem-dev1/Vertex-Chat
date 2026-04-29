import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// DİKKAT: "export default" DEĞİL, direkt "export async function GET" olmalı
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    const section = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    if (!section || !username) {
      return new NextResponse("Missing room or username", { status: 400 });
    }

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return new NextResponse("Server configuration error", { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
    });

    at.addGrant({ 
      roomJoin: true, 
      room: section, 
      canPublish: true, 
      canPublishData: true 
    });

    return NextResponse.json({ token: await at.toJwt() });
  } catch (error) {
    console.log("[LIVEKIT_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}