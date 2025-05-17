import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = "http://127.0.0.1:5124"; 
const EXPIRATION_TOKEN_TIME = 60 * 60 * 24 * 1000;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default NextAuth(
    
    {

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
                console.log('Credenciais recebidas:', credentials);
                
                
                try {
                  // 1. Login
                  const loginRes = await fetch(`${API_URL}/api/user/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials)
                  });
                  console.log('Resposta do login:', await loginRes.clone().text());
              
                  if (!loginRes.ok) throw new Error('Falha no login');
              
                  const userData = await loginRes.json();
                  console.log('Dados do usuário:', userData);
              
                  // 2. Token
                  const tokenRes = await fetch(`${API_URL}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: userData.id,
                      email: userData.email
                    })
                  });


                  console.log('Resposta do token:', await tokenRes.clone().text());
              
                  if (!tokenRes.ok) throw new Error('Falha no token');
              
                  const token = await tokenRes.text();
                  console.log('Token JWT:', token);
              
                  return {
                    id: userData.id,
                    email: userData.email,
                    name: `${userData.firstName} ${userData.lastName}`,
                    accessToken: token,
                    expiresIn: Date.now() + (24 * 60 * 60 * 1000) // 24h
                  };

               // nesse return eu dei spread em todo o corpo da primeira response, assim como o o token que vem na 2a, e o tempo de expiracao 
                // tu manipula la na constante que criei no topo do codigo

                } catch (error) {
                  console.error('Erro completo:', error);
                  return null;
                }
              }
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
                        expiresIn: user.expiresIn,
                    };
                }

                if (Date.now() > (token.expiresIn as number)) {
                    throw new Error("Token expirado");
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
        // vc vai parar pra ver a documentacao do nextauth pra ver pra que serve isso aqui
    },

    session: {
        strategy: "jwt",
        maxAge: EXPIRATION_TOKEN_TIME / 1000, 
        // e isso aqui tb vai ler bonitinho

}
} );


