"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button"; 
import { GroupType } from "@/app/(dashboard)/descoberta/grupo/_components/group-list-item";

export interface ChatMessage {
    user: string;
    message: string;
    createdAt?: string;
    senderUserId?: string;
}

interface ChatWindowProps {
    currentGroup: GroupType | undefined; // Can be GroupType or undefined
    currentChannelId: string;
    messages: ChatMessage[];
    onSendMessage: (message: string, channelId: string) => Promise<void>;
    isSendingMessage: boolean; // To disable send button while sending
}

const ChatWindow = ({
    currentGroup,
    currentChannelId,
    messages,
    onSendMessage,
    isSendingMessage,
}: ChatWindowProps) => {
    const [currentMessage, setCurrentMessage] = useState("");

    const handleChatSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;
        await onSendMessage(currentMessage, currentChannelId);
        setCurrentMessage(""); // Clear input after sending
    };

    return (
        <div className="bg-background p-6 rounded-lg shadow-lg space-y-4">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-black">
                    Chat do Grupo{" "}
                </h1>
                <div className="text-primary text-2xl font-bold">
                    {currentGroup
                        ? `${currentGroup.name}`
                        : `(ID: ${currentChannelId})`}
                </div>
            </div>
            <div className="h-64 overflow-y-auto border border-gray-700 rounded-md p-3 bg-gray-300"> {/* Removed text-gray-200 to ensure contrast */}
                {messages.length === 0 ? (
                    <p className="text-gray-500">
                        Nenhuma mensagem ainda. Comece a conversar!
                    </p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className="mb-2 text-black"> {/* Ensure message text is visible */}
                            {msg.createdAt && (
                                <span className="text-gray-600 text-xs mr-2"> {/* Darker for better contrast on bg-gray-300 */}
                                    {new Date(
                                        msg.createdAt
                                    ).toLocaleTimeString()}
                                </span>
                            )}
                            <span className="font-bold text-blue-600"> {/* Adjusted for visibility */}
                                {msg.user}:
                            </span>{" "}
                            {msg.message}
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-4"
                    disabled={isSendingMessage}
                />
                <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 hover:scale-105 h-full text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
                    disabled={isSendingMessage || !currentMessage.trim()}
                >
                    {isSendingMessage ? "Enviando..." : "Enviar"}
                </Button>
            </form>
        </div>
    );
};

export default ChatWindow;
export type { ChatMessage as ChatMessageType }; // Export ChatMessage interface