// app/api/group/create/route.ts (Este será seu novo arquivo de API Route)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]"; // Assumindo que authOptions está aqui
import { Session } from "next-auth";

// Remova o import de groupSchema e z aqui. A validação deve ser feita no Client Component
// ou você pode revalidar aqui, mas não é a causa do erro atual.
// import { groupSchema } from "@/lib/schemas/group";
// import { z } from "zod";

// Renomeie a função exportada para o método HTTP que você deseja (POST, GET, PUT, DELETE)
// O `request` do App Router já contém o corpo (body) e os headers
export async function POST(request: Request) {
    try {
        // Obtenha a sessão no lado do servidor
        const session = (await getServerSession(authOptions)) as Session;

        // Se não houver sessão, retorne um erro de não autenticado
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { message: "Não autenticado." },
                { status: 401 }
            );
        }

        // Parse o corpo da requisição JSON
        // O corpo da requisição HTTP (request) é onde o seu formulário do frontend enviará os dados
        const groupData = await request.json();

        // **Opcional:** Se você quer validar aqui no backend da API Route
        // try {
        //     groupSchema.parse(groupData);
        // } catch (validationError) {
        //     return NextResponse.json({ message: "Dados inválidos", errors: validationError.issues }, { status: 400 });
        // }

        const { name, description } = groupData;

        // Chame seu backend C#
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Se o seu backend C# precisar do accessToken, passe-o aqui
                // Ex: "Authorization": `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({
                userId: session.user.id, // Id do usuário da sessão NextAuth
                name,
                description,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Se o backend C# retornar um erro (status não-2xx), repasse-o
            console.error("Erro do backend ao criar grupo:", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 }); // 201 Created

    } catch (error: any) {
        console.error("Error creating group in API Route:", error);
        // Para erros inesperados, retorne 500
        return NextResponse.json(
            { error: "Erro interno do servidor ao processar requisição." },
            { status: 500 }
        );
    }
}