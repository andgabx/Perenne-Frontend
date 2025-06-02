"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface CreateGroupFormProps {
    onSubmit: (name: string, description: string) => Promise<void>;
    isLoading: boolean; // To manage loading state from parent
}

const CreateGroupForm = ({ onSubmit, isLoading }: CreateGroupFormProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(name, description);
        // Clear form only if submission was successful (handled by parent logic)
        // Or parent can tell this component to reset via a prop if needed
        setName("");
        setDescription("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
        >
            <h1 className="text-2xl font-bold text-white mb-4">
                Criar Novo Grupo
            </h1>
            <input
                type="text"
                placeholder="Nome do grupo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <textarea
                placeholder="Descrição do grupo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
                disabled={isLoading}
            >
                {isLoading ? "Criando..." : "Criar Grupo"}
            </Button>
        </form>
    );
};

export default CreateGroupForm;