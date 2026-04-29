"use client";

import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/ui/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useSocket } from "@/components/providers/socket-provider";
interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  children?: React.ReactNode; // 1. Bunu EKLE
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  children // 2. Bunu BURAYA AL
}: ChatHeaderProps) => {
  const { isConnected } = useSocket();// Soket durumunu al
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 w-full">
      {/* 1. Mobil Menü */}
      <MobileToggle>
        {children}
      </MobileToggle>
      
      {/* 2. # İKONU (Hem kanalda hem DM'de görünmesi için koşulu kaldırdık veya genişlettik) */}
      <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2 flex-shrink-0" />

      {/* 3. DM AVATARI (Sadece DM ise # ikonundan sonra gelir) */}
      {type === "conversation" && (
        <UserAvatar 
          src={imageUrl}
          className="h-8 w-8 mr-2 flex-shrink-0"
        />
      )}

      {/* 4. İSİM */}
      <p className="font-semibold text-md text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center gap-x-2">
        {/* Soket Durum İkonu */}
        {!isConnected ? (
           <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" title="Bağlanıyor..." />
        ) : (
           <div className="h-2 w-2 rounded-full bg-emerald-500" title="Bağlı" />
        )}
      </div>
      <div className="ml-auto flex items-center">
      </div>
    </div>
  );
};