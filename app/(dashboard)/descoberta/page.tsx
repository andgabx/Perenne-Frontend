"use client";

import CommunitiesCarousel from "./_components/community-carousel";
import ProjectsCarousel from "./_components/projects-carousel";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Descoberta() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) {
        router.push("/login");
    }

    return (
        <div className="">
            <h1 className="text-2xl w-full font-bold text-center py-4 ">
                DESCOBERTA
            </h1>
            <Separator />
            <div className="mx-auto space-y-4 max-w-[75vw]">
                <CommunitiesCarousel />
                <ProjectsCarousel />
            </div>
        </div>
    );
}
