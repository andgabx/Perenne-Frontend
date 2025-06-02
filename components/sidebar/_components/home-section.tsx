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
        <Link href="/descoberta" className="w-full h-[8vh] min-h-[60px] px-[3vw] hover:bg-[#E7EFE854] flex items-center">
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <div>
                        <Image
                            src="/icons/home.svg"
                            alt="Home"
                            width={24}
                            height={24}
                            className="size-6"
                        />
                        <span className="font-bold text-lg text-primary">
                            INÍCIO
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </Link>
    );
};

export default HomeSection;
