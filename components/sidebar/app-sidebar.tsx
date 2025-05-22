"use client";

import * as React from "react";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switch";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    Plus,
    Projector,
    User,
    ChevronRight,
    FolderKanban,
    MessageSquare,
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface Group {
    id: string;
    name: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        const groupsByUserId = async () => {
            console.log("Fetching groups...");
            console.log("Session:", session);
            if (!session?.user?.accessToken) {
                console.log("No access token available");
                return;
            }
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/user/getgroups`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.user.accessToken}`,
                            "ngrok-skip-browser-warning": "69420",
                        },
                    }
                );
                console.log("Response status:", response.status);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Failed to fetch groups:", errorText);
                    return;
                }
                const data = await response.json();
                setGroups(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error in groupsByUserId:", error);
                setGroups([]);
            }
        };
        groupsByUserId();
    }, [session]);

    return (
        <Sidebar
            className="h-[calc(100vh-var(--header-height))] sticky top-[var(--header-height)]"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/icons/criar.svg"
                                        alt="Logo"
                                        width={24}
                                        height={24}
                                        className="size-7"
                                    />
                                </div>
                                <span className="font-bold text-lg text-primary">
                                    CRIAR
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <Separator className="" />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="">
                <SidebarGroup className="hover:bg-card">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/chat">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/icons/chat.svg"
                                            alt="Chat"
                                            width={24}
                                            height={24}
                                            className="size-6"
                                        />
                                        <span className="font-bold text-lg text-primary">
                                            CHAT
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <Separator className="" />

                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel
                            asChild
                            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <CollapsibleTrigger>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/icons/community.svg"
                                        alt="Comunidades"
                                        width={32}
                                        height={32}
                                        className="size-8"
                                    />
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

                <Separator className="" />

                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel
                            asChild
                            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <CollapsibleTrigger>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/icons/projetos.svg"
                                        alt="Projetos"
                                        width={32}
                                        height={32}
                                        className="size-8"
                                    />
                                    <span className="font-bold text-lg text-primary">
                                        PROJETOS
                                    </span>
                                    <ChevronRight className="ml-auto text-primary transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </div>
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <span>Projeto 1</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <span>Projeto 2</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <span>Projeto 3</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
            </SidebarContent>
            <SidebarFooter>
                <NavUser session={session} />
            </SidebarFooter>
        </Sidebar>
    );
}
