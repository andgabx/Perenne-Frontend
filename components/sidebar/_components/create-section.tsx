"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/pages/api/user/get-user-info";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateGroupForm from "@/app/(dashboard)/comunidades/_components/create-group-form";

const CreateSection = () => {
    const { data: session } = useSession();
    const [canCreate, setCanCreate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            if (session?.user?.accessToken) {
                try {
                    const userInfo = await getUserInfo(
                        session.user.accessToken
                    );
                    setCanCreate(
                        userInfo.role === "Diretor" ||
                            userInfo.role === "Administrador"
                    );
                } catch (error) {
                    console.error("Erro ao verificar permissões:", error);
                    setCanCreate(false);
                }
            }
        };

        checkUserRole();
    }, [session]);

    return (
        <SidebarMenuItem>
            {canCreate ? (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <div className="w-full h-[8vh] min-h-[60px] px-[3vw] hover:bg-[#E7EFE854] flex items-center cursor-pointer">
                            <SidebarMenuButton asChild>
                                <div>
                                    <Plus className="size-6 text-gray-400" />
                                    <span className="font-bold text-lg text-primary">
                                        CRIAR
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="w-[60vw] max-w-[60vw] min-h-[60vh]">
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <CreateGroupForm
                            token={session?.user?.accessToken || ""}
                            isLoading={false}
                            onSuccess={() => setIsOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="w-full h-[8vh] min-h-[60px]" />
            )}
        </SidebarMenuItem>
    );
};

export default CreateSection;
