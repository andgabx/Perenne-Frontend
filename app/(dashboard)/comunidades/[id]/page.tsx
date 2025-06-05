"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardDescription,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import GetLastPosts from "./_components/last-posts-list";
import PostForm from "./_components/create-post-form";
import { getHeaders } from "@/pages/api/headers";
import { useSession } from "next-auth/react";

interface Member {
    userId: string;
    firstName: string;
    lastName: string;
    // outros campos se quiser
}

interface GrupoData {
    title: string;
    description: string;
}

const Grupo = () => {
    const params = useParams();
    const id = params?.id;
    const [grupo, setGrupo] = useState<GrupoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);
    const session = useSession();

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

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{grupo?.title}</CardTitle>
                    <CardDescription>
                        Descrição: {grupo?.description}
                    </CardDescription>
                </CardHeader>
            </Card>

            <GetLastPosts />
            <PostForm groupId={id as string} />
        </div>
    );
};

export default Grupo;
