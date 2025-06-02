"use client";

import * as React from "react";
import { UserSection } from "@/components/sidebar/_components/user-section";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
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
            className="h-[calc(100vh-var(--header-height))] sticky top-[var(--header-height)]"
            {...props}
        >
            <SidebarContent className="flex flex-col py-4 space-y-4">

                <CreateSection />

                <Separator className="" />

                <HomeSection />

                <Separator className="" />

                <ChatSection />

                <Separator className="" />

                <CommunitySection />

                <Separator className="" />

                <ProjectsSection />

                <Separator className="" />

            </SidebarContent>

            <SidebarFooter>
                <UserSection />
            </SidebarFooter>
        </Sidebar>
    );
}
