"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface StepTwoProps {
    initialData: {
        CPF: string;
        email: string;
        password: string;
        confirmPassword: string;
        acceptTerms: boolean;

    };
    onBack: () => void;
    onSubmit: (data: {
        CPF: string;
        email: string;
        password: string;
        confirmPassword: string;
        acceptTerms: boolean;
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ CPF, email, password, confirmPassword, acceptTerms });
        }
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-[#2e7d32] hover:bg-green-50 p-1 rounded-full transition-colors"
                    >
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 8 8 12 12 16"></polyline>
                            <line x1="16" y1="12" x2="8" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <div>
                    <input
                        type="text"
                        value={CPF}
                        onChange={(e) =>
                            setCPF(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="CPF"
                        maxLength={11}
                        className={`w-full p-3 rounded-md bg-[#FFE29D] bg-opacity-20 border-2 border-[#FFE29D] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] ${
                            errors.CPF ? "border-red-500" : ""
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
                        className={`w-full p-3 rounded-md bg-[#FFE29D] bg-opacity-20 border-2 border-[#FFE29D] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] ${
                            errors.email ? "border-red-500" : ""
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
                        className={`w-full p-3 rounded-md bg-[#FFE29D] bg-opacity-20 border-2 border-[#FFE29D] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] ${
                            errors.password ? "border-red-500" : ""
                        }`}
                    />
                    <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
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
                                width="20"
                                height="20"
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
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar senha"
                        className={`w-full p-3 rounded-md bg-[#FFE29D] bg-opacity-20 border-2 border-[#FFE29D] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] ${
                            errors.confirmPassword ? "border-red-500" : ""
                        }`}
                    />
                    <Button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showConfirmPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
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
                                width="20"
                                height="20"
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

                <div className="flex items-start mt-4">
                    <Checkbox
                        id="termos"
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                            setAcceptTerms(checked === true)
                        }
                        className="mt-1 mr-2"
                    />
                    <label htmlFor="termos" className="text-sm">
                        Li e aceito os{" "}
                        <a href="#" className="text-[#2e7d32] hover:underline">
                            Termos e Condições
                        </a>
                        .
                    </label>
                </div>
                {errors.acceptTerms && (
                    <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
                )}

                <div className="pt-4">
                    <motion.button
                        type="submit"
                        className="w-full bg-[#2e7d32] text-white py-3 rounded-md font-medium hover:bg-[#1b5e20] transition-colors"
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
