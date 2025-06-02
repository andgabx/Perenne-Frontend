import Link from "next/link";
import {
    SidebarGroup,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
} from "@/components/ui/sidebar";
import Image from "next/image";

const HomeSection = () => {

    return (
        <SidebarGroup className="px-3">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/descoberta">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/icons/home.svg"
                                    alt="Home"
                                    width={24}
                                    height={24}
                                    className="size-6"
                                />
                                <span className="font-bold text-lg text-primary">
                                    INICIO
                                </span>
                            </div>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );

};

export default HomeSection;
