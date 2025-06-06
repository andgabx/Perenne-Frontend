import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { getHeaders } from "@/pages/api/headers";

interface EditPostFormProps {
    postId: string;
    groupId: string;
    initialTitle: string;
    initialContent: string;
    onSuccess?: () => void;
}

interface EditPostDTO {
    PostIdString: string;
    Title: string;
    Content: string;
    ImageUrl?: string;
}

const EditPostForm = ({
    postId,
    groupId,
    initialTitle,
    initialContent,
    onSuccess,
}: EditPostFormProps) => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: initialTitle,
            content: initialContent,
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const token = session?.user?.accessToken;
            if (!token) throw new Error("Token não encontrado");
            const dto: EditPostDTO = {
                PostIdString: postId,
                Title: data.title,
                Content: data.content,
                ImageUrl: "",
            };
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/feed/${groupId}/editpost`,
                {
                    method: "POST",
                    headers: getHeaders(token),
                    body: JSON.stringify(dto),
                }
            );
            if (!res.ok) throw new Error("Erro ao editar post");
            if (onSuccess) onSuccess();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Título"
                {...register("title", { required: true })}
                className="w-full bg-[#e2f0e4] text-[#14290e] text-xl font-bold rounded-2xl px-6 py-3 outline-none border-none placeholder:text-[#14290e] placeholder:opacity-70 shadow-sm"
            />
            <textarea
                placeholder="Conteúdo"
                {...register("content", { required: true })}
                className="w-full bg-[#e2f0e4] text-[#14290e] text-base rounded-2xl px-6 py-4 min-h-[120px] outline-none border-none placeholder:text-[#14290e] placeholder:opacity-50 shadow-sm"
            />
            <Button
                type="submit"
                className="w-full bg-[#FFB800] text-[#14290e] text-xl font-bold rounded-2xl py-3 mt-2 shadow-none border-none hover:bg-[#ffc72c] transition-all"
                disabled={loading}
            >
                {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
        </form>
    );
};

export default EditPostForm;
