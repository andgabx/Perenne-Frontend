"use client";

import * as React from "react";
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Plus,
    Send,
    Settings2,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switch";
import Link from "next/link";
import { useSession } from "next-auth/react";

const data = {
    user: {
        name: "Usuario",
        email: "usuario@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Comunidade",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Comunidade 1",
                    url: "#",
                },
                {
                    title: "Comunidade 2",
                    url: "#",
                },
                {
                    title: "Comunidade 3",
                    url: "#",
                },
            ],
        },
        {
            title: "Projetos",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Projeto 1",
                    url: "#",
                },
                {
                    title: "Projeto 2",
                    url: "#",
                },
                {
                    title: "Projeto 3",
                    url: "#",
                },
            ],
        },
        
    ],
    navSecondary: [
        {
            title: "Ajuda",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { data: session } = useSession();
    
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
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Plus className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Criar
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser session={session} />
            </SidebarFooter>
        </Sidebar>
    );
}
