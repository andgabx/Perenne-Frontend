import { getHeaders } from "../headers";

export const getUserInfo = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getuserinfo`, {
        headers: getHeaders(token),
    });

    if (!response.ok) {
        throw new Error("Erro ao obter informações do usuário");
    }

    return response.json();
};
