"use client";

import GroupListItem, { GroupType } from "./group-list-item";

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
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
            {isLoading && groups.length === 0 ? ( // Show loading only if list is empty and loading
                <p className="text-gray-400">Carregando grupos...</p>
            ) : !isLoading && groups.length === 0 ? (
                <p className="text-gray-400">{emptyListMessage}</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {groups.map((group) => (
                        <GroupListItem
                            key={group.id}
                            group={group}
                            actionButtonText={actionButtonText}
                            onActionClick={onActionClick}
                            // You might want a more granular loading state per item if actions are slow
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupList;