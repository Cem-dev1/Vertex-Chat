import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server, Member, Profile } from "@prisma/client";

// 1. Prisma için genişletilmiş tip (Sidebar ve Server işlemleri için)
export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

// 2. Socket.io için Next.js Response tipi (API Route tarafı için)
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};