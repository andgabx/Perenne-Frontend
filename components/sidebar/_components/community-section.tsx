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
import { Group } from "@/pages/api/group/get-group-by-user";
import { getGroups } from "@/pages/api/group/get-group-by-user";
import { useState } from "react";
import { ChevronRight, Handshake, Projector } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CommunitySection = () => {
    const { data: session } = useSession();
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!session?.user?.accessToken) {
                return;
            }
            const groupsData = await getGroups(session.user.accessToken);
            setGroups(groupsData);
        };
        fetchGroups();
    }, [session]);

    return (
        <Collapsible className="group/collapsible">
            <SidebarGroup className="px-3">
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground"
                >
                    <CollapsibleTrigger>
                        <div className="flex items-center gap-2">
                            <Handshake className="size-6 text-gray-400" />
                            <span className="font-bold text-lg text-primary">
                                COMUNIDADES
                            </span>
                            <ChevronRight className="ml-auto text-primary transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
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
                                        >
                                            <Projector className="size-4" />
                                            <span>{group.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
};

export default CommunitySection;
