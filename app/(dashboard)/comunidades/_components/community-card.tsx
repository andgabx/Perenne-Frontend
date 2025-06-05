// app/(dashboard)/chat/_components/StyledCommunityGrid.tsx
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getGroups, Group } from "@/pages/api/group/get-group-by-user";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateGroupForm from "@/app/(dashboard)/descoberta/grupo/_components/create-group-form";
import GroupList from "./group-list";
import { getHeaders } from "@/pages/api/headers";
import toast from "react-hot-toast";

interface StyledCommunityGridProps {
    selectedCommunity: string | null;
    setSelectedCommunity: (id: string) => void;
}

const StyledCommunityGrid: React.FC<StyledCommunityGridProps> = ({
    setSelectedCommunity,
}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [isLoadingAllGroups, setIsLoadingAllGroups] = useState(false);
    const [isLoadingMyGroups, setIsLoadingMyGroups] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    useEffect(() => {
        const fetchAllGroups = async () => {
            if (!session?.user?.accessToken) {
                setAllGroups([]);
                return;
            }
            setIsLoadingAllGroups(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/group/getall`,
                    {
                        method: "GET",
                        headers: getHeaders(session.user.accessToken),
                    }
                );
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("API Error (getall groups):", errorText);
                    setAllGroups([]);
                    toast.error("Falha ao buscar grupos disponíveis.");
                    return;
                }
                const data = await response.json();
                setAllGroups(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erro ao buscar todos os grupos:", error);
                toast.error("Erro ao buscar grupos disponíveis.");
                setAllGroups([]);
            } finally {
                setIsLoadingAllGroups(false);
            }
        };
        const fetchMyGroups = async () => {
            if (!session?.user?.accessToken) {
                setMyGroups([]);
                return;
            }
            setIsLoadingMyGroups(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/user/getgroups`,
                    {
                        headers: getHeaders(session.user.accessToken),
                    }
                );
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Failed to fetch user groups:", errorText);
                    setMyGroups([]);
                    toast.error("Falha ao buscar seus grupos.");
                    return;
                }
                const data = await response.json();
                setMyGroups(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching user groups:", error);
                toast.error("Erro ao buscar seus grupos.");
                setMyGroups([]);
            } finally {
                setIsLoadingMyGroups(false);
            }
        };
        fetchAllGroups();
        fetchMyGroups();
    }, [session]);

    const groupsToShow = allGroups.filter(
        (ag) => !myGroups.some((mg) => mg.id === ag.id)
    );

    const handleJoinGroup = async (groupId: string) => {
        if (!session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar em um grupo");
            return;
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}/join`,
                {
                    method: "POST",
                    headers: getHeaders(session.user.accessToken),
                }
            );
            if (!response.ok) {
                const errorData = await response.text();
                toast.error("Erro ao entrar no grupo: " + errorData);
                return;
            }
            toast.success("Entrou no grupo com sucesso!");
            // Atualizar myGroups após sucesso
            const updatedMyGroups = [
                ...myGroups,
                allGroups.find((g) => g.id === groupId),
            ].filter(Boolean);
            setMyGroups(updatedMyGroups as Group[]);
        } catch (error) {
            toast.error("Erro ao entrar no grupo.");
        }
    };

    return (
        <div className="p-[2vw] md:p-[1.0vw]">
            {/* Padding geral do contêiner */}
            <h3
                className="text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] font-bold text-[#FCB201] mb-[4vh] text-center uppercase tracking-wide font-['BN_Bobbie_Sans']"
                style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
            >
                MINHAS COMUNIDADES
            </h3>
            {allGroups.length === 0 && (
                <p className="text-center text-gray-500 text-[1.2vw] md:text-[1vw]">
                    Você ainda não participa de nenhuma comunidade.
                </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 gap-4">
                {/* Espaçamento da grade */}
                {myGroups.map((community) => (
                    <div
                        key={community.id}
                        className="relative cursor-pointer group transform hover:scale-105 transition-transform duration-200"
                        onClick={() => setSelectedCommunity(community.id)}
                    >
                        {/* Elemento de fundo verde (sombra) com largura ajustada */}
                        <div
                            className={cn(
                                "absolute top-0 bottom-0 left-[0.5vw] right-[0.5vw] md:left-[0.1vw] md:right-[0.1vw] bg-[#24BD0A] rounded-b-[44px] rounded-t-[55px] translate-y-[0.3vh] group-hover:translate-y-[0.75vh] transition-transform duration-200",
                                "filter blur-xs opacity-100"
                            )}
                        />
                        {/* Card principal com nova cor de fundo e arredondamento e altura ajustados */}
                        <div
                            className={cn(
                                "relative bg-[#F4F7F5] rounded-b-[48px] rounded-t-[40px] overflow-hidden flex flex-col"
                            )}
                        >
                            {/* Retângulo da "imagem" com arredondamento uniforme e dimensões vw/vh */}
                            <div className="bg-[#FCB201] rounded-t-[20px] rounded-b-[20px] h-[20vh] md:h-[22vh] flex items-center justify-center mx-[2.5vw] md:mx-[1vw]"></div>
                            {/* Nome da comunidade com padding inferior aumentado para aumentar o comprimento do card e nova cor */}
                            <div className="pt-[2vh] pb-[4vh] px-[1vw] text-center flex-grow flex flex-col justify-center">
                                {/* Padding vertical em vh, horizontal em vw */}
                                <h4
                                    className="text-[#24BD0A] break-words uppercase font-['BN_Bobbie_Sans'] text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] font-normal"
                                    style={{
                                        fontFamily:
                                            '"BN Bobbie Sans", sans-serif',
                                    }}
                                >
                                    {community.name}
                                </h4>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Card de criar comunidade */}
                <div
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-[#B7C7B7] bg-[#e3efe3] rounded-[32px] h-[30vh] md:h-[22vh] min-h-[180px] transition hover:border-[#24BD0A]"
                >
                    <span className="text-6xl text-[#B7C7B7]">+</span>
                    <span className="text-[#B7C7B7]">
                        Participe de uma nova comunidade
                    </span>
                </div>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogContent className="w-[60vw] max-w-[60vw] min-h-[60vh] max-h-[80vh] overflow-y-auto bg-[#C1DDC5]">
                        <DialogHeader>
                            <DialogTitle className="text-black underline text-2xl font-bold text-center">
                                ADICIONAR COMUNIDADES
                            </DialogTitle>
                        </DialogHeader>
                        <GroupList
                            title="Grupos Disponíveis (Entrar no Grupo)"
                            groups={groupsToShow.map((g) => ({
                                ...g,
                                description: "",
                            }))}
                            actionButtonText="Entrar no Grupo"
                            onActionClick={handleJoinGroup}
                            emptyListMessage="Nenhum grupo novo disponível."
                            isLoading={
                                isLoadingAllGroups && allGroups.length === 0
                            }
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default StyledCommunityGrid;
