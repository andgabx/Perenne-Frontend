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
import PrivateUserChat from "./_components/privateuserchat"; // Importando o componente de chat privado
import { GroupType } from "../comunidades/_components/group-list-item";

export default function ChatInterface() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
        null
    );
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]); // Messages for group chat
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(
        null
    ); // For group chat
    const [isSendingMessage, setIsSendingMessage] = useState(false); // For group chat
    const [searchQuery, setSearchQuery] = useState("");

    // SignalR connection for GROUP chats
    const groupChatConnectionRef = useRef<signalR.HubConnection | null>(null);

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

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // useEffect for GROUP CHAT SignalR connection
    useEffect(() => {
        if (status !== "authenticated" || !session?.user.accessToken) {
            if (
                groupChatConnectionRef.current &&
                groupChatConnectionRef.current.state ===
                    signalR.HubConnectionState.Connected
            ) {
                groupChatConnectionRef.current
                    .stop()
                    .then(() =>
                        console.log(
                            "SignalR (Group) Connection stopped due to session/status change."
                        )
                    )
                    .catch((err) =>
                        console.error(
                            "Error stopping SignalR (Group) connection:",
                            err
                        )
                    );
            }
            groupChatConnectionRef.current = null;
            return;
        }

        if (
            !groupChatConnectionRef.current ||
            groupChatConnectionRef.current.state ===
                signalR.HubConnectionState.Disconnected
        ) {
            const newGroupConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                    // Connects to the general chathub
                    accessTokenFactory: () => session.user.accessToken!,
                })
                .withAutomaticReconnect()
                .build();

            newGroupConnection.onclose((error) => {
                console.log("SignalR (Group) Connection closed.", error);
            });

            // Listener for group messages
            newGroupConnection.on(
                "ReceiveMessage",
                (
                    user: string,
                    message: string,
                    createdAt: string,
                    senderUserId: string
                ) => {
                    console.log("Mensagem de grupo recebida:", {
                        user,
                        message,
                        createdAt,
                        senderUserId,
                    });
                    // Só adiciona se for para o canal atual
                    if (currentChannelId) {
                        setChatMessages((prevMessages) => {
                            // Verifica se a mensagem já existe para evitar duplicatas
                            const messageExists = prevMessages.some(
                                (m) =>
                                    m.message === message &&
                                    m.senderUserId === senderUserId &&
                                    m.createdAt === createdAt
                            );

                            if (messageExists) {
                                return prevMessages;
                            }

                            return [
                                ...prevMessages,
                                {
                                    userId: senderUserId,
                                    user:
                                        user ||
                                        `Usuário ${senderUserId.substring(
                                            0,
                                            6
                                        )}`,
                                    message,
                                    createdAt,
                                    senderUserId,
                                },
                            ];
                        });
                    }
                }
            );

            newGroupConnection
                .start()
                .then(() => {
                    console.log("SignalR (Group) Connected.");
                    groupChatConnectionRef.current = newGroupConnection;
                    // If a channel was already selected, join it
                    if (
                        currentChannelId &&
                        newGroupConnection.state ===
                            signalR.HubConnectionState.Connected
                    ) {
                        newGroupConnection
                            .invoke("JoinChannel", currentChannelId)
                            .then(() =>
                                console.log(
                                    `Joined group channel ${currentChannelId} on connect.`
                                )
                            )
                            .catch((err) =>
                                console.error(
                                    `Error joining group channel ${currentChannelId}:`,
                                    err
                                )
                            );
                    }
                })
                .catch((err) =>
                    console.error("SignalR (Group) Connection Error: ", err)
                );
        }

        // Cleanup for GROUP CHAT connection
        return () => {
            if (
                groupChatConnectionRef.current &&
                (status !== "authenticated" || !session?.user?.accessToken)
            ) {
                groupChatConnectionRef.current
                    .stop()
                    .then(() =>
                        console.log(
                            "SignalR (Group) Connection stopped on cleanup."
                        )
                    )
                    .catch((err) =>
                        console.error(
                            "Error stopping SignalR (Group) connection on cleanup:",
                            err
                        )
                    );
                groupChatConnectionRef.current = null;
            }
        };
    }, [status, session]); // currentChannelId removed from here, join/leave handled in handleOpenChat

    const handleOpenChat = async (groupId: string) => {
        // For GROUP chats
        if (status !== "authenticated" || !session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar no chat");
            return;
        }

        const connection = groupChatConnectionRef.current;
        if (
            !connection ||
            connection.state !== signalR.HubConnectionState.Connected
        ) {
            toast.error(
                "Conexão de chat não está ativa. Tentando reconectar..."
            );
            try {
                await connection?.start();
                if (
                    connection?.state !== signalR.HubConnectionState.Connected
                ) {
                    toast.error("Falha ao reconectar ao chat.");
                    return;
                }
                console.log("SignalR (Group) reconnected for opening chat.");
            } catch (err) {
                toast.error("Falha ao reconectar ao chat.");
                console.error("SignalR (Group) Reconnection Error: ", err);
                return;
            }
        }

        // Leave previous group channel if different
        if (
            currentChannelId &&
            currentChannelId !== groupId &&
            connection.state === signalR.HubConnectionState.Connected
        ) {
            try {
                await connection.invoke("LeaveChannel", currentChannelId);
                console.log(`Left previous group channel: ${currentChannelId}`);
            } catch (err) {
                console.error(
                    `Error leaving group channel ${currentChannelId}:`,
                    err
                );
            }
        }

        // Join new group channel
        if (connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke("JoinChannel", groupId);
                setCurrentChannelId(groupId); // Set the new channel ID for group chat
                setChatMessages([]); // Clear messages from previous group chat
                setSelectedCommunity(groupId);
                console.log(`Juntou-se ao canal SignalR (Grupo): ${groupId}`);
                // TODO: Fetch history for the new group channel if needed
            } catch (err) {
                console.error(`Error joining group channel ${groupId}:`, err);
                toast.error(
                    "Não foi possível conectar ao canal do chat de grupo."
                );
            }
        } else {
            console.warn("Cannot join group channel, SignalR not connected.");
            toast.error("Não foi possível conectar ao canal do chat de grupo.");
        }
    };

    const handleSendChatMessage = async (
        message: string,
        channelId: string
    ) => {
        if (
            !message.trim() ||
            !channelId ||
            !groupChatConnectionRef.current ||
            groupChatConnectionRef.current.state !==
                signalR.HubConnectionState.Connected
        ) {
            toast.error("Não é possível enviar mensagem para o grupo.");
            return;
        }
        setIsSendingMessage(true);
        try {
            // Atualização otimista
            const optimisticMessage: ChatMessageType = {
                userId: session?.user?.id || "",
                user: session?.user?.name || "Eu",
                message: message,
                createdAt: new Date().toISOString(),
                senderUserId: session?.user?.id || "",
            };

            setChatMessages((prev) => [...prev, optimisticMessage]);

            await groupChatConnectionRef.current.invoke(
                "SendMessage",
                channelId,
                message
            );
        } catch (err) {
            console.error(
                "Erro ao enviar mensagem de GRUPO via SignalR: ",
                err
            );
            toast.error("Erro ao enviar mensagem para o grupo.");
            // Remover mensagem otimista em caso de erro
            setChatMessages((prev) =>
                prev.filter((m) => m.message !== message)
            );
        } finally {
            setIsSendingMessage(false);
        }
    };

    const selectedCommunityData = groups.find(
        (g) => g.id === selectedCommunity
    );

    return (
        <div className="p-8 h-[calc(100vh-var(--header-height,80px))]">
            <Tabs
                defaultValue="comunidades"
                className="w-full h-full flex flex-col"
            >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                        value="comunidades"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <Users /> Comunidades
                    </TabsTrigger>
                    <TabsTrigger
                        value="bate-papo"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <MessageCircle /> Bate Papo Pessoal
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value="comunidades"
                    className="space-y-4 flex-1 overflow-y-auto"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        Comunidades que você participa
                                    </CardTitle>
                                </CardHeader>
                                <div className="px-6 pb-4">
                                    <Input
                                        placeholder="Pesquisar comunidade"
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                                    <CommunityCard
                                        groups={groups.filter(
                                            (group) =>
                                                group.name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    ) ||
                                                (group.description || "")
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    )
                                        )}
                                        selectedCommunity={selectedCommunity}
                                        setSelectedCommunity={handleOpenChat} // This now correctly handles group chat joining
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        {/* Área de Chat de Grupo */}
                        <div className="lg:col-span-2 flex flex-col h-full">
                            {selectedCommunity &&
                            selectedCommunityData &&
                            currentChannelId === selectedCommunityData.id ? (
                                <ChatWindow // This is for GROUP chats
                                    currentGroup={selectedCommunityData}
                                    currentChannelId={selectedCommunityData.id}
                                    messages={chatMessages} // Messages for the selected group
                                    onSendMessage={handleSendChatMessage}
                                    isSendingMessage={isSendingMessage}
                                    onClose={() => {
                                        if (
                                            groupChatConnectionRef.current &&
                                            currentChannelId &&
                                            groupChatConnectionRef.current
                                                .state ===
                                                signalR.HubConnectionState
                                                    .Connected
                                        ) {
                                            groupChatConnectionRef.current
                                                .invoke(
                                                    "LeaveChannel",
                                                    currentChannelId
                                                )
                                                .then(() =>
                                                    console.log(
                                                        `Left group channel ${currentChannelId} on close.`
                                                    )
                                                )
                                                .catch((err) =>
                                                    console.error(
                                                        `Error leaving group channel ${currentChannelId} on close:`,
                                                        err
                                                    )
                                                );
                                        }
                                        setSelectedCommunity(null);
                                        setCurrentChannelId(null);
                                        setChatMessages([]);
                                    }}
                                    currentUserId={session?.user.id || ""}
                                />
                            ) : (
                                <EmptyWindow
                                    message="Selecione uma comunidade para ver o chat."
                                    icon={
                                        <Users className="h-16 w-16 text-gray-400" />
                                    }
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent
                    value="bate-papo"
                    className="space-y-4 flex-1 overflow-y-auto"
                >
                    {/* O componente PrivateUserChat gerencia sua própria conexão SignalR */}
                    <PrivateUserChat />
                </TabsContent>
            </Tabs>
        </div>
    );
}
