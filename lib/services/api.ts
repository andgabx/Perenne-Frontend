const API_URL = "http://181.221.114.217:5000"; // IP vai virar uma variavel de ambiente posteriormente

export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    cpf: string;
}

export const createUser = async (userData: CreateUserRequest) => {
    try {
        const response = await fetch(`${API_URL}/api/user/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
