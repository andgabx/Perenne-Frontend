import { getHeaders } from "@/pages/api/headers";

export async function createGroup(
    token: string,
    name: string,
    description: string
): Promise<boolean> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/systemadmin/creategroup`,
        {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify({ name, description }),
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Erro ao criar grupo");
    }
    return true;
}
