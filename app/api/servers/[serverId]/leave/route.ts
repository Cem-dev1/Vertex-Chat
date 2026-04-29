import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> } // Next.js 15 için Promise yapısı
) {
  try {
    const profile = await currentProfile();
    const { serverId } = await params;

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    // Sunucuyu güncelle: Members listesinden mevcut kullanıcıyı sil
    // Ancak güvenlik için: Sadece sunucu sahibi OLMAYANLAR ayrılabilir
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id // Sahibi (admin) ayrılmasın diye filtre koyuyoruz
        },
        members: {
          some: {
            profileId: profile.id // Kullanıcının gerçekten bu sunucuda üye olması lazım
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}