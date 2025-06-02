import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar";
import Link from "next/link";
import { Plus } from "lucide-react";

const CreateSection = () => {
    return ( 
        <SidebarGroup className="px-3 hover:bg-[#E7EFE854]">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/descoberta">
                                    <div className="flex items-center gap-2">
                                        {/* <Image
                                            src="/icons/home.svg"
                                            alt="Home"
                                            width={24}
                                            height={24}
                                            className="size-6"
                                        /> */}
                                        <Plus className="size-6 text-gray-400" />
                                        <span className="font-bold text-lg text-primary">
                                            CRIAR
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

     );
}
 
export default CreateSection;