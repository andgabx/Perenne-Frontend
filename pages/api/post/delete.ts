"use server";

import { getHeaders } from "@/pages/api/headers";

export const deletePost = async (postId: string, groupId: string, token: string) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feed/${groupId}/deletepost/${postId}`,
        {
            method: "DELETE",
            headers: getHeaders(token),
        }
    );
    if (!response.ok) {
        throw new Error(`Falha ao deletar post: ${response.statusText}`);
    }
};
