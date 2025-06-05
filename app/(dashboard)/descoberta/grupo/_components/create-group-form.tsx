"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createGroup } from "../../../../../pages/api/group/create-group";

interface CreateGroupFormProps {
    isLoading: boolean;
    token: string;
}

const CreateGroupForm = ({ isLoading, token }: CreateGroupFormProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createGroup(token, name, description);
            setName("");
            setDescription("");
            alert("Grupo criado com sucesso!");
        } catch (error: any) {
            alert(error.message || "Erro ao criar grupo");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-8 px-2"
        >
            <div className="w-full">
                <h2 className="text-[#234B0C] text-xl md:text-2xl font-extrabold text-center mb-2 mt-2 tracking-wide">
                    CRIAR
                </h2>
                <hr className="border-t border-[#234B0C] mb-6" />
                <label className="block text-[#234B0C] font-bold text-lg mb-4 ml-2">
                    Criar comunidade
                </label>
                <div className="flex flex-col gap-2 w-full items-center">
                    <input
                        type="text"
                        placeholder="Nome da comunidade"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-[#e3efe3] placeholder:text-gray-500 rounded-2xl px-6 py-5 text-lg border-none outline-none focus:ring-2 focus:ring-[#3C6C0C] transition"
                        disabled={isLoading || submitting}
                    />
                    <hr className="border-t border-[#cbe5cb] w-full" />
                    <textarea
                        placeholder="Descrição da comunidade"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={5}
                        className="w-full bg-[#e3efe3] placeholder:text-gray-500 rounded-2xl px-6 py-5 text-lg border-none outline-none focus:ring-2 focus:ring-[#3C6C0C] transition resize-none mt-1"
                        disabled={isLoading || submitting}
                    />
                </div>
            </div>
            <div className="w-full flex justify-center mt-4">
                <Button
                    type="submit"
                    className="w-[340px] max-w-full bg-[#FCB201] hover:bg-[#FFD34D] text-[#234B0C] font-extrabold text-xl py-4 rounded-2xl shadow-none border-none transition"
                    disabled={isLoading || submitting}
                >
                    {submitting ? "Criando..." : "Próximo"}
                </Button>
            </div>
        </form>
    );
};

export default CreateGroupForm;
