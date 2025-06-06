"use client";

import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CommunityCard from "./_components/community-cards";
import { getGroups } from "@/pages/api/group/get-group-by-user";
import ChatWindow from "./_components/chat-window";
import * as signalR from "@microsoft/signalr";
import type { ChatMessageType } from "./_components/chat-window";
import EmptyWindow from "./_components/empty-window";
import PrivateUserChat from "./_components/privateuserchat";
import { GroupType } from "../comunidades/_components/group-list-item";

export default function ChatInterface() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const groupChatConnectionRef = useRef<signalR.HubConnection | null>(null);
    // Use a ref to hold the current channel ID to avoid stale closures in SignalR handlers
    const currentChannelIdRef = useRef<string | null>(null);

    // Keep the ref in sync with the state
    useEffect(() => {
        currentChannelIdRef.current = currentChannelId;
    }, [currentChannelId]);

    // Effect for fetching user's groups
    useEffect(() => {
        if (status === "authenticated" && session?.user?.accessToken) {
            getGroups(session.user.accessToken).then((data) => {
                setGroups(
                    data.map((g) => ({
                        ...g,
                        description: (g as any).description || "",
                    }))
                );
            });
        }
    }, [status, session]);

    // Effect for handling authentication status
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Effect for managing the SignalR connection
    useEffect(() => {
        if (status !== "authenticated" || !session?.user.accessToken) {
            if (groupChatConnectionRef.current?.state === signalR.HubConnectionState.Connected) {
                groupChatConnectionRef.current.stop();
            }
            return;
        }

        if (!groupChatConnectionRef.current) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                    accessTokenFactory: () => session.user.accessToken!,
                })
                .withAutomaticReconnect()
                .build();

            groupChatConnectionRef.current = connection;

            // Define event handlers only once
            connection.onclose((error) => console.log("SignalR (Group) Connection closed.", error));

            // MODIFIED: Correctly handle incoming messages
            connection.on(
                "ReceiveMessage",
                (channelId: string, user: string, message: string, createdAt: string, senderUserId: string) => {
                    // Use the ref to check against the current channel ID, avoiding stale state
                    if (currentChannelIdRef.current === channelId) {
                        setChatMessages((prevMessages) => {
                            const messageExists = prevMessages.some(
                                (m) => m.message === message && m.senderUserId === senderUserId && new Date(m.createdAt || "").getTime() === new Date(createdAt).getTime()
                            );
                            if (messageExists) {
                                return prevMessages; // Avoid duplicates from optimistic updates
                            }
                            const newMessage: ChatMessageType = {
                                userId: senderUserId,
                                user,
                                message,
                                createdAt,
                                senderUserId,
                            };
                            return [...prevMessages, newMessage];
                        });
                    } else {
                        // Optional: Handle message for a non-active chat (e.g., show notification)
                        console.log(`Received message for channel ${channelId}, but currently in ${currentChannelIdRef.current}`);
                    }
                }
            );

            connection
                .start()
                .then(() => console.log("SignalR (Group) Connected."))
                .catch((err) => console.error("SignalR (Group) Connection Error: ", err));
        }
        
        // Cleanup on component unmount
        return () => {
            groupChatConnectionRef.current?.stop();
        };
    }, [status, session]);

    // ADDED: Function to fetch message history for a group
    const fetchGroupChatHistory = async (groupId: string, token: string): Promise<ChatMessageType[]> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Chat/${groupId}/getcachedmessages`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch chat history. Status: ${response.status}`);
            }
            const history = await response.json();
            // Map backend FTO to frontend ChatMessageType
            const mappedMessages: ChatMessageType[] = history.map((msg: any) => ({
                userId: msg.createdById,
                user: `${msg.firstName} ${msg.lastName}`.trim(),
                message: msg.message,
                createdAt: msg.createdAt,
                senderUserId: msg.createdById,
            }));
            return mappedMessages;
        } catch (error) {
            console.error("Error fetching group chat history:", error);
            toast.error("Erro ao carregar o histórico do chat.");
            return [];
        }
    };
    
    // MODIFIED: Complete overhaul of chat opening logic
    const handleOpenChat = async (groupId: string) => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar no chat");
            return;
        }

        if (currentChannelId === groupId) return; // Already in this chat

        const connection = groupChatConnectionRef.current;
        if (connection?.state !== signalR.HubConnectionState.Connected) {
            toast.error("Conexão com o chat não está ativa.");
            return;
        }
        
        // Leave the previous SignalR group channel
        if (currentChannelId) {
            try {
                await connection.invoke("LeaveChannel", currentChannelId);
                console.log(`Left previous group channel: ${currentChannelId}`);
            } catch (err) {
                console.error(`Error leaving group channel ${currentChannelId}:`, err);
            }
        }
        
        // Set new state and fetch history
        setSelectedCommunity(groupId);
        setCurrentChannelId(groupId);
        setChatMessages([]); // Clear old messages immediately

        try {
            // Join the new SignalR group channel
            await connection.invoke("JoinChannel", groupId);
            console.log(`Successfully joined group channel: ${groupId}`);
            
            // Fetch history for the new channel
            const historyMessages = await fetchGroupChatHistory(groupId, session.user.accessToken);
            setChatMessages(historyMessages);
        } catch (err) {
            console.error(`Error joining group channel ${groupId} or fetching history:`, err);
            toast.error("Não foi possível entrar no chat do grupo.");
            setSelectedCommunity(null);
            setCurrentChannelId(null);
        }
    };
    
    const handleSendChatMessage = async (message: string, channelId: string) => {
        const connection = groupChatConnectionRef.current;
        if (!message.trim() || !channelId || connection?.state !== signalR.HubConnectionState.Connected) {
            toast.error("Não é possível enviar a mensagem.");
            return;
        }

        setIsSendingMessage(true);
        try {
            // Optimistic update: show the message immediately on the sender's screen
            const optimisticMessage: ChatMessageType = {
                userId: session?.user.id || "",
                user: session?.user.name || "Eu",
                message: message,
                createdAt: new Date().toISOString(),
                senderUserId: session?.user.id || "",
            };
            setChatMessages((prev) => [...prev, optimisticMessage]);

            await connection.invoke("SendMessage", channelId, message);
        } catch (err) {
            console.error("Erro ao enviar mensagem de GRUPO via SignalR: ", err);
            toast.error("Erro ao enviar mensagem.");
            // Revert optimistic update on failure
            setChatMessages((prev) => prev.filter((m) => m.message !== message));
        } finally {
            setIsSendingMessage(false);
        }
    };

    const selectedCommunityData = groups.find((g) => g.id === selectedCommunity);

    const handleCloseChat = () => {
        const connection = groupChatConnectionRef.current;
        if (connection && currentChannelId && connection.state === signalR.HubConnectionState.Connected) {
            connection
                .invoke("LeaveChannel", currentChannelId)
                .then(() => console.log(`Left group channel ${currentChannelId} on close.`))
                .catch((err) => console.error(`Error leaving group channel ${currentChannelId} on close:`, err));
        }
        setSelectedCommunity(null);
        setCurrentChannelId(null);
        setChatMessages([]);
    };

    return (
        <div className="p-8 h-[calc(100vh-var(--header-height,80px))]">
            <Tabs defaultValue="comunidades" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="comunidades" className="flex items-center gap-2 text-lg font-semibold">
                        <Users /> Comunidades
                    </TabsTrigger>
                    <TabsTrigger value="bate-papo" className="flex items-center gap-2 text-lg font-semibold">
                        <MessageCircle /> Bate Papo Pessoal
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="comunidades" className="space-y-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">Comunidades que você participa</CardTitle>
                                </CardHeader>
                                <div className="px-6 pb-4">
                                    <Input
                                        placeholder="Pesquisar comunidade"
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                                    <CommunityCard
                                        groups={groups.filter(
                                            (group) =>
                                                group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                (group.description || "").toLowerCase().includes(searchQuery.toLowerCase())
                                        )}
                                        selectedCommunity={selectedCommunity}
                                        setSelectedCommunity={handleOpenChat}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2 flex flex-col h-full">
                            {selectedCommunity && selectedCommunityData && currentChannelId === selectedCommunityData.id ? (
                                <ChatWindow
                                    currentGroup={selectedCommunityData}
                                    currentChannelId={selectedCommunityData.id}
                                    messages={chatMessages}
                                    onSendMessage={handleSendChatMessage}
                                    isSendingMessage={isSendingMessage}
                                    onClose={handleCloseChat}
                                    currentUserId={session?.user.id || ""}
                                />
                            ) : (
                                <EmptyWindow
                                    message="Selecione uma comunidade para ver o chat."
                                    icon={<Users className="h-16 w-16 text-gray-400" />}
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="bate-papo" className="space-y-4 flex-1 overflow-y-auto">
                    <PrivateUserChat />
                </TabsContent>
            </Tabs>
        </div>
    );
}
