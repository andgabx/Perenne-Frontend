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

function PostForm({ groupId }: { groupId: string }) {
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
            router.push(`/descoberta/grupo/${groupId}`);
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
            className="mb-6 mt-6 flex flex-col gap-2 max-w-md"
        >
            <h2 className="font-bold text-lg">Criar nova postagem</h2>
            <input
                type="text"
                placeholder="Título"
                {...register("title")}
                className="border rounded px-2 py-1"
            />
            {errors.title && (
                <span className="text-red-500 text-sm">
                    {errors.title.message}
                </span>
            )}
            <textarea
                placeholder="Conteúdo"
                {...register("content")}
                className="border rounded px-2 py-1"
            />
            <Button
                type="submit"
                className="bg-primary text-white rounded px-4 py-2 mt-2"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Postar"}
            </Button>
        </form>
    );
}

export default PostForm;
