"use client"; // Importante para Next.js 13+ App Router ou para indicar que é um Client Component no Pages Router
import { SiteHeader } from "@/components/sidebar/site-header";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react"; // Importando useEffect para logs de renderização
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Login = () => {
    // 1. Verifique o estado da sessão ao renderizar o componente
    const { data: session, status } = useSession(); // Adicione 'status' para mais detalhes
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    // Log para ver o estado da sessão toda vez que o componente renderiza
    useEffect(() => {
        console.log("Componente Login Renderizado.");
        console.log("Dados da Sessão:", session);
        console.log("Status da Sessão:", status); // 'loading', 'authenticated', 'unauthenticated'
        if (status === "unauthenticated") {
            console.log(
                "Usuário não autenticado, formulário de login deveria estar visível."
            );
        } else if (status === "authenticated") {
            console.log("Usuário autenticado, mostrando botão de Sign Out.");
        }
    }, [session, status]); // Dependências para o useEffect

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o comportamento padrão de recarregamento da página do formulário
        // 2. Verifique se handleSignIn está sendo acionada
        console.log("handleSignIn foi acionada!");
        setError("");

        try {
            // 3. Verifique os valores antes de chamar signIn
            console.log("Tentando signIn com:", { email, password });
            const result = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false, // Importante para lidar com o erro no próprio componente
            });

            // 4. Verifique o resultado do signIn
            console.log("Resultado do signIn:", result);

            if (result?.error) {
                setError("Invalid email or password");
                console.error(
                    "Erro de login retornado por signIn:",
                    result.error
                );
            } else {
                // Login bem-sucedido. Você pode querer redirecionar aqui.
                // Ex: import { useRouter } from 'next/router';
                // const router = useRouter();
                // router.push('/dashboard');
                console.log("Login bem-sucedido! Redirecionando...");
                router.push("/descoberta");
            }
        } catch (error) {
            setError("An error occurred during sign in");
            console.error("Erro capturado no catch de handleSignIn:", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-cover bg-no-repeat bg-[url('/bg.png')] bg-[position:100%_center]">
            <SiteHeader />
            <div className="flex min-h-[calc(100vh-var(--header-height))] items-center justify-center">
                <Card className=" rounded-2xl border-2 shadow-lg w-[45vw] p-8">
                    <h1 className="text-2xl font-bold text-center text-green-700 mb-6 uppercase">
                        LOGIN
                    </h1>
                    <Separator className="my-6 w-full" />
                    <form
                        onSubmit={handleSignIn}
                        className="flex flex-col gap-6 w-[65%] mx-auto"
                    >
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-4 py-3 bg-[#FFE29D] rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 border-none"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-4 py-3 bg-[#FFE29D] rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 border-none pr-10"
                                required
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                                Esqueceu a senha?
                            </span>
                            <Link
                                href="/recover" 
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Recuperar minha senha
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl transition"
                        >
                            ENTRAR
                        </button>
                        <div className="text-center text-sm mt-2">
                            <span className="text-gray-700">
                                Não tem uma conta?{" "}
                            </span>
                            <Link
                                href="/register"
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Criar conta
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
