import { NextRequest, NextResponse } from "next/server";
import { RoomServiceClient } from "livekit-server-sdk";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    // Next.js 15 - params bir Promise, await ile al
    const { channelId } = await params;
    
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit configuration missing", participants: [] },
        { status: 500 }
      );
    }

    const roomService = new RoomServiceClient(
      livekitUrl,
      apiKey,
      apiSecret
    );

    try {
      // Oda henüz yoksa hata fırlatacak
      const participants = await roomService.listParticipants(channelId);
      return NextResponse.json({ participants, error: null });
      
    } catch (error: any) {
      // Oda bulunamadı hatası - boş liste dön
      if (error?.status === 404 || error?.code === 'not_found') {
        return NextResponse.json({ participants: [], error: null });
      }
      throw error;
    }
    
  } catch (error) {
    console.error("Error in participants API:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants", participants: [] },
      { status: 500 }
    );
  }
}