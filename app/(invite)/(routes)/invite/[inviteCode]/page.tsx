import { redirect } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();
  const { inviteCode } = await params;

  if (!profile) {
    return <RedirectToSignIn />;
  }

  if (!inviteCode) {
    return redirect("/");
  }

  // Kullanıcı zaten bu sunucunun üyesi mi?
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });
  
  // Eğer zaten üyeyse, direkt sunucuya yönlendir
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // Üye değilse, sunucuyu bul ve üyeler (members) arasına ekle
  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  });

  // Üye yaptıktan sonra sunucu sayfasına gönder
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;