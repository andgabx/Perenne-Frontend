"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardTitle,
    CardHeader,
    CardDescription,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import GetLastPosts from "./getlastposts";
import PostForm from "./formpost";

interface Member {
    userId: string;
    firstName: string;
    lastName: string;
    // outros campos se quiser
}

interface GrupoData {
    name: string;
    description: string;
    memberList: Member[];
}



const Grupo = () => {
    const params = useParams();
    const id = params?.id;
    const [grupo, setGrupo] = useState<GrupoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setErro(false);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${id}`, { method: "GET" })
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar grupo");
                return res.json();
            })
            .then((data) => setGrupo(data))
            .catch(() => {
                setGrupo(null);
                setErro(true);
            })
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div>
            {loading && <h1>Carregando...</h1>}

            {!loading && !erro && grupo && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Comunidade: {grupo.name}</CardTitle>
                            <CardDescription>
                                Descrição: {grupo.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <p>Membros:</p>
                    <ul>
                        {grupo.memberList && grupo.memberList.length > 0 ? (
                            grupo.memberList.map((membro) => (
                                <li key={membro.userId}>
                                    {membro.firstName} {membro.lastName}
                                </li>
                            ))
                        ) : (
                            <li>Nenhum membro encontrado.</li>
                        )}
                    </ul>
                </>
            )}
            <GetLastPosts />
            <PostForm groupId={id as string} />
        </div>
    );
};

export default Grupo;
