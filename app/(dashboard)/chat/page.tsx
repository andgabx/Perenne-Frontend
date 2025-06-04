"use client";

import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Users, MessageCircle, Hash, X } from "lucide-react";
import { getHeaders } from "@/pages/api/headers";
import toast from "react-hot-toast";
import { GroupType } from "../descoberta/grupo/_components/group-list-item";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CommunityCard from "./_components/community-cards";
import { getGroups } from "@/pages/api/group/get-group-by-user";
import ChatWindow from "./_components/chat-window";
import * as signalR from "@microsoft/signalr";
import type { ChatMessageType } from "./_components/chat-window";
import EmptyWindow from "./_components/empty-window";

export default function ChatInterface() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
        null
    );
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(
        null
    );
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const connectionRef = useRef<signalR.HubConnection | null>(null);

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

    useEffect(() => {
        if (status !== "authenticated" || !session?.user.accessToken) {
            if (connectionRef.current) {
                connectionRef.current.stop();
                connectionRef.current = null;
            }
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                accessTokenFactory: () => session.user.accessToken!,
            })
            .withAutomaticReconnect()
            .build();

        newConnection.onclose((error) => {
            console.log("SignalR Connection closed.", error);
        });

        newConnection.on(
            "ReceiveMessage",
            (
                user: string,
                message: string,
                createdAt: string,
                senderUserId: string
            ) => {
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { userId: user, user, message, createdAt, senderUserId },
                ]);
            }
        );

        newConnection
            .start()
            .then(() => {
                console.log("SignalR Connected.");
                connectionRef.current = newConnection;
                if (
                    currentChannelId &&
                    newConnection.state === signalR.HubConnectionState.Connected
                ) {
                    newConnection
                        .invoke("JoinChannel", currentChannelId)
                        .then(() =>
                            console.log(
                                `Joined channel ${currentChannelId} on connect.`
                            )
                        )
                        .catch((err) =>
                            console.error(
                                `Error joining channel ${currentChannelId}:`,
                                err
                            )
                        );
                }
            })
            .catch((err) => console.error("SignalR Connection Error: ", err));

        return () => {
            if (newConnection) {
                newConnection.stop();
                console.log("SignalR Connection stopped on cleanup.");
            }
        };
    }, [status, session, currentChannelId]);

    const handleOpenChat = async (groupId: string) => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar no chat");
            return;
        }
        if (
            !connectionRef.current ||
            connectionRef.current.state !== signalR.HubConnectionState.Connected
        ) {
            toast.error(
                "Conexão de chat não está ativa. Tentando reconectar..."
            );
            if (
                connectionRef.current &&
                connectionRef.current.state !==
                    signalR.HubConnectionState.Connecting
            ) {
                try {
                    await connectionRef.current.start();
                    console.log("SignalR reconnected for opening chat.");
                } catch (err) {
                    toast.error("Falha ao reconectar ao chat.");
                    console.error("SignalR Reconnection Error: ", err);
                    return;
                }
            } else if (!connectionRef.current) {
                toast.error("Conexão de chat não iniciada.");
                return;
            }
        }
        if (
            currentChannelId &&
            currentChannelId !== groupId &&
            connectionRef.current?.state ===
                signalR.HubConnectionState.Connected
        ) {
            await connectionRef.current.invoke(
                "LeaveChannel",
                currentChannelId
            );
            console.log(`Left previous channel: ${currentChannelId}`);
        }
        if (
            connectionRef.current?.state ===
            signalR.HubConnectionState.Connected
        ) {
            await connectionRef.current.invoke("JoinChannel", groupId);
            setCurrentChannelId(groupId);
            setChatMessages([]);
            setSelectedCommunity(groupId);
            console.log(`Juntou-se ao canal SignalR: ${groupId}`);
        } else {
            console.warn("Cannot join channel, SignalR not connected.");
            toast.error("Não foi possível conectar ao canal do chat.");
        }
    };

    const handleSendChatMessage = async (
        message: string,
        channelId: string
    ) => {
        if (
            !message.trim() ||
            !channelId ||
            !connectionRef.current ||
            connectionRef.current.state !== signalR.HubConnectionState.Connected
        ) {
            toast.error("Não é possível enviar mensagem.");
            return;
        }
        setIsSendingMessage(true);
        try {
            await connectionRef.current.invoke(
                "SendMessage",
                channelId,
                message
            );
        } catch (err) {
            console.error("Erro ao enviar mensagem via SignalR: ", err);
            toast.error("Erro ao enviar mensagem.");
        } finally {
            setIsSendingMessage(false);
        }
    };

    const selectedCommunityData = groups.find(
        (g) => g.id === selectedCommunity
    );

    return (
        <div className="p-8 h-[80vh]">
            <Tabs defaultValue="comunidades" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                        value="comunidades"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        Comunidades
                    </TabsTrigger>
                    <TabsTrigger
                        value="bate-papo"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        Bate Papo
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="comunidades" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">

                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card className="h-full flex flex-col rounded-[40px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        Comunidades que você participa
                                    </CardTitle>
                                </CardHeader>
                                <Input
                                    placeholder="Pesquisar comunidade"
                                    className="w-[80%] mx-auto"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <CardContent className="flex-1 p-0 flex flex-col">
                                    <CommunityCard
                                        groups={groups.filter(
                                            (group) =>
                                                group.name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    ) ||
                                                group.description
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase()
                                                    )
                                        )}
                                        selectedCommunity={selectedCommunity}
                                        setSelectedCommunity={handleOpenChat}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        {/* Área de Chat */}
                        <div className="lg:col-span-2 flex flex-col">
                            {selectedCommunity && selectedCommunityData ? (
                                <ChatWindow
                                    currentGroup={selectedCommunityData}
                                    currentChannelId={selectedCommunityData.id}
                                    messages={chatMessages}
                                    onSendMessage={handleSendChatMessage}
                                    isSendingMessage={isSendingMessage}
                                    onClose={() => setSelectedCommunity(null)}
                                />
                            ) : (
                                <EmptyWindow />
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="bate-papo" className="space-y-4">
                    <div className="flex items-center justify-center h-[calc(100vh-180px)]">
                        <Card className="p-8 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Bate Papo (em breve)
                            </h3>
                            <p className="text-gray-600">
                                Aqui você poderá conversar diretamente com
                                outros membros. Funcionalidade em
                                desenvolvimento.
                            </p>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
