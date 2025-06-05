"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Supondo que Card e Separator venham de um diretório de componentes UI
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { ShieldAlert, ArrowLeft } from "lucide-react";

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

const RecoverCode = () => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === "") {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Move focus to next input if a digit is entered
            if (value && index < 5) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, '').slice(0, 6);
        if (pasteData.length === 6) {
            const newCode = pasteData.split('');
            setCode(newCode);
            inputsRef.current[5]?.focus(); // Focus on the last input after paste
        } else if (pasteData.length > 0) {
            const newCode = [...code];
            for (let i = 0; i < pasteData.length; i++) {
                if (i < 6) newCode[i] = pasteData[i];
            }
            setCode(newCode);
            inputsRef.current[Math.min(5, pasteData.length -1)]?.focus();
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const enteredCode = code.join("");
        console.log("Verificando código:", enteredCode);

        // Simulação de chamada de API
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (enteredCode.length !== 6 || !/^\d{6}$/.test(enteredCode)) {
            setError("Código inválido. Deve conter 6 dígitos numéricos.");
            setIsLoading(false);
            toast.error("Código inválido!");
            return;
        }
        
        // Simulação de validação
        if (enteredCode === "000000") { // Simulação de código incorreto
             setError("Código incorreto. Tente novamente.");
             setIsLoading(false);
             toast.error("Código incorreto!");
             return;
        }


        toast.success("Código verificado com sucesso!");
        router.push("/reset-password"); // Ajuste a rota conforme necessário
        setIsLoading(false);
    };

    const handleResendCode = () => {
        setIsLoading(true);
        // Lógica para reenviar o código
        console.log("Reenviando código...");
        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            toast.success("Um novo código foi enviado!");
            setIsLoading(false);
            setCode(new Array(6).fill(""));
            inputsRef.current[0]?.focus();
        });
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat bg-[url('/bg.png')] bg-[position:100%_center] flex flex-col">
            <SiteHeader />
            <div className="flex flex-grow items-center justify-center px-4">
                <Card className={cardStyle}>
                    <div className="flex items-center justify-center mb-6 relative">
                        <button
                            onClick={() => router.push("/recover-password")} // Rota para a tela anterior
                            className="absolute left-0 text-green-600 hover:text-green-700 transition-colors"
                            aria-label="Voltar"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className={headerStyle}>Verificar Código</h1>
                    </div>
                    <Separator className="my-6 w-full" />
                    <form onSubmit={handleSubmit} className={formContainerStyle}>
                        {error && (
                            <div className="text-red-500 text-sm text-center p-3 bg-red-100 rounded-lg border border-red-300">
                                {error}
                            </div>
                        )}
                        <p className="text-center text-gray-600 mb-1">
                            Insira o código de 6 dígitos enviado para o seu e-mail ou telefone.
                        </p>
                         <p className="text-center text-xs text-gray-500 mb-4">
                            Se não encontrar na caixa de entrada, verifique sua pasta de spam.
                        </p>
                        <div className="flex justify-center gap-2 sm:gap-3 mb-4" onPaste={handlePaste}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { inputsRef.current[index] = el; }}
                                    type="text" // Use text para melhor controle de caracteres e backspace
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold bg-[#FFE29D] rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none border-none"
                                    required
                                    aria-label={`Dígito ${index + 1} do código de verificação`}
                                />
                            ))}
                        </div>
                        <button type="submit" className={commonButtonStyle} disabled={isLoading || code.join("").length !== 6}>
                            {isLoading ? "Verificando..." : "Verificar Código"}
                        </button>
                        <div className="text-center text-sm mt-4">
                            <span className="text-gray-600">Não recebeu o código? </span>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isLoading}
                                className="text-green-600 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Reenviar código
                            </button>
                        </div>
                         <div className="text-center text-sm mt-2">
                            <Link
                                href="/login" // Ajuste a rota para login
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Voltar para o Login
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RecoverCode;
