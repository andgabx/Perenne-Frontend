"use server";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    createdById: string;
}

export const getLastPosts = async (
    groupId: string,
    token: string
): Promise<Post[]> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feed/${groupId}/getposts/10`, // mudar esse numero pra manipular os ultimos posts que forem aparecer
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar posts");
    }

    return response.json();
};
