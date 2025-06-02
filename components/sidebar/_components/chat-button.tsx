import {
    SidebarGroup,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

const ChatSection = () => {
    return (
        <Link href="/chat" className="w-full">
            <SidebarGroup className="px-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
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
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </Link>
    );
};

export default ChatSection;
