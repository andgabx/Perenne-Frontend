import {
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Collapsible } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const ProjectsSection = () => {
    return (
        <Collapsible className="group/collapsible w-full hover:bg-[#E7EFE854]">
            <SidebarGroup>
                <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground"
                >
                    <CollapsibleTrigger className="w-full h-[8vh] min-h-[60px] px-[3vw] flex items-center">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/icons/projetos.svg"
                                alt="Projetos"
                                width={32}
                                height={32}
                                className="size-6"
                            />
                            <span className="font-bold text-lg text-primary">
                                PROJETOS
                            </span>
                            <ChevronRight className="ml-auto text-primary transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="px-[3vw]">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <span>Projeto 1</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <span>Projeto 2</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <span>Projeto 3</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
};

export default ProjectsSection;
