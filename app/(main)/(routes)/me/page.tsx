import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";

const MePage = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  // Şimdilik orta kısımda "Arkadaş Listesi" olduğunu hayal edelim
  return ( 
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <div className="p-4 border-b-2 flex items-center shadow-sm">
        <p className="font-semibold text-md">Arkadaşlar</p>
      </div>
      <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Henüz burada kimse yok... Ama yakında olacak!
      </div>
    </div>
   );
}
 
export default MePage;