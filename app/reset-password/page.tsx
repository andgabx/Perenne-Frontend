"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Supondo que Card e Separator venham de um diretório de componentes UI
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react"; // Eye and EyeOff can be SVGs too

// Componentes UI Mock (substitua pelos seus componentes reais)
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`bg-white p-8 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const Separator = ({ className }: { className?: string }) => (
    <hr className={`border-gray-200 ${className}`} />
);

// Estilos comuns
const commonInputStyle = "px-4 py-3 bg-[#FFE29D] rounded-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 border-none w-full";
const commonButtonStyle = "w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl transition";
const cardStyle = "rounded-2xl border-2 border-gray-200 shadow-xl w-[90vw] md:w-[80vw] lg:w-[60vw] xl:w-[40vw] 2xl:w-[30vw] p-8 sm:p-12 bg-white";
const headerStyle = "text-2xl font-bold text-center text-green-700 mb-6 uppercase";
const formContainerStyle = "flex flex-col gap-6 w-full sm:w-[75%] md:w-[65%] mx-auto";

// Mock SiteHeader component
const SiteHeader = () => (
    <header className="py-4 bg-transparent text-center h-[var(--header-height,60px)]">
        {/* Seu logo ou título do site aqui */}
    </header>
);

// SVG icons for password visibility toggle
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;


const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (password.length < 8) {
            setError("A nova senha deve ter pelo menos 8 caracteres.");
            setIsLoading(false);
            toast.error("Senha muito curta!");
            return;
        }
        // Exemplo de validação de complexidade de senha (opcional)
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // if (!passwordRegex.test(password)) {
        //     setError("A senha deve conter letras maiúsculas, minúsculas e números.");
        //     setIsLoading(false);
        //     toast.error("Senha fraca!");
        //     return;
        // }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem. Verifique novamente.");
            setIsLoading(false);
            toast.error("As senhas não coincidem!");
            return;
        }
        
        setIsLoading(true);
        console.log("Redefinindo senha para:", password);
        // Simulação de chamada de API
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Senha redefinida com sucesso!");
        router.push("/login"); // Ajuste a rota conforme necessário
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat bg-[url('/bg.png')] bg-[position:100%_center] flex flex-col">
            <SiteHeader />
            <div className="flex flex-grow items-center justify-center px-4">
                <Card className={cardStyle}>
                    <div className="flex items-center justify-center mb-6 relative">
                        {/* Opcional: botão de voltar se fizer sentido no fluxo */}
                        {/* <button
                            onClick={() => router.push("/enter-code")} // Rota para a tela anterior
                            className="absolute left-0 text-green-600 hover:text-green-700"
                            aria-label="Voltar"
                        >
                            <ArrowLeft size={24} />
                        </button> */}
                        <h1 className={headerStyle}>Criar Nova Senha</h1>
                    </div>
                    <Separator className="my-6 w-full" />
                    <form onSubmit={handleSubmit} className={formContainerStyle}>
                        {error && (
                            <div className="text-red-500 text-sm text-center p-3 bg-red-100 rounded-lg border border-red-300">
                                {error}
                            </div>
                        )}
                        <p className="text-center text-gray-600 mb-4">
                            Crie uma nova senha segura para sua conta.
                        </p>
                        <div className="flex flex-col gap-2 relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nova Senha (mín. 8 caracteres)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${commonInputStyle} pl-10 pr-10`} // Espaço para ícones
                                required
                                aria-label="Nova Senha"
                            />
                            <button
                                type="button"
                                tabIndex={-1} // Não focável pelo teclado
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                         <div className="flex flex-col gap-2 relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirmar Nova Senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`${commonInputStyle} pl-10 pr-10`}
                                required
                                aria-label="Confirmar Nova Senha"
                            />
                             <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                            >
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <button type="submit" className={commonButtonStyle} disabled={isLoading}>
                           {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                        </button>
                         <div className="text-center text-sm mt-4">
                            <Link
                                href="/login" // Ajuste a rota para login
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Já tem uma senha? Voltar para o Login
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
