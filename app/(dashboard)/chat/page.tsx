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
import ChatWindow, { type ChatMessageType } from "./_components/chat-window";
import * as signalR from "@microsoft/signalr";
import EmptyWindow from "./_components/empty-window";
import PrivateUserChat from "./_components/privateuserchat";
import { GroupType } from "../comunidades/_components/group-list-item";

// Interface para o payload da mensagem privada, agora gerenciada aqui
interface PrivateMessagePayload {
    chatChannelId: string;
    senderId: string;
    senderDisplayName:string;
    message: string;
    createdAt: string;
    messageId: string;
}

export default function ChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Estado do Chat de Comunidade
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Estado do Chat Privado (agora gerenciado no componente pai)
    const [privateChatMessages, setPrivateChatMessages] = useState<{ [key: string]: ChatMessageType[] }>({});

    // Conexão SignalR ÚNICA e Centralizada
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [isConnectionReady, setIsConnectionReady] = useState(false);
    const currentChannelIdRef = useRef<string | null>(null);

    useEffect(() => {
        currentChannelIdRef.current = currentChannelId;
    }, [currentChannelId]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && session?.user?.accessToken) {
            getGroups(session.user.accessToken).then((data) => {
                setGroups(data.map((g: any) => ({ ...g, description: g.description || "" })));
            });
        }
    }, [status, session, router]);

    // Efeito para gerenciar a conexão SignalR ÚNICA
    useEffect(() => {
        if (status !== "authenticated" || !session?.user.accessToken) {
            if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
                connectionRef.current.stop();
            }
            setIsConnectionReady(false);
            return;
        }

        if (!connectionRef.current || connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                    accessTokenFactory: () => session.user.accessToken!,
                })
                .withAutomaticReconnect()
                .build();
            
            connectionRef.current = connection;

            // Handler para mensagens de GRUPO
            connection.on("ReceiveMessage", (channelId: string, user: string, message: string, createdAt: string, senderUserId: string) => {
                // CORREÇÃO: Agora processamos todas as mensagens, incluindo o eco.
                if (currentChannelIdRef.current === channelId) {
                    setChatMessages((prevMessages) => {
                        const newMessage: ChatMessageType = { userId: senderUserId, user, message, createdAt, senderUserId };
                        return [...prevMessages, newMessage];
                    });
                }
            });

            // Handler para mensagens PRIVADAS
            connection.on("ReceivePrivateMessage", (payload: PrivateMessagePayload) => {
                const { chatChannelId, senderId, senderDisplayName, message, createdAt } = payload;
                
                // CORREÇÃO: Agora processamos todas as mensagens, incluindo o eco.
                const newMessage: ChatMessageType = {
                    userId: senderId,
                    user: senderDisplayName,
                    message,
                    createdAt,
                    senderUserId: senderId,
                };
                setPrivateChatMessages(prev => {
                    const existing = prev[chatChannelId] || [];
                    return {
                        ...prev,
                        [chatChannelId]: [...existing, newMessage].sort(
                            (a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
                        ),
                    };
                });
            });

            connection.onclose((error) => {
                console.log("Conexão SignalR (Unificada) fechada.", error);
                setIsConnectionReady(false);
            });

            connection
                .start()
                .then(() => {
                    console.log("SignalR (Unificada) Conectado.");
                    setIsConnectionReady(true);
                })
                .catch((err) => console.error("Erro na conexão SignalR (Unificada): ", err));
        }

        return () => {
            connectionRef.current?.stop();
            setIsConnectionReady(false);
        };
    }, [status, session]);

    // Funções do Chat de Grupo
    const fetchGroupChatHistory = async (groupId: string, token: string): Promise<ChatMessageType[]> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Chat/${groupId}/getcachedmessages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Falha ao buscar histórico de chat.");
            const history = await response.json();
            return history.map((msg: any) => ({
                userId: msg.createdById,
                user: `${msg.firstName} ${msg.lastName}`.trim(),
                message: msg.message,
                createdAt: msg.createdAt,
                senderUserId: msg.createdById,
            }));
        } catch (error) {
            console.error("Erro ao buscar histórico do chat de grupo:", error);
            toast.error("Erro ao carregar o histórico do chat.");
            return [];
        }
    };

    const handleOpenChat = async (groupId: string) => {
        if (!isConnectionReady || !connectionRef.current || !session?.user?.accessToken) {
            toast.error("Conexão com o chat não está pronta.");
            return;
        }
        if (currentChannelId === groupId) return;
        
        if (currentChannelId) {
            await connectionRef.current.invoke("LeaveChannel", currentChannelId).catch(err => console.error("Erro ao sair do canal anterior:", err));
        }
        
        setSelectedCommunity(groupId);
        setCurrentChannelId(groupId);
        setChatMessages([]);

        try {
            await connectionRef.current.invoke("JoinChannel", groupId);
            const historyMessages = await fetchGroupChatHistory(groupId, session.user.accessToken);
            setChatMessages(historyMessages);
        } catch (err) {
            console.error(`Erro ao entrar no canal ${groupId} ou buscar histórico:`, err);
            toast.error("Não foi possível entrar no chat do grupo.");
            setSelectedCommunity(null);
            setCurrentChannelId(null);
        }
    };
    
    const handleSendChatMessage = async (message: string, channelId: string) => {
        const connection = connectionRef.current;
        if (!message.trim() || !channelId || connection?.state !== signalR.HubConnectionState.Connected) {
            toast.error("Não é possível enviar a mensagem.");
            return;
        }

        setIsSendingMessage(true);
        try {
            // CORREÇÃO: Removemos a atualização otimista. A mensagem só aparece
            // quando o servidor a envia de volta.
            await connection.invoke("SendMessage", channelId, message);
        } catch (err) {
            console.error("Erro ao enviar mensagem de GRUPO via SignalR: ", err);
            toast.error("Erro ao enviar mensagem.");
            // CORREÇÃO: Não precisamos mais reverter o estado.
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleCloseChat = () => {
        const connection = connectionRef.current;
        if (connection && currentChannelId) {
            connection.invoke("LeaveChannel", currentChannelId).catch(err => console.error("Erro ao sair do canal ao fechar:", err));
        }
        setSelectedCommunity(null);
        setCurrentChannelId(null);
        setChatMessages([]);
    };
    
    const selectedCommunityData = groups.find((g) => g.id === selectedCommunity);

    return (
        <div className="p-4 sm:p-8 h-full">
            <Tabs defaultValue="comunidades" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="comunidades" className="flex items-center gap-2 text-lg font-semibold">
                        <Users /> Comunidades
                    </TabsTrigger>
                    <TabsTrigger value="bate-papo" className="flex items-center gap-2 text-lg font-semibold">
                        <MessageCircle /> Bate Papo Pessoal
                    </TabsTrigger>
                </TabsList>

                {/* Aba de Comunidades */}
                <TabsContent value="comunidades" className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">Comunidades que você participa</CardTitle>
                                </CardHeader>
                                <div className="px-6 pb-4">
                                    <Input
                                        placeholder="Pesquisar comunidade..."
                                        className="w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                                    <CommunityCard
                                        groups={groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                                        selectedCommunity={selectedCommunity}
                                        setSelectedCommunity={handleOpenChat}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2 flex flex-col h-full">
                             {!isConnectionReady ? (
                                <EmptyWindow title="Conectando..." message="Aguarde enquanto conectamos ao serviço de chat." />
                             ) : selectedCommunityData && currentChannelId ? (
                                <ChatWindow
                                    currentGroup={selectedCommunityData}
                                    currentChannelId={currentChannelId}
                                    messages={chatMessages}
                                    onSendMessage={handleSendChatMessage}
                                    isSendingMessage={isSendingMessage}
                                    onClose={handleCloseChat}
                                    currentUserId={session?.user.id || ""}
                                />
                            ) : (
                                <EmptyWindow
                                    title="Chat de Comunidade"
                                    message="Selecione uma comunidade da lista para começar a conversar."
                                    icon={<Users className="h-16 w-16 text-gray-400" />}
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>
                
                {/* Aba de Chat Pessoal */}
                <TabsContent value="bate-papo" className="flex-1 overflow-y-auto">
                    {isConnectionReady && connectionRef.current ? (
                        <PrivateUserChat
                            connection={connectionRef.current}
                            privateChatMessages={privateChatMessages}
                            setPrivateChatMessages={setPrivateChatMessages}
                        />
                    ) : (
                         <EmptyWindow title="Conectando..." message="Aguarde enquanto conectamos ao serviço de chat." />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
