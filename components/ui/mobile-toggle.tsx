"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const MobileToggle = ({ 
  children // İçeriği prop olarak alıyoruz
}: { 
  children: React.ReactNode 
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="text-zinc-500 dark:text-zinc-400" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 w-[312px] border-none bg-transparent">
        {children}
      </SheetContent>
    </Sheet>
  );
};