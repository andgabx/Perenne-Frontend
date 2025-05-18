"use client"; // Importante para Next.js 13+ App Router ou para indicar que é um Client Component no Pages Router
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"; // Mantenho, embora não seja usado neste snippet
import React, { useState, useEffect } from "react"; // Importando useEffect para logs de renderização

const Login = () => {
    // 1. Verifique o estado da sessão ao renderizar o componente
    const { data: session, status } = useSession(); // Adicione 'status' para mais detalhes
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Log para ver o estado da sessão toda vez que o componente renderiza
    useEffect(() => {
        console.log('Componente Login Renderizado.');
        console.log('Dados da Sessão:', session);
        console.log('Status da Sessão:', status); // 'loading', 'authenticated', 'unauthenticated'
        if (status === 'unauthenticated') {
            console.log('Usuário não autenticado, formulário de login deveria estar visível.');
        } else if (status === 'authenticated') {
            console.log('Usuário autenticado, mostrando botão de Sign Out.');
        }
    }, [session, status]); // Dependências para o useEffect

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o comportamento padrão de recarregamento da página do formulário
        
        // 2. Verifique se handleSignIn está sendo acionada
        console.log('handleSignIn foi acionada!'); 
        setError("");

        try {
            // 3. Verifique os valores antes de chamar signIn
            console.log('Tentando signIn com:', { email, password });
            const result = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false, // Importante para lidar com o erro no próprio componente
            });

            // 4. Verifique o resultado do signIn
            console.log('Resultado do signIn:', result);

            if (result?.error) {
                setError("Invalid email or password");
                console.error('Erro de login retornado por signIn:', result.error);
            } else {
                // Login bem-sucedido. Você pode querer redirecionar aqui.
                // Ex: import { useRouter } from 'next/router';
                // const router = useRouter();
                // router.push('/dashboard');
                console.log('Login bem-sucedido! Redirecionando...');
            }
        } catch (error) {
            setError("An error occurred during sign in");
            console.error("Erro capturado no catch de handleSignIn:", error);
        }
    };

    return (
        <div className="bg-card p-2 flex gap-5">
            <div className="ml-auto flex gap-2">
                {/* 5. A condição de renderização do formulário */}
                {session?.user ? ( // Se 'session.user' existe (usuário logado), mostra o botão de logout
                    <>
                        <p className="text-sky-600">Olá, {session.user.name}</p>
                        <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                                console.log('Clicou em Sign Out');
                                signOut();
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : ( // Se 'session.user' NÃO existe (usuário não logado), mostra o formulário de login
                    <form
                        onSubmit={handleSignIn} // Este é o evento que deve disparar a função
                        className="flex flex-col gap-4"
                    >
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email" // Use 'email' para validação HTML básica
                                id="email"
                                name="email" // Importante para formulários HTML, mas aqui o React lida com isso
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit" // Garante que o botão submeta o formulário
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;