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
        <Link
            href="/descoberta"
            className={`w-full h-[8vh] min-h-[60px] px-[3vw] flex items-center hover:bg-[var(--active-sidebar-menu-background)] hover:text-white ${
                isActive
                    ? "bg-[var(--active-sidebar-menu-background)] text-white"
                    : ""
            }`}
        >
            <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:text-white">
                    <div
                        className={`flex items-center hover:text-white gap-2 ${
                            isActive ? "text-white" : "text-primary"
                        }`}
                    >
                        <Image
                            src="/icons/home.svg"
                            alt="Home"
                            width={24}
                            height={24}
                            className="size-6"
                        />
                        <span className="font-bold text-lg hover:text-white">INÍCIO</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </Link>
    );
};

export default HomeSection;
