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
    isLoading?: boolean;
}

const GroupListItem = ({
    group,
    actionButtonText,
    onActionClick,
    isLoading = false,
}: GroupListItemProps) => {
    return (
        <li className="relative bg-[#F4F7F5] rounded-b-[32px] rounded-t-[32px] shadow-none border-b-4 border-[#24BD0A] flex flex-col items-center justify-between p-6 mb-4 min-w-[220px] min-h-[180px] transition hover:scale-105">
            <div className="w-full flex flex-col items-center justify-center flex-1">
                <div className="bg-[#FCB201] rounded-t-[20px] rounded-b-[20px] h-[20vh] md:h-[22vh] w-full flex items-center justify-center mx-[2.5vw] md:mx-[1vw] mb-2" />
                <h4
                    className="text-[#234B0C] font-extrabold text-lg md:text-xl text-center uppercase mb-2 font-['BN_Bobbie_Sans']"
                    style={{ fontFamily: '"BN Bobbie Sans", sans-serif' }}
                >
                    {group.name}
                </h4>
                <p className="text-gray-500 text-sm text-center mb-2">
                    {group.description}
                </p>
            </div>
            <Button
                onClick={() => onActionClick(group.id)}
                className="mt-4 w-[180px] max-w-full bg-[#FCB201] hover:bg-[#FFD34D] text-[#234B0C] font-extrabold text-lg py-3 rounded-2xl shadow-none border-none transition"
                disabled={isLoading}
            >
                {actionButtonText}
            </Button>
        </li>
    );
};

export default GroupListItem;
export type { Group as GroupType };
