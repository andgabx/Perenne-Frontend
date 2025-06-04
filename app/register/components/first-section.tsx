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
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import * as React from "react";
import { useNavigation } from "react-day-picker";

interface StepOneProps {
    initialData: {
        nome: string;
        sobrenome?: string;
        dataNascimento: string;
    };
    onContinue: (data: {
        nome: string;
        sobrenome: string;
        dataNascimento: string;
    }) => void;
}

// Componente para selecionar o ano no cabeçalho do calendário
function YearMonthPicker({ displayMonth }: { displayMonth: Date }) {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
        years.push(i);
    }
    const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    return (
        <div className="flex gap-2 items-center justify-center py-2">
            <button
                type="button"
                onClick={() => previousMonth && goToMonth(previousMonth)}
                disabled={!previousMonth}
                className="p-1"
                aria-label="Mês anterior"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <select
                value={displayMonth.getMonth()}
                onChange={(e) => {
                    const newDate = new Date(displayMonth);
                    newDate.setMonth(Number(e.target.value));
                    goToMonth(newDate);
                }}
                className="border rounded px-2 py-1"
            >
                {months.map((month, idx) => (
                    <option key={month} value={idx}>
                        {month}
                    </option>
                ))}
            </select>
            <select
                value={displayMonth.getFullYear()}
                onChange={(e) => {
                    const newDate = new Date(displayMonth);
                    newDate.setFullYear(Number(e.target.value));
                    goToMonth(newDate);
                }}
                className="border rounded px-2 py-1"
            >
                {years.map((year) => (
                    <option key={year}>{year}</option>
                ))}
            </select>
            <button
                type="button"
                onClick={() => nextMonth && goToMonth(nextMonth)}
                disabled={!nextMonth}
                className="p-1"
                aria-label="Próximo mês"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}

export default function StepOne({ initialData, onContinue }: StepOneProps) {
    const [nome, setNome] = useState(initialData.nome);
    const [sobrenome, setSobrenome] = useState(initialData.sobrenome || "");
    const [dataNascimento, setDataNascimento] = useState(
        initialData.dataNascimento
    );
    const [errors, setErrors] = useState({
        nome: "",
        sobrenome: "",
        dataNascimento: "",
    });

    const validate = () => {
        const newErrors = { nome: "", sobrenome: "", dataNascimento: "" };
        let isValid = true;

        if (!nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
            isValid = false;
        }
        if (!sobrenome.trim()) {
            newErrors.sobrenome = "Sobrenome é obrigatório";
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
            onContinue({ nome, sobrenome, dataNascimento });
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4 sm:p-6 md:p-8">
            <h2 className="text-center text-black pb-6 text-lg">
                Informações iniciais
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome"
                    className="w-full p-3 rounded-md bg-[#FFE29D] border-2 border-[#FFE29D]  focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                />
                {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                )}
                <Input
                    type="text"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    placeholder="Sobrenome"
                    className="w-full p-3 rounded-md bg-[#FFE29D] border-2 border-[#FFE29D]  focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                />
                {errors.sobrenome && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.sobrenome}
                    </p>
                )}

                <div>
                    <div className="relative">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    className={cn(
                                        "w-full justify-between text-left font-normal px-3 border-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2e7d32] hover:bg-[#FFE29D]/90",
                                        !dataNascimento && "text-gray-500"
                                    )}
                                >
                                    {dataNascimento
                                        ? new Date(
                                              dataNascimento
                                          ).toLocaleDateString()
                                        : "Data de Nascimento"}
                                    <CalendarIcon className="h-4 w-4 text-[#2e7d32]" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-card border-[#FFE29D]">
                                <Calendar
                                    locale={ptBR}
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
                                    className="bg-card rounded-md" // background do calendario em si
                                    components={{
                                        Caption: (props) => (
                                            <YearMonthPicker
                                                displayMonth={
                                                    props.displayMonth
                                                }
                                            />
                                        ),
                                    }}
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
