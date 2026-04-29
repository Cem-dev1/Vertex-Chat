import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSideBar } from "@/components/server/server-sidebar";
import { ServerMemberSidebar } from "@/components/server/server-member-sidebar";
import { MobileToggle } from "@/components/ui/mobile-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) return (await auth()).redirectToSignIn();

  const { serverId } = await params;

  // Kullanıcının bu sunucuda olup olmadığını kontrol edelim (Güvenlik için)
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: (await currentProfile())?.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      {/* MASAÜSTÜ SIDEBAR (md ve üstü) */}
      <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0 z-20">
        <ServerSideBar serverId={serverId} />
      </div>
      {/* ANA İÇERİK */}
      <main className="h-full md:pl-60">
        <div className="flex h-full">
          <div className="flex-1 h-full overflow-y-auto">
            {children}
          </div>
          {/* SAĞ TARAF ÜYE LİSTESİ (lg ve üstü) */}
          <div className="hidden lg:flex w-60 flex-col h-full border-l dark:border-zinc-800 bg-[#2B2D31]">
            <ServerMemberSidebar serverId={serverId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServerIdLayout;