"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Supondo que Card e Separator venham de um diretório de componentes UI
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";

// Componentes UI Mock (substitua pelos seus componentes reais)
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`bg-white p-8 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const Separator = ({ className }: { className?: string }) => (
    <hr className={`border-gray-200 ${className}`} />
);

// Estilos comuns (idealmente, viriam de um arquivo de estilos global ou Tailwind config)
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

const Recover = () => {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        console.log("Solicitando recuperação para:", identifier);

        // Simulação de chamada de API
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (!identifier) {
            setError("Por favor, insira seu e-mail ou CPF.");
            setIsLoading(false);
            toast.error("Entrada inválida!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/; // Formatos xxx.xxx.xxx-xx ou xxxxxxxxxxx

        if (!emailRegex.test(identifier) && !cpfRegex.test(identifier.replace(/[.-]/g, ''))) {
            setError("Formato de e-mail ou CPF inválido.");
            setIsLoading(false);
            toast.error("Formato inválido!");
            return;
        }

        toast.success("Instruções enviadas! Verifique seu e-mail.");
        router.push("/enter-code"); // Ajuste a rota conforme necessário
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat bg-[url('/bg.png')] bg-[position:100%_center] flex flex-col">
            <SiteHeader />
            <div className="flex flex-grow items-center justify-center px-4">
                <Card className={cardStyle}>
                    <div className="flex items-center justify-center mb-6 relative">
                        <button
                            onClick={() => router.push("/login")} // Ajuste a rota para login
                            className="absolute left-0 text-green-600 hover:text-green-700 transition-colors"
                            aria-label="Voltar para o login"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className={headerStyle}>Recuperar Senha</h1>
                    </div>
                    <Separator className="my-6 w-full" />
                    <form onSubmit={handleSubmit} className={formContainerStyle}>
                        {error && (
                            <div className="text-red-500 text-sm text-center p-3 bg-red-100 rounded-lg border border-red-300">
                                {error}
                            </div>
                        )}
                        <p className="text-center text-gray-600 mb-4">
                            Insira seu e-mail ou CPF cadastrado para enviarmos as instruções de recuperação de senha.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="identifier"
                                    name="identifier"
                                    placeholder="E-mail ou CPF"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className={`${commonInputStyle} pl-10`}
                                    required
                                    aria-label="E-mail ou CPF"
                                />
                            </div>
                        </div>
                        <button type="submit" className={commonButtonStyle} disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar Instruções"}
                        </button>
                        <div className="text-center text-sm mt-4">
                            <Link
                                href="/login" // Ajuste a rota para login
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Lembra da senha? Voltar para o Login
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Recover;