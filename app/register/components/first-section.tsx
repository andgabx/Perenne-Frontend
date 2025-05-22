"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface StepOneProps {
    initialData: {
        nome: string;
        dataNascimento: string;
    };
    onContinue: (data: { nome: string; dataNascimento: string }) => void;
}

export default function StepOne({ initialData, onContinue }: StepOneProps) {
    const [nome, setNome] = useState(initialData.nome);
    const [dataNascimento, setDataNascimento] = useState(
        initialData.dataNascimento
    );
    const [errors, setErrors] = useState({ nome: "", dataNascimento: "" });

    const validate = () => {
        const newErrors = { nome: "", dataNascimento: "" };
        let isValid = true;

        if (!nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
            isValid = false;
        }

        if (!dataNascimento) {
            newErrors.dataNascimento = "Data de nascimento é obrigatória";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onContinue({ nome, dataNascimento });
        }
    };

    return (
        <div className="p-20">
            <h2 className="text-center text-black text-lg mb-6">
                Informações iniciais
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome e sobrenome"
                        className="w-full p-3 rounded-md bg-[#FFE29D] border-2 border-[#FFE29D]  focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                    />
                    {errors.nome && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.nome}
                        </p>
                    )}
                </div>

                <div>
                    <div className="relative">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className={cn(
                                        "w-full justify-start text-left font-normal border-2 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] hover:bg-[#FFE29D]/90",
                                        !dataNascimento &&
                                            "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#2e7d32]" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#957427] border-[#FFE29D]">
                                <Calendar
                                    mode="single"
                                    selected={
                                        dataNascimento
                                            ? new Date(dataNascimento)
                                            : undefined
                                    }
                                    onSelect={(day) =>
                                        setDataNascimento(
                                            day ? day.toISOString() : ""
                                        )
                                    }
                                    initialFocus
                                    className="bg-[#4d4125] rounded-md" // background do calendario em si
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {errors.dataNascimento && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.dataNascimento}
                        </p>
                    )}
                </div>

                <div className="pt-4">
                    <motion.button
                        type="submit"
                        className="w-full bg-[#2e7d32] text-white py-3 rounded-md font-medium hover:bg-[#1b5e20] transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Continuar
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
