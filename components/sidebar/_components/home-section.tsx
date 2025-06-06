import Link from "next/link";
import {
    SidebarGroup,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";

const HomeSection = () => {
    const pathname = usePathname();
    const isActive = pathname === "/descoberta";

    return (
        <Link href="/descoberta" className={`w-full h-[8vh] min-h-[60px] px-[3vw] flex items-center ${isActive ? "bg-[var(--active-sidebar-menu-background)]" : ""}`}>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <div className={`flex items-center gap-2 ${isActive ? "text-white" : "text-primary"}`}>
                        <Image
                            src="/icons/home.svg"
                            alt="Home"
                            width={24}
                            height={24}
                            className="size-6"
                        />
                        <span className="font-bold text-lg">
                            INÍCIO
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </Link>
    );
};

export default HomeSection;
