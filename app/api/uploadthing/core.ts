import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    // Eğer userId yoksa hata fırlatır, bu da güvenliği sağlar
    if (!userId) throw new UploadThingError("Unauthorized");
    return { userId };
}

export const ourFileRouter = {
    // Modal'ın beklediği endpoint ismi
    serverImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async () => {
            const user = await handleAuth();
            // user zaten { userId } formatında olduğu için direkt return ediyoruz
            return user; 
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Yükleme tamamlandı, Kullanıcı:", metadata.userId);
            return { url: file.url };
        }),
    
    messageFile: f(["image", "pdf"])
        .middleware(async () => {
            const user = await handleAuth();
            return user;
        })
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;