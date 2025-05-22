"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepOne from "./components/first-section";
import StepTwo from "./components/second-section";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { SiteHeader } from "@/components/sidebar/site-header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function Home() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nome: "",
        dataNascimento: "",
        cpf: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        aceitaTermos: false,
        sobrenome: "",
    });

    const handleContinue = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = (data: Partial<typeof formData>) => {
        const finalData = { ...formData, ...data };
        toast.success("Conta criada com sucesso!");
    };

    return (
        <div className="min-h-screen w-full bg-cover bg-no-repeat bg-[url('/bg.png')] bg-[position:100%_center]">
            <SiteHeader />
            <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height))]">
                <Card className="rounded-2xl border-2 shadow-lg w-[45vw] bg-white overflow-hidden">
                    <div className="relative pt-6 pb-2 flex items-center justify-center w-full">
                        {step === 2 && (
                            <Button
                                type="button"
                                onClick={handleBack}
                                className="text-white bg-green-700 hover:bg-green-900 p-2 rounded-full transition-colors absolute left-8 top-1/2 -translate-y-1/4"
                                style={{ zIndex: 1 }}
                            >
                                <ArrowLeft size={32} />
                            </Button>
                        )}
                        <h1 className="text-2xl font-bold text-green-700 uppercase text-center w-full">
                            CRIAR CONTA
                        </h1>
                    </div>
                    <Separator className="my-6 w-full" />
                    <div className="w-[65%] mx-auto">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <StepOne
                                        initialData={formData}
                                        onContinue={handleContinue}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <StepTwo
                                        initialData={{
                                            CPF: formData.cpf,
                                            email: formData.email,
                                            password: formData.senha,
                                            confirmPassword:
                                                formData.confirmarSenha,
                                            acceptTerms: formData.aceitaTermos,
                                            nome: formData.nome,
                                            sobrenome: formData.sobrenome,
                                        }}
                                        onBack={handleBack}
                                        onSubmit={handleSubmit}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </div>
        </div>
    );
}
