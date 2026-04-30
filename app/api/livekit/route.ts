// app/api/livekit/route.ts
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const username = searchParams.get("username");

  console.log("LiveKit API called:", { room, username });

  if (!room) {
    return new NextResponse("Missing room", { status: 400 });
  }

  if (!username) {
    return new NextResponse("Missing username", { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  console.log("API Key exists:", !!apiKey);
  console.log("API Secret exists:", !!apiSecret);

  if (!apiKey || !apiSecret) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      ttl: "60m", // Token süresini artırdım
    });

    at.addGrant({ 
      room: room, 
      roomJoin: true, 
      canPublish: true, 
      canSubscribe: true,
      canPublishData: true
    });

    const token = await at.toJwt();
    console.log("Token generated successfully");
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return new NextResponse("Token generation failed", { status: 500 });
  }
}