"use client";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar"; //
import { Badge } from "@/components/ui/badge"; //
import { ScrollArea } from "@/components/ui/scroll-area"; //

interface Group {
    id: string; //
    name: string; //
}

interface CommunityCardProps {
    groups: Group[]; //
    selectedCommunity: string | null; //
    setSelectedCommunity: (id: string) => void; //
}

const CommunityCard = ({
    groups, //
    selectedCommunity, //
    setSelectedCommunity, //
}: CommunityCardProps) => {
    return (
        <ScrollArea className="h-[90%]"> {/* */}
            <div className="space-y-2 p-4"> {/* */}
                {groups.length === 0 && ( //
                    <div className="flex items-center justify-center h-full"> {/* */}
                        <p className="text-gray-500">Você ainda não está em nenhuma comunidade</p> {/* */}
                    </div>
                )}
                {groups.map((community) => ( //
                    <div
                        key={community.id} //
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${ //
                            selectedCommunity === community.id
                                ? "bg-blue-50 border-blue-200" //
                                : "bg-white" //
                        }`}
                        onClick={() => setSelectedCommunity(community.id)} //
                    >
                        <div className="flex items-start gap-3"> {/* */}
                            <Avatar> {/* */}
                                <AvatarImage src={"/placeholder.svg"} /> {/* */}
                                <AvatarFallback> {/* */}
                                    {community.name.charAt(0)} {/* */}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0"> {/* */}
                                <div className="flex items-center justify-between mb-1"> {/* */}
                                    <h3 className="font-semibold text-sm truncate"> {/* */}
                                        {community.name} {/* */}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};
export default CommunityCard; //