"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DeletePostButton from "./delete-post-button";
import { getLastPosts } from "@/pages/api/post/get-last-posts";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    createdById: string;
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
                setPosts(data);
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
        <div>
            <Suspense fallback={<div>Carregando posts...</div>}>
                <h1 className="text-2xl font-bold py-12">Últimas postagens</h1>
                {!loading && !error && (
                    <ul>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <li
                                    key={post.id}
                                    className="mb-4 border-b pb-2 flex justify-between max-w-[80vw] mx-auto"
                                >
                                    <p>{post.id}</p>
                                    <strong>{post.title}</strong>
                                    <p>{post.content}</p>
                                    <span className="text-xs text-gray-500">
                                        Criado em:{" "}
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleString()}
                                    </span>
                                    <DeletePostButton
                                        postId={post.id}
                                        groupId={feedId}
                                    />
                                </li>
                            ))
                        ) : (
                            <li key="no-posts">Nenhuma postagem encontrada.</li>
                        )}
                    </ul>
                )}
            </Suspense>
        </div>
    );
}
