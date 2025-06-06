"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, Post } from "@/lib/schemas/post";
import { Button } from "@/components/ui/button";
import { createPost } from "@/pages/api/post/create";

interface PostFormProps {
    groupId: string;
    onPostCreated?: () => void;
}

function PostForm({ groupId, onPostCreated }: PostFormProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Post>({
        resolver: zodResolver(postSchema),
    });

    const onSubmit = async (data: Post) => {
        setLoading(true);
        setSuccess(false);
        setError(null);
        try {
            if (!session?.user?.accessToken) {
                throw new Error("Token não encontrado");
            }

            const postData = {
                title: data.title,
                content: data.content || "",
                imageUrl: null,
            };

            await createPost(groupId, postData, session.user.accessToken);
            setSuccess(true);
            reset();
            toast.success("Postagem criada com sucesso!");
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error("Erro ao criar postagem:", error);
            toast.error("Erro ao criar postagem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 w-full max-w-4xl mx-auto items-center"
        >
            <input
                type="text"
                placeholder="Título da postagem"
                required
                {...register("title")}
                className="w-full bg-[#e2f0e4] text-[#14290e] text-3xl font-bold rounded-2xl px-8 py-4 outline-none border-none placeholder:text-[#14290e] placeholder:opacity-70 shadow-sm"
            />
            <textarea
                placeholder="Conteúdo da postagem"
                required
                {...register("content")}
                className="w-full bg-[#e2f0e4] text-[#14290e] text-2xl rounded-2xl px-8 py-6 min-h-[170px] outline-none border-none placeholder:text-[#14290e] placeholder:opacity-50 shadow-sm"
            />
            <Button
                type="submit"
                className="w-[20vw] max-w-full mx-auto bg-[#FFB800] text-[#14290e] text-3xl font-bold rounded-2xl py-8 mt-8 shadow-none border-none hover:bg-[#ffc72c] transition-all"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Concluído"}
            </Button>
        </form>
    );
}

export default PostForm;
