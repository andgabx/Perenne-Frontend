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
import { ChevronRight, Handshake, Projector } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CommunitySection = () => {
    const { data: session } = useSession();
    const [groups, setGroups] = useState<Group[]>([]);

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
<Collapsible className="group/collapsible w-full hover:bg-[#E7EFE854]">
    {/* Trigger section (com altura fixa) */}
    <SidebarGroup className="w-full">
        <SidebarGroupLabel
            asChild
            className="group/label text-sm text-sidebar-foreground"
        >
            <CollapsibleTrigger className="w-full h-[8vh] min-h-[60px] flex items-center">
                <div className="flex items-center gap-2 w-full px-[3vw]">
                    <Handshake className="size-6 text-gray-400" />
                    <span className="font-bold text-lg text-primary">
                        COMUNIDADES
                    </span>
                    <ChevronRight className="ml-auto text-primary transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </div>
            </CollapsibleTrigger>
        </SidebarGroupLabel>
    </SidebarGroup>

    {/* Expandable content (sem altura fixa!) */}
    <CollapsibleContent className="w-full px-[3vw] pt-2">
        <SidebarGroupContent>
            <SidebarMenu>
                {groups.length === 0 && (
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <span>
                                Você ainda não possui grupos
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
                {groups.map((group) => (
                    <SidebarMenuItem key={group.id}>
                        <SidebarMenuButton asChild>
                            <Link
                                href={`/descoberta/grupo/${group.id}`}
                                className="flex items-center gap-2 w-full"
                            >
                                <Projector className="size-4 flex-shrink-0" />
                                <span className="truncate">{group.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroupContent>
    </CollapsibleContent>
</Collapsible>
    );
};

export default CommunitySection;
