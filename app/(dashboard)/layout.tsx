import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <SidebarProvider className="flex flex-col h-full">
                <SiteHeader />
                <div className="flex flex-1 overflow-hidden">
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex flex-col gap-4 h-full overflow-auto">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
