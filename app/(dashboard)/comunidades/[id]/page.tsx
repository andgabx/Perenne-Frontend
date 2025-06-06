"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import GetLastPosts from "./_components/last-posts-list";
import PostForm from "./_components/create-post-form";
import { getHeaders } from "@/pages/api/headers";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Member {
    userId: string;
    firstName: string;
    lastName: string;
}

interface GrupoData {
    name: string;
    description: string;
    memberList?: any[];
}

const Grupo = () => {
    const params = useParams();
    const id = params?.id;
    const [grupo, setGrupo] = useState<GrupoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const session = useSession();
    const [open, setOpen] = useState(false);
    const [refreshPosts, setRefreshPosts] = useState(0);

    useEffect(() => {
        if (!id || session.status !== "authenticated") return;
        setLoading(true);
        setErro(false);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${id}`, {
            method: "GET",
            headers: getHeaders(session.data?.user.accessToken || ""),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar grupo");
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setGrupo(data);
            })
            .catch(() => {
                setGrupo(null);
                setErro(true);
            })
            .finally(() => setLoading(false));
    }, [id, session.status, session.data]);

    const handlePostCreated = () => {
        setOpen(false);
        setRefreshPosts((v) => v + 1);
    };

    return (
        <div className="px-16">
            <div
                className="relative rounded-[20px] bg-[#467513] w-[60vw] mx-auto py-3 flex items-center justify-between mt-2 mb-8 min-h-[56px]"
                style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
            >
                {/* Barra amarela no topo */}
                <div
                    className="absolute top-0 left-0 w-full h-2 bg-[#FFC72C] rounded-t-[20px]"
                    style={{ zIndex: 2 }}
                />
                {/* Seta de voltar */}
                <button
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-[#365a0f] z-10"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft size={24} />
                </button>
                {/* Título centralizado */}
                <div className="flex-1 flex justify-center items-center">
                    <span
                        className="text-white font-extrabold text-lg md:text-xl text-center"
                        style={{ letterSpacing: 0.5 }}
                    >
                        #{grupo?.name}
                    </span>
                </div>
                {/* Botão de postar */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            id="safe-focus-button"
                            className="bg-white text-[#467513] font-bold rounded-full px-6 py-2 flex items-center gap-2 shadow-none hover:bg-gray-100 transition-all"
                            style={{ minWidth: 110 }}
                        >
                            <Plus size={18} className="mr-1" />
                            Postar
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="p-0 bg-white rounded-[36px] w-[98vw] max-w-4xl mx-auto border-none shadow-none overflow-hidden"
                        style={{ minHeight: 480 }}
                        showCloseButton={false}
                    >
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <div className="w-full bg-white flex items-center justify-between px-8 py-4 relative">
                            <DialogClose asChild>
                                <button className="text-white text-3xl font-bold focus:outline-none">
                                    ×
                                </button>
                            </DialogClose>
                            <span className="absolute left-0 right-0 flex justify-center items-center pointer-events-none">
                                <span
                                    className="text-black font-extrabold text-3xl tracking-wide text-center uppercase"
                                    style={{ letterSpacing: 1 }}
                                >
                                    NOVA POSTAGEM
                                </span>
                            </span>
                        </div>

                        <Separator className="bg-black" />

                        {/* Formulário */}
                        <div className="w-full px-6 pb-8 pt-6">
                            <PostForm
                                groupId={id as string}
                                onPostCreated={handlePostCreated}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <ScrollArea className="h-[78vh]">
                <GetLastPosts refreshTrigger={refreshPosts} />
            </ScrollArea>
        </div>
    );
};

export default Grupo;
