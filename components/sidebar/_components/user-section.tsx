"use client";

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../../ui/button";

export function UserSection() {
    const { data: session } = useSession();
    const { isMobile } = useSidebar();

    const handleSignOut = () => {
        signOut({
            callbackUrl: "/login",
            redirect: true,
        });
    };

    return (
        
                <SidebarMenuButton
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full h-[8vh] min-h-[60px] px-[3vw] hover:bg-[#E7EFE854] flex items-center"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">
                            {session?.user?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate text-primary font-medium">
                            {session?.user.name}
                        </span>
                    </div>
                </SidebarMenuButton>
            
    );
}
