"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DeletePostButton from "./delete-post-button";
import { getLastPosts } from "@/pages/api/post/get-last-posts";
import {
    Edit,
    MoreHorizontal,
    ThumbsUp,
    Edit as EditIcon,
    Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import EditPostButton from "./edit-post-button";
import EditPostForm from "./edit-post-form";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ReactDOM from "react-dom";

interface Post {
    id: string;
    idString: string;
    title: string;
    content: string;
    createdAt: string;
    firstName: string;
    lastName: string;
    role: string;
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

interface GetLastPostsProps {
    refreshTrigger?: any;
}

export default function GetLastPosts({ refreshTrigger }: GetLastPostsProps) {
    const session = useSession();
    const params = useParams();
    const feedId = params?.id as string;
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [editPost, setEditPost] = useState<null | {
        postId: string;
        postIdString: string;
        initialTitle: string;
        initialContent: string;
    }>(null);
    const [deletePost, setDeletePost] = useState<null | {
        postId: string;
        groupId: string;
    }>(null);

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
    }, [feedId, session.status, session.data, refreshTrigger]);

    return (
        <div className="bg-[#E3F2E6] min-h-[200px] rounded-[32px] p-6 flex flex-col gap-6">
            <Suspense fallback={<div>Carregando posts...</div>}>
                {!loading && !error && (
                    <div className="flex flex-col gap-6 px-16">
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
                                                <div className="w-10 h-10 rounded-full bg-[#FFE14D] flex items-center justify-center text-lg font-bold text-[#234B0C] border-2 border-white shadow">
                                                    {getInitials(
                                                        `${post.firstName} ${post.lastName}`
                                                    )}
                                                </div>
                                                <span className="font-bold text-[#14290e] text-base mr-2">
                                                    {post.firstName}{" "}
                                                    {post.lastName}
                                                </span>
                                                <span className="bg-[#222] text-white text-xs font-semibold rounded-full px-3 py-1 mr-2">
                                                    {post.role}
                                                </span>
                                                <span className="text-xs text-[#6CBF43] font-medium">
                                                    {timeAgo(post.createdAt)}
                                                </span>
                                            </div>
                                            {/* Opções */}
                                            <DropdownMenu
                                                open={
                                                    openDropdownId === post.id
                                                }
                                                onOpenChange={(open) => {
                                                    setOpenDropdownId(
                                                        open ? post.id : null
                                                    );
                                                }}
                                            >
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 rounded-full hover:bg-gray-100 text-[#234B0C]">
                                                        <MoreHorizontal
                                                            size={22}
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-white rounded-2xl p-2 shadow-lg border border-[#E3F2E6]">
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2 text-[#14290e] text-base font-bold w-full px-4 py-3 rounded-xl hover:bg-[#e2f0e4] cursor-pointer transition-all"
                                                        onClick={() => {
                                                            setOpenDropdownId(
                                                                null
                                                            );
                                                            setEditPost({
                                                                postId: post.id,
                                                                postIdString:
                                                                    post.idString,
                                                                initialTitle:
                                                                    post.title,
                                                                initialContent:
                                                                    post.content,
                                                            });
                                                        }}
                                                    >
                                                        <Edit size={18} />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2 text-[#14290e] text-base font-bold w-full px-4 py-3 rounded-xl hover:bg-[#e2f0e4] cursor-pointer transition-all"
                                                        onClick={() => {
                                                            setOpenDropdownId(
                                                                null
                                                            );
                                                            setDeletePost({
                                                                postId: post.id,
                                                                groupId: feedId,
                                                            });
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                        Deletar
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
            {/* Dialog de edição global */}
            <Dialog
                open={!!editPost}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditPost(null);
                        setTimeout(() => {
                            const safeButton =
                                document.getElementById("safe-focus-button");
                            if (safeButton) safeButton.focus();
                        }, 0);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar postagem</DialogTitle>
                        <DialogDescription>
                            Edite o título e conteúdo do post abaixo.
                        </DialogDescription>
                    </DialogHeader>
                    {editPost && (
                        <EditPostForm
                            postId={editPost.postId}
                            postIdString={editPost.postIdString}
                            initialTitle={editPost.initialTitle}
                            initialContent={editPost.initialContent}
                            onSuccess={() => setEditPost(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
            {/* Dialog de deleção */}
            <Dialog
                open={!!deletePost}
                onOpenChange={(open) => {
                    if (!open) setDeletePost(null);
                }}
            >
                <DialogContent className="bg-white w-[30vw]">
                    <DialogHeader>
                        <DialogTitle>Deletar postagem</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja deletar esta postagem?
                        </DialogDescription>
                    </DialogHeader>
                    {deletePost && (
                        <DeletePostButton
                            postId={deletePost.postId}
                            groupId={deletePost.groupId}
                        />
                    )}
                    <DialogClose asChild>
                        <Button
                            className="bg-[#FFB800] text-[#234B0C] font-extrabold text-lg rounded-xl px-8 py-2 border-2 border-[#FFB800] shadow-none hover:bg-[#ffc72c] hover:text-[#234B0C] transition-all"
                            type="button"
                        >
                            Cancelar
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
}
