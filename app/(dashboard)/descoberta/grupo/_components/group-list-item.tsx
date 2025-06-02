"use client";

import { Button } from "@/components/ui/button"; 

export interface Group {
    id: string;
    name: string;
    description: string;
}

interface GroupListItemProps {
    group: Group;
    actionButtonText: string;
    onActionClick: (groupId: string) => void;
    isLoading?: boolean; // Optional: if individual item actions can have loading states
}

const GroupListItem = ({
    group,
    actionButtonText,
    onActionClick,
    isLoading = false,
}: GroupListItemProps) => {
    return (
        <li
            className="border border-gray-700 p-4 rounded-lg bg-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
            <div className="mb-2 sm:mb-0">
                <p className="text-lg font-bold text-white">
                    NOME: {group.name}
                </p>
                <p className="text-sm text-gray-400">
                    DESCRIÇÃO: {group.description}
                </p>
                <p className="text-xs text-gray-500">ID: {group.id}</p>
            </div>
            <Button
                onClick={() => onActionClick(group.id)}
                className={`${
                    actionButtonText.includes("Entrar no Grupo") // Example conditional styling
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                } text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
                disabled={isLoading}
            >
                {actionButtonText}
            </Button>
        </li>
    );
};

export default GroupListItem;
export type { Group as GroupType }; // Export Group interface for use elsewhere
