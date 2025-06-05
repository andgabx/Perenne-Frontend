"use client";

import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StyledCommunityGrid from "../comunidades/_components/community-card";

export default function Comunidades() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    return (
        <div className="">
            <h1 className="text-2xl w-full font-bold text-center py-4 ">
                COMUNIDADES
            </h1>
            <Separator />
            <div className="mx-auto space-y-4 max-w-[75vw]">
                {/* <CommunitiesCarousel /> */}
                <StyledCommunityGrid
                    selectedCommunity={null}
                    setSelectedCommunity={() => {}}
                />
            </div>
        </div>
    );
}
