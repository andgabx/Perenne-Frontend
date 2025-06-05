"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DeletePostButton from "./delete-post-button";
import { getLastPosts } from "@/pages/api/post/get-last-posts";
import { MoreHorizontal, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Post {
    id: string;
    createdBy: {
        id: string;
        name: string;
        avatar: string;
    };
    title: string;
    content: string;
    createdAt: string;
    createdById: string;
}

function getInitials(name: string) {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[1][0];
}

function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `Há ${diff} segundos`;
    if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
    return date.toLocaleDateString();
}

export default function GetLastPosts() {
    const session = useSession();
    const params = useParams();
    const feedId = params?.id as string;
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!feedId) return;
        setLoading(true);
        setError(false);

        const fetchPosts = async () => {
            try {
                const token = session.data?.user.accessToken;
                if (!token) throw new Error("Token não encontrado");

                const data = await getLastPosts(feedId, token);
                setPosts(data as unknown as Post[]);
            } catch (error) {
                console.error("Erro ao buscar posts:", error);
                setPosts([]);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (session.status === "authenticated") {
            fetchPosts();
        }
    }, [feedId, session.status, session.data]);

    return (
        <div className="bg-[#E3F2E6] min-h-[200px] rounded-[32px] p-6 flex flex-col gap-6">
            <Suspense fallback={<div>Carregando posts...</div>}>
                {!loading && !error && (
                    <div className="flex flex-col gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="relative bg-white rounded-[24px] shadow-md overflow-hidden border border-[#E3F2E6]"
                                >
                                    <div className="absolute bottom-0 left-0 w-full h-2 bg-[#FFC72C] rounded-b-[24px] z-10" />
                                    <div className="p-6 pb-8 flex flex-col gap-2 relative z-20">
                                        {/* Topo: Avatar, nome, papel, tempo, opções */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <div className="w-12 h-12 rounded-full bg-[#B6E388] flex items-center justify-center text-xl font-bold text-[#234B0C] border-2 border-white shadow"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-[#234B0C] mt-0.5">
                                                        {timeAgo(
                                                            post.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Opções */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 rounded-full hover:bg-gray-100 text-[#234B0C]">
                                                        <MoreHorizontal
                                                            size={22}
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem asChild>
                                                        <DeletePostButton
                                                            postId={post.id}
                                                            groupId={feedId}
                                                        />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        {/* Título */}
                                        <h2 className="text-xl font-bold mb-2 text-[#234B0C]">
                                            {post.title}
                                        </h2>
                                        {/* Conteúdo */}
                                        <div className="bg-[#F8FAF9] rounded-xl p-4 text-base text-black min-h-[60px]">
                                            {post.content}
                                        </div>
                                        {/* Rodapé: Like */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <ThumbsUp className="w-6 h-6 text-[#234B0C]" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">
                                Nenhuma postagem encontrada.
                            </div>
                        )}
                    </div>
                )}
            </Suspense>
        </div>
    );
}
