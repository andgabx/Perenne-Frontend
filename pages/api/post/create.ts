"use server";

interface CreatePostData {
    title: string;
    content: string;
    imageUrl?: string | null;
}

export const createPost = async (
    groupId: string,
    data: CreatePostData,
    token: string
) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feed/${groupId}/createpost`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao criar postagem");
    }
};
