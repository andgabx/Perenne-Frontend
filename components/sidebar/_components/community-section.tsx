"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Group, getGroups } from "@/pages/api/group/get-group-by-user";
import { useState, useEffect } from "react";
import { Handshake } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CommunitySection = () => {
    const { data: session } = useSession();
    const [groups, setGroups] = useState<Group[]>([]);
    
    const pathname = usePathname();
    const isActive = pathname === "/comunidades";

    useEffect(() => {
        const fetchGroups = async () => {
            if (!session?.user?.accessToken) {
                setGroups([]);
                return;
            }
            try {
                // Uses the original getGroups
                const groupsData = await getGroups(session.user.accessToken);
                setGroups(groupsData);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
                setGroups([]);
            }
        };
        fetchGroups();
    }, [session]);

    return (

        <Link href="/comunidades" className={`w-full h-[8vh] min-h-[60px]  hover:bg-[var(--active-sidebar-menu-background)] ${
            isActive ? "bg-[var(--active-sidebar-menu-background)] text-white": ""
        }`}>
            <Collapsible className="group/collapsible w-full hover:bg-[var(--active-sidebar-menu-background)]">
                {/* Trigger section (com altura fixa) */}
                <SidebarGroup className="w-full">
                    <SidebarGroupLabel
                        asChild
                        className="group/label text-sm text-sidebar-foreground"
                    >
                        <CollapsibleTrigger className="w-full h-[8vh] min-h-[60px] flex items-center">
                            <div className={`flex items-center gap-2 w-full px-[3vw] ${isActive ? "text-white" : "text-primary"}`}>
                                <Handshake className="size-6 text-gray-400" />
                                <span className="font-bold text-lg">
                                    COMUNIDADES
                                </span>
                            </div>
                        </CollapsibleTrigger>
                    </SidebarGroupLabel>
                </SidebarGroup>

                {/* Expandable content (sem altura fixa!) */}
            </Collapsible>
        </Link>
    );
};

export default CommunitySection;
