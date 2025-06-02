import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { Plus } from "lucide-react";

const CreateSection = () => {
	return (
        <Link href="/descoberta" className="w-full h-[8vh] min-h-[60px] px-[3vw] hover:bg-[#E7EFE854] flex items-center">
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <div>
                        <Plus className="size-6 text-gray-400" />
                        <span className="font-bold text-lg text-primary">CRIAR</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </Link>
	);
};

export default CreateSection;
