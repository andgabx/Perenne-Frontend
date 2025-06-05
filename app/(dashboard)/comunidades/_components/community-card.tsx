// app/(dashboard)/chat/_components/StyledCommunityGrid.tsx
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getGroups, Group } from "@/pages/api/group/get-group-by-user";

interface StyledCommunityGridProps {
    selectedCommunity: string | null;
    setSelectedCommunity: (id: string) => void;
}

const StyledCommunityGrid: React.FC<StyledCommunityGridProps> = ({
    setSelectedCommunity,
}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (session?.user?.accessToken) {
                const groupsData = await getGroups(session.user.accessToken);
                setGroups(groupsData);
            }
        };

        fetchGroups();
    }, [session]);

    return (
        <div className="p-[2vw] md:p-[1.0vw]">
            {/* Padding geral do contêiner */}
            <h3
                className="text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] font-bold text-[#FCB201] mb-[4vh] text-center uppercase tracking-wide font-['BN_Bobbie_Sans']"
                style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
            >
                MINHAS COMUNIDADES
            </h3>
            {groups.length === 0 && (
                <p className="text-center text-gray-500 text-[1.2vw] md:text-[1vw]">
                    Você ainda não participa de nenhuma comunidade.
                </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 gap-4">
                {/* Espaçamento da grade */}
                {groups.map((community) => (
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
                            <div className="bg-[#FCB201] rounded-t-[20px] rounded-b-[20px] h-[20vh] md:h-[22vh] flex items-center justify-center mx-[2.5vw] md:mx-[1vw]">
                                
                            </div>
                            {/* Nome da comunidade com padding inferior aumentado para aumentar o comprimento do card e nova cor */}
                            <div className="pt-[2vh] pb-[4vh] px-[1vw] text-center flex-grow flex flex-col justify-center">
                                {/* Padding vertical em vh, horizontal em vw */}
                                <h4
                                    className="text-[#24BD0A] break-words uppercase font-['BN_Bobbie_Sans'] text-[1.8vw] md:text-[1.5vw] lg:text-[1.2vw] font-normal" // Tamanho da fonte em vw com breakpoints
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
            </div>
        </div>
    );
};

export default StyledCommunityGrid;
