// @ts-nocheck
"use client";

import { useRoomContext, useParticipants } from "@livekit/components-react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from "lucide-react";
import { useVoiceStore } from "@/hooks/use-voice-store";
import { cn } from "@/lib/utils";

export const VoiceMiniPlayer = () => {
  const { token, onLeave } = useVoiceStore();
  
  // Eğer token yoksa kutuyu hiç render etme (Z-index karmaşasını önler)
  if (!token) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 z-[9999] pointer-events-none">
       {/* 
          LiveKit verilerine erişebilmek için mini kutu da 
          mutlaka LiveKitRoom içinde olmalı ya da token'ı burada da sarmalamalıyız.
       */}
       <div className="pointer-events-auto bg-[#1e1f22] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          <MiniVoiceContent onLeave={onLeave} />
       </div>
    </div>
  );
};

function MiniVoiceContent({ onLeave }: { onLeave: () => void }) {
  // LiveKit'ten oda bilgilerini çekiyoruz
  const room = useRoomContext();
  const participants = useParticipants();

  return (
    <>
      {/* Header: Kanal Adı Burada Görünecek */}
      <div className="p-4 bg-[#2b2d31]/50 backdrop-blur-md flex items-center justify-between border-b border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Sesli Bağlantı</span>
          <h3 className="text-white text-sm font-semibold truncate w-40">
            {/* Oda adı burada dinamik olarak gelir */}
            {room?.name || "Kanal Bağlanıyor..."}
          </h3>
        </div>
        <div className="flex items-center gap-x-2 bg-emerald-500/10 px-2 py-1 rounded-lg">
          <Users className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500 text-xs font-bold">{participants.length}</span>
        </div>
      </div>

<div className="p-4 flex -space-x-3 overflow-hidden justify-center bg-[#1e1f22]">
  {participants.slice(0, 5).map((p) => (
    <div 
      // identity bazen null gelebildiği için p.sid veya p.identity kullanmak daha güvenli
      key={p.sid || p.identity} 
      className="h-10 w-10 rounded-full border-4 border-[#1e1f22] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[12px] text-white font-bold shadow-xl transition-transform hover:scale-110 cursor-pointer"
      title={p.identity || "Bağlanıyor..."}
    >
      {/* Güvenli harf çekme işlemi */}
      {p.identity ? p.identity[0].toUpperCase() : "?"}
    </div>
  ))}
  
  {participants.length > 5 && (
    <div className="h-10 w-10 rounded-full border-4 border-[#1e1f22] bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
      +{participants.length - 5}
    </div>
  )}
</div>

      {/* Hızlı Kontroller */}
      <div className="p-4 bg-[#232428] flex items-center justify-around">
        <button className="p-2 hover:bg-zinc-700 rounded-xl transition text-zinc-400 hover:text-white">
          <Mic className="h-5 w-5" />
        </button>
        <button className="p-2 hover:bg-zinc-700 rounded-xl transition text-zinc-400 hover:text-white">
          <Video className="h-5 w-5" />
        </button>
        <button 
          onClick={onLeave}
          className="p-3 bg-rose-500 hover:bg-rose-600 rounded-2xl transition shadow-lg shadow-rose-500/20 group"
        >
          <PhoneOff className="h-5 w-5 text-white group-hover:rotate-[135deg] transition-transform duration-300" />
        </button>
      </div>
    </>
  );
}