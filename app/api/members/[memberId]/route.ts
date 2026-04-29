import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ memberId: string }> } // Next.js 15 için Promise
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");
        const { memberId } = await params;

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        if (!memberId) {
            return new NextResponse("Member ID Missing", { status: 400 });
        }

        // Sunucuyu güncelle: Üyeyi members listesinden çıkar
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id, // Sadece sunucu sahibi birini atabilir
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id // Sahibi kendini kazara atamasın
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ memberId: string }> } // Next.js 15 Promise yapısı
) {
    try {
        const profile = await currentProfile();
        // searchParams üzerinden serverId'yi alıyoruz
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId");
        const { memberId } = await params;

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        if (!memberId) {
            return new NextResponse("Member ID Missing", { status: 400 });
        }

        // Sunucuyu güncelle: Sadece sunucu sahibi başkalarının rolünü değiştirebilir
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id, // Güvenlik: İstemi atan kişi sunucu sahibi mi?
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id // Sahibi kendi rolünü değiştiremesin
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[MEMBER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}