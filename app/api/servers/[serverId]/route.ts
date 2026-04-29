import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ serverId: string }> } // Tip tanımını Promise yapıyoruz
) {
    try {
        const profile = await currentProfile();

        // params bir Promise olduğu için burada await ediyoruz
        const resolvedParams = await params; 
        const serverId = resolvedParams.serverId;

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id,
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ serverId: string }> } // Tip tanımını Promise yapıyoruz
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        // params bir Promise olduğu için burada await ediyoruz
        const resolvedParams = await params; 
        const serverId = resolvedParams.serverId;

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}