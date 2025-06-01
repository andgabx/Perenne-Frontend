"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
interface StepTwoProps {
    initialData: {
        CPF: string;
        email: string;
        password: string;
        confirmPassword: string;
        acceptTerms: boolean;
        nome: string;
        sobrenome: string;
    };
    onBack: () => void;
    onSubmit: (data: {
        CPF: string;
        email: string;
        password: string;
        confirmPassword: string;
        acceptTerms: boolean;
        nome: string;
        sobrenome: string;
    }) => void;
}

export default function StepTwo({
    initialData,
    onBack,
    onSubmit,
}: StepTwoProps) {
    const [CPF, setCPF] = useState(initialData.CPF);
    const [email, setEmail] = useState(initialData.email);
    const [password, setPassword] = useState(initialData.password);
    const [confirmPassword, setConfirmPassword] = useState(
        initialData.confirmPassword
    );
    const [acceptTerms, setAcceptTerms] = useState(initialData.acceptTerms);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        CPF: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: "",
    });
    const [nome] = useState(initialData.nome);
    const [sobrenome] = useState(initialData.sobrenome);
    const router = useRouter();

    const validate = () => {
        const newErrors = {
            CPF: "",
            email: "",
            password: "",
            confirmPassword: "",
            acceptTerms: "",
        };
        let isValid = true;

        // Validação de CPF
        if (!CPF.trim() || CPF.length !== 11) {
            newErrors.CPF = "CPF inválido";
            isValid = false;
        }

        // Validação de email
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email inválido";
            isValid = false;
        }

        // Validação de senha
        if (!password || password.length < 8) {
            newErrors.password = "A senha deve ter pelo menos 8 caracteres";
            isValid = false;
        }

        // Validação de confirmação de senha
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem";
            isValid = false;
        }

        // Validação dos termos
        if (!acceptTerms) {
            newErrors.acceptTerms = "Você deve aceitar os termos e condições";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/guest/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Email: email,
                    Password: password,
                    FirstName: nome,
                    LastName: sobrenome,
                    CPF,
                }),
            }
        );

        if (response.ok) {
            onSubmit({
                CPF,
                email,
                password,
                confirmPassword,
                acceptTerms,
                nome,
                sobrenome,
            });
            toast.success("Conta criada com sucesso!");
            router.push("/login");
        } else {
            toast.error("Erro ao criar conta!");
            router.push("/register");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Input
                        type="text"
                        value={CPF}
                        onChange={(e) =>
                            setCPF(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="CPF"
                        maxLength={11}
                        className={`w-full p-4 rounded-xl bg-[#FFE29D] border-none placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-lg ${
                            errors.CPF ? "ring-2 ring-red-500" : ""
                        }`}
                    />
                    {errors.CPF && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.CPF}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        className={`w-full p-4 rounded-xl bg-[#FFE29D] border-none placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-lg ${
                            errors.email ? "ring-2 ring-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nova senha"
                        className={`w-full p-4 rounded-xl bg-[#FFE29D] border-none placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-lg pr-12 ${
                            errors.password ? "ring-2 ring-red-500" : ""
                        }`}
                    />
                    <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent shadow-none hover:bg-transparent p-0"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </Button>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="relative">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar senha"
                        className={`w-full p-4 rounded-xl bg-[#FFE29D] border-none placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-lg pr-12 ${
                            errors.confirmPassword ? "ring-2 ring-red-500" : ""
                        }`}
                    />
                    <Button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-transparent shadow-none hover:bg-transparent p-0"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </Button>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-2 mb-2">
                    <Checkbox
                        id="termos"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                            setAcceptTerms(checked === true)
                        }
                        className="w-6 h-6 border-2 border-gray-400 rounded-md mt-0.5"
                    />
                    <label htmlFor="termos" className="text-base select-none">
                        Li e aceito os{" "}
                        <a
                            href="#"
                            className="text-[#2e7d32] font-semibold hover:underline"
                        >
                            Termos e Condições.
                        </a>
                    </label>
                </div>
                {errors.acceptTerms && (
                    <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
                )}

                <div className="pt-2">
                    <motion.button
                        type="submit"
                        className="w-full bg-[#2e7d32] text-white py-4 rounded-xl text-xl font-bold hover:bg-[#1b5e20] transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Criar conta
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
