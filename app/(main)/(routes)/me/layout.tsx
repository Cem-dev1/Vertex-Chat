import { MeSidebar } from "@/components/me/me-sidebar";

const MeLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full flex">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <MeSidebar />
      </div>
      <main className="h-full md:pl-60 flex-1">
        {children}
      </main>
    </div>
   );
}
 
export default MeLayout;