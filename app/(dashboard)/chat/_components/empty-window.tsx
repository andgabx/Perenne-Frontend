import { Card } from "@/components/ui/card";
import { MessageSquareDashed, Users } from "lucide-react"; // Adicionado MessageSquareDashed como alternativa
import React from "react";

interface EmptyWindowProps {
    message?: string;
    icon?: React.ReactNode; // Permite ícone customizado
    title?: string; // Adicionado título opcional
}

const EmptyWindow: React.FC<EmptyWindowProps> = ({ message, icon, title }) => {
    const defaultIcon = <MessageSquareDashed className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />;

    return (
        <Card className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/30 rounded-[20px] md:rounded-[40px] p-6 md:p-8 w-full mx-auto border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-center flex flex-col items-center justify-center max-w-md">
                {icon ? icon : defaultIcon}
                {title && (
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {title}
                    </h2>
                )}
                <p className="text-md text-gray-500 dark:text-gray-400">
                    {message || "Selecione um item para ver os detalhes aqui."}
                </p>
            </div>
        </Card>
    );
};

export default EmptyWindow;