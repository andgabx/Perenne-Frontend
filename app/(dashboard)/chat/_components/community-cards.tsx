"use client";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge"; // Badge não está sendo usado, pode ser removido se não planejado
import { ScrollArea } from "@/components/ui/scroll-area";

interface Group {
    id: string;
    name: string;
    description?: string; // Adicionado para melhor exibição, se disponível
    imageUrl?: string; // Adicionado para avatar da comunidade, se disponível
}

interface CommunityCardProps {
    groups: Group[];
    selectedCommunity: string | null;
    setSelectedCommunity: (id: string) => void; // Geralmente, isso acionaria a abertura do chat do grupo
}

const CommunityCard = ({
    groups,
    selectedCommunity,
    setSelectedCommunity,
}: CommunityCardProps) => {
    return (
        // A altura é controlada pelo CardContent no componente pai (page.tsx)
        // ScrollArea aqui vai cobrir o conteúdo se ele exceder
        <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
                {groups.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                        <UsersIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 font-medium">
                            Você ainda não está em nenhuma comunidade.
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Explore e junte-se a novas comunidades!
                        </p>
                    </div>
                )}
                {groups.map((community) => (
                    <div
                        key={community.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 ease-in-out
                                    hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600
                                    ${
                                        selectedCommunity === community.id
                                            ? "bg-blue-50 border-blue-400 dark:bg-blue-900/50 dark:border-blue-700 shadow-md"
                                            : "bg-white dark:bg-gray-800 dark:border-gray-700"
                                    }`}
                        onClick={() => setSelectedCommunity(community.id)}
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={community.imageUrl}
                                    alt={community.name}
                                />
                                <AvatarFallback className="font-semibold">
                                    {community.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate text-gray-800 dark:text-gray-100">
                                    {community.name}
                                </h3>
                                {community.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {community.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};

// Um ícone simples para o estado vazio, pode ser substituído por um de lucide-react se preferir
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export default CommunityCard;
