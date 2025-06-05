"use client";

import GroupListItem, { GroupType } from "./group-list-item";
import { DialogContent } from "@/components/ui/dialog";

interface GroupListProps {
    title: string;
    groups: GroupType[];
    actionButtonText: string;
    onActionClick: (groupId: string) => void;
    emptyListMessage: string;
    isLoading?: boolean; // For the whole list, or for actions
}

const GroupList = ({
    title,
    groups,
    actionButtonText,
    onActionClick,
    emptyListMessage,
    isLoading = false, // Default to false
}: GroupListProps) => {
    return (
        <div className="p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
            {isLoading && groups.length === 0 ? ( // Show loading only if list is empty and loading
                <p className="text-gray-400">Carregando grupos...</p>
            ) : !isLoading && groups.length === 0 ? (
                <p className="text-gray-400">{emptyListMessage}</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {groups.map((group) => (
                        <GroupListItem
                            key={group.id}
                            group={group}
                            actionButtonText={actionButtonText}
                            onActionClick={onActionClick}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupList;
