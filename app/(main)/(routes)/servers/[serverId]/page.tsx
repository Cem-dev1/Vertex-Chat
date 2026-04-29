import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: Promise<{
    serverId: string;
  }>;
};

const ServerIdPage = async ({
  params
}: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  // Next.js 15+ için params bekletilir
  const { serverId } = await params;

  // Sunucuyu bul ve içindeki "general" kanalını getir
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  const initialChannel = server?.channels[0];

  // Eğer sunucu içinde "general" kanalı bulunamazsa (ki olmalı) null döner.
  // Ama genellikle direkt general kanalına yönlendiririz.
  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
}

export default ServerIdPage;