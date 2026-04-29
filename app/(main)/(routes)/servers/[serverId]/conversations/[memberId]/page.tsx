import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header"; // Bunu ekledik
import { ChatInput } from "@/components/chat/chat-input";

interface MemberIdPageProps {
  params: Promise<{
    memberId: string;
    serverId: string;
  }>
}

const MemberIdPage = async ({
  params
}: MemberIdPageProps) => {
  const profile = await currentProfile();
  const { serverId, memberId } = await params;

  if (!profile) {
    return redirect("/sign-in");
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId);

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        {/* ESKİ DIV YERİNE CHATHEADER GELDİ */}
        <ChatHeader 
          name={otherMember.profile.name}
          type="conversation"
          serverId={serverId}
          imageUrl={otherMember.profile.imageUrl}
        />
        
        <div className="flex-1 p-4">
            Conversation ID: {conversation.id}
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {otherMember.profile.name} ile mesajlaşıyorsunuz.
            </p>
        </div>
        {/* CHAT INPUT BURAYA GELİYOR */}
        <ChatInput 
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/socket/direct-messages"
          query={{
            conversationId: conversation.id,
            serverId: serverId,
          }}
        />
    </div>
  );
}
 
export default MemberIdPage;