"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { GroupType } from "@/app/(dashboard)/descoberta/grupo/_components/group-list-item"; // Ensure this path is correct
import { Send, X } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added AvatarFallback and AvatarImage
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export interface ChatMessage {
    userId: string; // ID of the user who created the message (senderUserId)
    user: string; // Display name of the user
    message: string;
    createdAt?: string;
    senderUserId?: string; // Explicitly sender's ID, should be same as userId if populated correctly
}
export type ChatMessageType = ChatMessage; // Alias for external use if needed

interface ChatWindowProps {
    currentGroup: GroupType | undefined;
    currentChannelId: string;
    messages: ChatMessageType[];
    onSendMessage: (message: string, channelId: string) => Promise<void>;
    isSendingMessage: boolean;
    onClose?: () => void;
    currentUserId: string; // ID of the currently logged-in user
}

const ChatWindow = ({
    currentGroup,
    currentChannelId,
    messages,
    onSendMessage,
    isSendingMessage,
    onClose,
    currentUserId,
}: ChatWindowProps) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleChatSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;
        await onSendMessage(currentMessage, currentChannelId);
        setCurrentMessage("");
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <Card className="h-full flex flex-col bg-[#F5F9F5] rounded-[20px] md:rounded-[40px] p-2 md:p-8 w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 p-4 border-b">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Chat: {currentGroup?.name || "Comunidade"}
                </h1>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                )}
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">
                            Nenhuma mensagem ainda. Comece a conversar!
                        </p>
                    ) : (
                        messages.map((msg, index) => {
                            const isCurrentUserMessage =
                                msg.senderUserId === currentUserId;
                            const senderDisplayName =
                                msg.user ||
                                `Usuário ${msg.senderUserId?.substring(0, 6)}`;

                            return (
                                <div
                                    key={
                                        msg.createdAt
                                            ? `${msg.senderUserId}-${msg.createdAt}-${index}`
                                            : index
                                    }
                                    className={`flex gap-3 items-end mb-2 ${
                                        isCurrentUserMessage
                                            ? "flex-row-reverse"
                                            : "flex-row"
                                    }`}
                                >
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarFallback className="text-xs">
                                            {senderDisplayName
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`max-w-[65%] flex flex-col ${
                                            isCurrentUserMessage
                                                ? "items-end"
                                                : "items-start"
                                        }`}
                                    >
                                        <div
                                            className={`flex flex-wrap items-center gap-2 mb-0.5 ${
                                                isCurrentUserMessage
                                                    ? "justify-end"
                                                    : ""
                                            }`}
                                        >
                                            <span className="font-semibold text-sm text-gray-700">
                                                {isCurrentUserMessage
                                                    ? "Eu"
                                                    : senderDisplayName}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                {msg.createdAt
                                                    ? new Date(
                                                          msg.createdAt
                                                      ).toLocaleTimeString([], {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : ""}
                                            </span>
                                        </div>
                                        <div
                                            className={`text-sm p-3 rounded-lg shadow-sm ${
                                                isCurrentUserMessage
                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                                            }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t mt-auto">
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Escreva sua mensagem..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSendingMessage}
                    />
                    <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition duration-150 ease-in-out"
                        disabled={isSendingMessage || !currentMessage.trim()}
                    >
                        <span>Enviar</span>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ChatWindow;
