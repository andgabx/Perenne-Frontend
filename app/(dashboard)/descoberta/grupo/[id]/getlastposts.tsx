"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "@/pages/api/auth/[...nextauth]";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    createdById: string;
    // outros campos se necessário
}

export default function GetLastPosts() {
    const params = useParams();
    const feedId = params?.id;
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!feedId) return;
        setLoading(true);
        setError(false);
        fetch(`${API_URL}/api/feed/${feedId}/GetLast10Posts`)
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar posts");
                return res.json();
            })
            .then((data) => setPosts(data))
            .catch(() => {
                setPosts([]);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, [feedId]);

    return (
        <div>
            <h1>Últimas postagens</h1>
            {loading && <p>Carregando posts...</p>}
            {error && <p className="text-red-600">Erro ao buscar posts</p>}
            {!loading && !error && (
                <ul>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <li key={post.id} className="mb-4 border-b pb-2">
                                <strong>{post.title}</strong>
                                <p>{post.content}</p>
                                <span className="text-xs text-gray-500">
                                    Criado em:{" "}
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li>Nenhuma postagem encontrada.</li>
                    )}
                </ul>
            )}
        </div>
    );
}
