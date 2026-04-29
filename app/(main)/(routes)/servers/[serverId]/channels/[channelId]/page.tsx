import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSideBar } from "@/components/server/server-sidebar";

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string;
    channelId: string;
  }>;
}

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, channelId } = await params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    }
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      {/* ChatHeader artık bir Server Component olan bu sayfadan 
          MobileToggle içeriğini (NavigationSidebar ve ServerSideBar) 
          children olarak alıyor. 
      */}
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      >
        {/* MOBİL SIDEBAR PAKETİ: Bu kısım MobileToggle içinde render edilecek */}
        <div className="flex h-full w-[312px]">
          <div className="w-[72px]">
            <NavigationSidebar />
          </div>
          <div className="flex-1 bg-[#2B2D31]">
            <ServerSideBar serverId={channel.serverId} />
          </div>
        </div>
      </ChatHeader>
      
      {/* METİN KANALI */}
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages 
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput 
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}

      {/* SESLİ KANAL */}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}

      {/* GÖRÜNTÜLÜ KANAL */}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
   );
}
 
export default ChannelIdPage;