"use client";

import * as React from "react";
import { UserSection } from "@/components/sidebar/_components/user-section";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ChatSection from "./_components/chat-button";
import HomeSection from "./_components/home-section";
import CreateSection from "./_components/create-section";
import ProjectsSection from "./_components/projects-section";
import CommunitySection from "./_components/community-section";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    return (
        <Sidebar
            className="w-[calc(23vw-var(--sidebar-left-padding))] h-[calc(100vh-var(--header-height))] sticky top-[var(--header-height)] flex flex-col"
            {...props}
        >
            <SidebarContent className="flex-1 overflow-y-auto">
                <SidebarMenu className="flex flex-col gap-0">
                    <CreateSection />
                    <Separator />
                    <HomeSection />
                    <Separator />
                    <ChatSection />
                </SidebarMenu>

                <Separator />

                <CommunitySection />

                <Separator />

                <ProjectsSection />

                <Separator />
            </SidebarContent>

            <SidebarFooter className="shrink-0">
                <UserSection />
            </SidebarFooter>
        </Sidebar>
    );
}
