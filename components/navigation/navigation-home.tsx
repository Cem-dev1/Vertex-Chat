"use client";

import { MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ActionTooltip } from "@/components/action-tooltip";

export const NavigationHome = () => {
  const params = useParams();
  const router = useRouter();

  return (
    <div>
      <ActionTooltip
        side="right"
        align="center"
        label="Direct Messages"
      >
        <button
          onClick={() => router.push("/me")} // veya tercih ettiğin DM yolu
          className="group flex items-center"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-indigo-500">
            <MessageSquare
              className="group-hover:text-white transition text-indigo-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}