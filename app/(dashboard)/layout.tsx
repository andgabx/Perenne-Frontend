"use client";

import { AppSidebar } from "@/components/sidebar/main";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <SidebarProvider className="flex flex-col h-full">
                <SiteHeader />
                {/* <AppBar /> */}
                <div className="flex flex-1 overflow-hidden">
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex flex-col gap-4 h-full overflow-auto bg-cover bg-no-repeat bg-[url('/bg.png')] bg-[position:100%_center]">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
