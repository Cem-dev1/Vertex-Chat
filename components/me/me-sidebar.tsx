import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export const MeSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  // Buraya ileride veritabanından aktif 'Conversation'ları çekeceğiz
  // const conversations = await db.conversation.findMany(...)

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <div className="px-3 h-12 flex items-center border-neutral-200 dark:border-neutral-800 border-b-2 shadow-sm">
        <button className="w-full text-left font-semibold text-[14px] bg-zinc-700/10 dark:bg-zinc-700/50 px-2 py-1.5 rounded-md">
          Bir görüşme bul veya başlat
        </button>
      </div>
      <div className="flex-1 px-3">
        <div className="mt-4 flex items-center gap-x-2 p-2 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition cursor-pointer bg-zinc-700/20 dark:bg-zinc-700/50">
          <User className="h-5 w-5" />
          <p className="font-semibold text-sm">Arkadaşlar</p>
        </div>
        
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 mt-4 px-2">
          Özel Mesajlar
        </p>
        {/* Buraya Map ile Direct Messages listesi gelecek */}
      </div>
    </div>
  )
}