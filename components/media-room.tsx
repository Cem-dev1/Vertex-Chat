"use client";

import { useEffect, useState, useRef } from "react";
import { 
  LiveKitRoom, 
  useParticipants,
  RoomAudioRenderer,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useUser } from "@clerk/nextjs";
import { Loader2, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [shouldConnect, setShouldConnect] = useState(true);

  useEffect(() => {
    if (!user?.firstName) return;
    const name = `${user.firstName} ${user.lastName || ""}`;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) { console.log(e); }
    })()
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center bg-[#313338]">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Vertex Sunucularına Bağlanılıyor...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={shouldConnect}
      onDisconnected={() => {
        console.log("Disconnected from LiveKit");
      }}
      className="flex flex-col h-full bg-[#1e1f22] relative overflow-hidden"
    >
      <RoomAudioRenderer />
      
      <div className="flex-1 flex items-center justify-center p-4 mb-25">
        <DiscordVideoInterface />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#232428]/90 backdrop-blur-md rounded-2xl flex items-center gap-x-6 border border-white/5 shadow-2xl">
         <LocalControls onDisconnect={() => setShouldConnect(false)} />
      </div>
    </LiveKitRoom>
  );
};

function LocalControls({ onDisconnect }: { onDisconnect: () => void }) {
  const { isMicrophoneEnabled, isCameraEnabled, localParticipant } = useLocalParticipant();
  const router = useRouter();

  const handleDisconnect = async () => {
    try {
      if (isMicrophoneEnabled) {
        await localParticipant.setMicrophoneEnabled(false);
      }
      if (isCameraEnabled) {
        await localParticipant.setCameraEnabled(false);
      }
      onDisconnect();
      router.back();
    } catch (error) {
      console.error("Error disconnecting:", error);
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      <button 
        onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
        className={`p-4 rounded-xl transition-all ${isMicrophoneEnabled ? "bg-[#313338] hover:bg-[#404249] text-white" : "bg-rose-500 text-white"}`}
      >
        {isMicrophoneEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </button>

      <button 
        onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
        className={`p-4 rounded-xl transition-all ${isCameraEnabled ? "bg-[#313338] hover:bg-[#404249] text-white" : "bg-rose-500 text-white"}`}
      >
        {isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </button>

      <div className="w-px h-8 bg-white/10 mx-2" />

      <button 
        onClick={handleDisconnect}
        className="p-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-lg active:scale-95"
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </div>
  );
}

function DiscordVideoInterface() {
  const participants = useParticipants();

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="h-32 w-32 rounded-full bg-[#2b2d31] flex items-center justify-center mx-auto mb-4">
            <MicOff className="h-12 w-12 text-zinc-500" />
          </div>
          <p className="text-zinc-400 text-lg">Kanala katılan kimse yok</p>
          <p className="text-zinc-500 text-sm mt-2">Davet göndererek arkadaşlarını çağırabilirsin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-7xl">
      {participants.map((participant) => (
        <ParticipantCard key={participant.identity} participant={participant} />
      ))}
    </div>
  );
}

function ParticipantCard({ participant }: { participant: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // force redeploy 1
  // Video track'i participant'ten al - getTrack methodu yoksa alternatif
  let videoTrack = null;
  try {
    const videoPublication = participant.getTrack?.(Track.Source.Camera);
    videoTrack = videoPublication?.track;
  } catch (e) {
    // Alternatif yol
    const tracks = participant.tracks || [];
    const videoPub = tracks.find((t: any) => t.source === Track.Source.Camera);
    videoTrack = videoPub?.track;
  }
  
  // Video track'i video elementine bağla
  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoRef.current.srcObject = new MediaStream([videoTrack]);
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [videoTrack]);
  
  const hasVideo = participant.isCameraEnabled && videoTrack;
  
  return (
    <div 
      className="group relative flex items-center justify-center bg-[#2b2d31] rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-xl aspect-video w-full sm:w-[45%] lg:w-[30%]"
      style={{ borderColor: participant.isSpeaking ? "#22c55e" : "transparent" }}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isLocal}
          className="absolute inset-0 object-cover w-full h-full"
        />
      ) : (
        <div className="flex flex-col items-center gap-y-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-black/20">
            {participant.identity?.charAt(0).toUpperCase() || "?"}
          </div>
          <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            {participant.identity}
          </p>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
          <p className="text-white text-sm font-medium">
            {participant.identity} {participant.isLocal && <span className="text-indigo-400">(Sen)</span>}
          </p>
        </div>

        {!participant.isMicrophoneEnabled && (
          <div className="bg-rose-500/90 p-2 rounded-full shadow-lg backdrop-blur-sm">
            <MicOff className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>

      {participant.isSpeaking && (
        <>
          <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          <div className="absolute inset-0 ring-2 ring-emerald-500/50 rounded-2xl pointer-events-none" />
        </>
      )}
    </div>
  );
}