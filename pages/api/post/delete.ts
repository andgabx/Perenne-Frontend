"use server";


export const deletePost = async (postId: string, groupId: string, token: string) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feed/${groupId}/deletepost/${postId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "69420",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error(`Falha ao deletar post: ${response.statusText}`);
    }
};
