import { getHeaders } from "@/pages/api/headers";

export interface Group {
    id: string;
    name: string;
}

export async function getGroups(accessToken: string): Promise<Group[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/getgroups`,
            {
                headers: getHeaders(accessToken),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch groups:", errorText);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error in getGroups:", error);
        return [];
    }
}
