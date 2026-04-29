"use client";

import { Plus } from "lucide-react";
import { MemberRole, ChannelType } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  // Misafir olmayan herkes kanal oluşturabilir (Admin/Moderator)
  const canCreateChannel = role !== MemberRole.GUEST && sectionType === "channels";

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      
      {/* Sadece Kanallar (Channels) kısmında "+" butonu gösteriliyor */}
      {canCreateChannel && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}

      {/* Üyeler (Members) kısmı için buradaki Ayarlar butonu kaldırıldı */}
    </div>
  );
};