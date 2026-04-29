"use client";

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState 
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Bağlantı adresi (Env yoksa localhost:3000'e güveniyoruz)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    console.log("Soket başlatılıyor: ", siteUrl);

    // 2. Soket Instance oluşturma
    const socketInstance = new (ClientIO as any)(siteUrl, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // 3. Olay Dinleyicileri (Event Listeners)
    socketInstance.on("connect", () => {
      console.log("SOKET BAĞLANDI! ✅");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("SOKET BAĞLANTISI KESİLDİ! ❌");
      setIsConnected(false);
    });

    // Hata ayıklama için (Opsiyonel)
    socketInstance.on("connect_error", (error: any) => {
      console.log("SOKET HATASI:", error.message);
    });

    setSocket(socketInstance);

    // 4. Cleanup (Bileşen ölünce bağlantıyı kapat)
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};