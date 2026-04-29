import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const initialProfile = async () => {
    const user = await currentUser();

    // 1. Eğer kullanıcı hiç yoksa (giriş yapmamışsa)
    if (!user) {
        return (await auth()).redirectToSignIn();
    }

    // 2. Eğer kullanıcı varsa, veritabanında profilini ara
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    // 3. Profil varsa döndür
    if (profile) {
        return profile;
    }

    // 4. Profil yoksa yeni bir tane oluştur (ilk kez giriş yapıyordur)
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });

    return newProfile;
};