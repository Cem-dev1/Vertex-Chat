"use client";

import { useEffect, useState, useCallback } from "react";

export const ServerVoiceChannel = ({ channelId }: { channelId: string }) => {
  const [participants, setParticipants] = useState<any[]>([]);
  
  const fetchParticipants = useCallback(async () => {
    // Eğer sekme aktif değilse boşuna istek atma
    if (document.hidden) return;

    try {
      const res = await fetch(`/api/channels/${channelId}/participants`, {
        cache: 'no-store' // Verinin taze olduğundan emin ol
      });
      
      if (res.ok) {
        const data = await res.json();
        setParticipants(Array.isArray(data) ? data : (data.participants || []));
      }
    } catch (e) {
      console.error("Sidebar listeleme hatası:", e);
    }
  }, [channelId]);

  useEffect(() => {
    // Bileşen yüklendiğinde ilk isteği at
    fetchParticipants();

    // 10 saniye yerine 30 saniye (Kapasite dostu)
    const interval = setInterval(fetchParticipants, 30000); 
    
    // Kullanıcı sekmeye geri döndüğünde veriyi tazele
    window.addEventListener("focus", fetchParticipants);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchParticipants);
    };
  }, [fetchParticipants]);

  if (!participants || participants.length === 0) return null;

  return (
    <div className="ml-9 mt-1 flex flex-col gap-y-1">
      {participants.map((participant) => (
        <div 
          key={participant.sid || participant.identity} 
          className="flex items-center gap-x-2 py-1 group"
        >
          <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center text-[7px] font-bold text-zinc-200 uppercase border border-white/5">
            {participant.identity?.[0] || "?"}
          </div>
          <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition truncate max-w-[100px]">
            {participant.identity}
          </span>
        </div>
      ))}
    </div>
  );
};