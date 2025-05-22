import { API_URL } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useState } from "react";


function PostForm({ groupId }: { groupId: string }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/api/feed/${groupId}/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(session?.user?.accessToken && {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    }),
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });
            if (!res.ok) throw new Error("Erro ao criar postagem");
            setSuccess(true);
            setTitle("");
            setContent("");
        } catch (err: any) {
            setError(err.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 mt-6 flex flex-col gap-2 max-w-md"
        >
            <h2 className="font-bold text-lg">Criar nova postagem</h2>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded px-2 py-1"
                required
            />
            <textarea
                placeholder="Conteúdo"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border rounded px-2 py-1"
                required
            />
            <button
                type="submit"
                className="bg-primary text-white rounded px-4 py-2 mt-2"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Postar"}
            </button>
            {success && (
                <p className="text-green-600">Postagem criada com sucesso!</p>
            )}
            {error && <p className="text-red-600">{error}</p>}
        </form>
    );
}

export default PostForm;
