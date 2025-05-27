import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const EXPIRATION_TOKEN_TIME = 60 * 60 * 2 * 1000; // 2 horas

interface Token {
    id: string;
    email: string;
    accessToken?: string;
    expiresIn?: number;
    error?: string;
}

async function refreshAccessToken(token: Token) {
    try {
        // Request a new token using userId and email
        const tokenRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/identity/generatetoken`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: token.id,
                    email: token.email,
                }),
            }
        );

        console.log(
            "Resposta do refresh token:",
            await tokenRes.clone().text()
        );

        if (!tokenRes.ok) throw new Error("Falha ao renovar o token");

        const newToken = await tokenRes.text();
        console.log("Novo JWT Token:", newToken);

        return {
            ...token,
            accessToken: newToken,
            expiresIn: Date.now() + EXPIRATION_TOKEN_TIME, // 2h
        };
    } catch (error) {
        console.error("Erro ao atualizar token:", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export default NextAuth({
    // peixoto, como sao dois endpoints que a gente tem que usar, temos que fazer duas requisicoes diferentes
    // a primeira vai usar o endpoint de api/user/login pra retornar o body que vai conter o email e o id do user
    // a gente pega o id do user e o email e passa em outro body para a requisicao do endpoint /token
    // tu vai ter que configurar um pouco diferente a API pq o Next tava brigando, vou commitar uma versao modificada da API com a branch de mesmo nome que essa

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials, req) {
                console.log("Credenciais recebidas:", credentials);

                try {
                    // 1. Login
                    const loginRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/guest/login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(credentials),
                        }
                    );
                    console.log(
                        "Resposta do login:",
                        await loginRes.clone().text()
                    );

                    if (!loginRes.ok) throw new Error("Falha no login");

                    const userData = await loginRes.json();
                    // console.log('Dados do usuário:', userData);

                    // 2. Token
                    const tokenRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/generatetoken`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: userData.id,
                                email: userData.email,
                            }),
                        }
                    );

                    console.log(
                        "Resposta do token:",
                        await tokenRes.clone().text()
                    );

                    if (!tokenRes.ok) throw new Error("Falha no token");

                    const token = await tokenRes.text();
                    console.log("Token JWT:", token);

                    return {
                        id: userData.id,
                        email: userData.email,
                        name: `${userData.firstName} ${userData.lastName}`,
                        accessToken: token,
                        expiresIn:
                            Math.floor(Date.now() / 1000) +
                            EXPIRATION_TOKEN_TIME, // 2h
                    };

                    // nesse return eu dei spread em todo o corpo da primeira response, assim como o o token que vem na 2a, e o tempo de expiracao
                    // tu manipula la na constante que criei no topo do codigo
                } catch (error) {
                    console.error("Erro completo:", error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            try {
                if (user) {
                    return {
                        ...token,
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        accessToken: user.accessToken,
                        expiresIn: Math.floor(
                            (user.expiresIn as number) / 1000
                        ),
                    };
                }

                // Se o token estiver expirado ou a menos de 5 minutos de expirar, atualiza-o
                const expirationThreshold = 5 * 60 * 1000; // 5 minutos em milissegundos
                if (
                    Date.now() >
                    (token.expiresIn as number) - expirationThreshold
                ) {
                    console.log("Token próximo da expiração, renovando...");
                    // Verificando se token tem email antes de fazer refresh
                    if (token.email) {
                        return refreshAccessToken(token as Token);
                    }
                    console.log("Token não tem email válido para renovação");
                    return token;
                }

                return token;
            } catch (error) {
                console.error("Erro no callback JWT:", error);
                throw error;
            }
        },

        async session({ session, token }) {
            try {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id as string,
                        name: token.name as string,
                        email: token.email as string,
                        accessToken: token.accessToken as string,
                    },
                    expires: token.expiresIn as number,
                };
            } catch (error) {
                console.error("Erro no callback Session:", error);
                throw error;
            }
        },
    },

    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        newUser: "/auth/register",
        // vc vai parar pra ver a documentacao do nextauth pra ver pra que serve isso aqui
    },

    session: {
        strategy: "jwt",
        maxAge: EXPIRATION_TOKEN_TIME,
        // e isso aqui tb vai ler bonitinho
    },
});
