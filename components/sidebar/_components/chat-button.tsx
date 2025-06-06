import {
    SidebarGroup,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChartAreaIcon } from "lucide-react";
import { useSession } from "next-auth/react";
const ChatSection = () => {
    const pathname = usePathname();
    const isActive = pathname === "/chat";

    return (
        <Link
            href="/chat"
            className={`w-full h-[8vh] min-h-[60px] px-[3vw] flex items-center hover:bg-[var(--active-sidebar-menu-background)] hover:text-white ${
                isActive
                    ? "bg-[var(--active-sidebar-menu-background)] text-white"
                    : ""
            }`}
        >
            <SidebarMenuItem>
                <SidebarMenuButton asChild className="w-full">
                    <div
                        className={`flex items-center gap-2 ${
                            isActive ? "text-white" : "text-primary"
                        } hover:text-white`}
                    >
                        <ChartAreaIcon className="size-8" />
                        <span className="font-bold text-lg">MENSAGENS</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </Link>
    );
};

export default ChatSection;
