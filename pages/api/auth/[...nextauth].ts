import { AuthToken, User } from "@/app/types/next-auth";
import NextAuth, { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = "http://localhost:5124";
const EXPIRATION_TOKEN_TIME = 60 * 60 * 24;

export default NextAuth({
    // peixoto, como sao dois endpoints que a gente tem que usar, temos que fazer duas requisicoes diferentes
    // a primeira vai usar o endpoint de api/user/login pra retornar o body que vai conter o email e o id do user
    // a gente pega o id do user e o email e passa em outro body para a requisicao do endpoint /token
    // eh apenas nessa segunda requisicao que a gente vai obter o token, pq nossa api separa, diferente da api do indiano pobre la

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "text",
                    placeholder: "seu email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "sua senha",
                },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // primeira requisicao

                    const response = await fetch(`${API_URL}/api/user/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    // verifica se deu erro na primeira requisicao

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message || "DEU RUIM");
                    }

                    const userData: User = await response.json();

                    // Segunda requisicao

                    const tokenRes = await fetch(`${API_URL}/token`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: userData.id,
                            email: userData.email,
                        }),
                    });

                    // aqui eh verificacao se deu erro na segunda requisicao

                    if (!tokenRes.ok) {
                        const errorData = await tokenRes.json();
                        throw new Error(
                            errorData.message || "DEU RUIM COM O TOKEN"
                        );
                    }

                    const token: AuthToken = await tokenRes.json();

                    return {
                        ...userData,
                        accessToken: token,
                        expires: Date.now() + EXPIRATION_TOKEN_TIME,
                    } as User;

                    // nesse return eu dei spread em todo o corpo da primeira response, assim como o o token que vem na 2a, e o tempo de expiracao
                    // tu manipula la na constante que criei no topo do codigo
                } catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            // Se for o primeiro login, adiciona os dados do usuário ao token
            if (user) {
                return {
                    ...token,
                    ...user,
                    accessToken: user.accessToken as AuthToken,
                    expiresIn: user.expiresIn as number,
                };
            }

            // Se o token ainda não expirou, retorna ele mesmo
            if (Date.now() < (token.expiresIn as number)) {
                return token;
            }

            // Se chegou aqui, o token expirou - podemos implementar refresh token aqui se necessário
            return { ...token, error: "TokenExpiredError" };
        },

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    accessToken: token.accessToken,
                },
                expires: new Date(token.expiresIn).toISOString(),
            };
        },
    },
    pages: {
        signIn: "/login",
        error: "/api/auth/error",
        signOut: "/login",
        newUser: "/register",
        verifyRequest: "/verify-request",
    },
    session: {
        strategy: "jwt",
        maxAge: EXPIRATION_TOKEN_TIME,
    },
    secret: process.env.NEXTAUTH_SECRET,
});
