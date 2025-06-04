"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GroupType } from "@/app/(dashboard)/descoberta/grupo/_components/group-list-item";
import { Send, X } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export interface ChatMessage {
    userId: string;
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
    onClose?: () => void; // Add onClose prop
}

const ChatWindow = ({
    currentGroup,
    currentChannelId,
    messages,
    onSendMessage,
    isSendingMessage,
    onClose,
}: ChatWindowProps) => {
    const [currentMessage, setCurrentMessage] = useState("");

    const handleChatSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;
        await onSendMessage(currentMessage, currentChannelId);
        setCurrentMessage(""); // Clear input after sending
    };

    return (
        <Card className="h-full flex flex-col bg-[#F5F9F5] rounded-[40px] p-2 md:p-8 w-full mx-auto">
                    {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#FCB201] underline underline-offset-4 text-center flex-1">
                        Chat da comunidade {currentGroup?.name}
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <div className="flex items-center justify-center mb-4">
                    <hr className="flex-1 border-green-900" />
                    <span className="mx-4 text-2xl font-bold text-green-900">
                        Hoje
                    </span>
                    <hr className="flex-1 border-green-900" />
                </div>
                {/* Mensagens */}
                <div className="flex-1 min-h-0 h-0 overflow-y-auto px-2 space-y-8 mb-6">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">
                            Nenhuma mensagem ainda. Comece a conversar!
                        </p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center text-2xl font-bold bg-white">
                                    {/* Placeholder avatar */}
                                    <Avatar className="text-gray-500">
                                        👤
                                    </Avatar>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="font-bold text-xl text-black">
                                            <Link
                                                className="hover:underline"
                                                target="_blank"
                                                href={`/user/${msg.senderUserId}`}
                                            >
                                                {msg.user}
                                            </Link>
                                        </span>

                                        <span className="text-gray-500 text-base ml-2">
                                            {msg.createdAt
                                                ? new Date(
                                                      msg.createdAt
                                                  ).toLocaleTimeString()
                                                : "Agora"}
                                        </span>
                                    </div>
                                    <div className="text-black text-base mb-2">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Input */}
                <form onSubmit={handleChatSubmit} className="mt-0">
                    <div className="bg-[#22C40B] rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Escreva aqui sua mensagem no chat geral"
                                value={currentMessage}
                                onChange={(e) =>
                                    setCurrentMessage(e.target.value)
                                }
                                className="flex-1 rounded-xl bg-[#1CA10B] text-white border-none focus:outline-none focus:ring-2 focus:ring-yellow-400 px-6 py-4 text-lg placeholder:text-green-900 font-semibold"
                                disabled={isSendingMessage}
                            />
                            <Button
                                type="submit"
                                className="bg-black hover:bg-green-900 text-white font-bold text-xl h-15 hover:scale-105 px-6 py-4 rounded-lg flex items-center gap-2 transition duration-300 ease-in-out"
                                disabled={
                                    isSendingMessage || !currentMessage.trim()
                                }
                            >
                                <span>Enviar</span>
                                <Send className="w-6 h-6 ml-1" />
                            </Button>
                        </div>
                    </div>
                </form>
        </Card>
    );
};

export default ChatWindow;
export type { ChatMessage as ChatMessageType };
