import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerMember } from "./server-member";

interface ServerMemberSidebarProps {
  serverId: string;
}

export const ServerMemberSidebar = async ({
  serverId
}: ServerMemberSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      members: {
        include: { profile: true },
        orderBy: { role: "asc" }
      }
    }
  });

  if (!server) return redirect("/");

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] p-3">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 mb-4">
        Members — {server.members.length}
      </p>
      <div className="space-y-[2px]">
        {server.members.map((member) => (
          <ServerMember 
            key={member.id} 
            member={member} 
            server={server} 
          />
        ))}
      </div>
    </div>
  );
};