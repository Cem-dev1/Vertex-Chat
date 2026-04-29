"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};

export const NavigationItem = ({ 
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`);
    };

    return (
        <ActionTooltip
            side="right"
            align="center"
            label={name}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-1",
                    params?.serverId !== id && "group-hover:h-5 h-0",
                    params?.serverId === id && "h-9"
                )}/>

                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center", // items-center ve justify-center eklendi
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    {/* KRİTİK KONTROL: Resim varsa resmi bas, yoksa baş harfi bas */}
                    {imageUrl ? (
                        <Image
                            fill
                            src={imageUrl}
                            alt={`Server: ${name}`}
                            className="object-cover"
                        />
                    ) : (
                        <p className={cn(
                            "font-bold text-sm uppercase transition text-zinc-500 group-hover:text-white",
                            params?.serverId === id && "text-white"
                        )}>
                            {name.substring(0, 1)}
                        </p>
                    )}
                </div>
            </button>
        </ActionTooltip>
    );
};