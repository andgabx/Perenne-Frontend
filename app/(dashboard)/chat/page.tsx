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

export default function ChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const groupChatConnectionRef = useRef<signalR.HubConnection | null>(null);
    const currentChannelIdRef = useRef<string | null>(null);

    // Manter a ref sincronizada com o estado para evitar closures obsoletas
    useEffect(() => {
        currentChannelIdRef.current = currentChannelId;
    }, [currentChannelId]);

    // Efeito para buscar os grupos do usuário
    useEffect(() => {
        if (status === "authenticated" && session?.user?.accessToken) {
            getGroups(session.user.accessToken).then((data) => {
                setGroups(data.map((g) => ({ ...g, description: (g as any).description || "" })));
            });
        }
    }, [status, session]);

    // Efeito para lidar com o status de autenticação
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Efeito para gerir a conexão SignalR
    useEffect(() => {
        if (status !== "authenticated" || !session?.user.accessToken) {
            groupChatConnectionRef.current?.stop();
            return;
        }

        if (!groupChatConnectionRef.current || groupChatConnectionRef.current.state === signalR.HubConnectionState.Disconnected) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                    accessTokenFactory: () => session.user.accessToken!,
                })
                .withAutomaticReconnect()
                .build();

            groupChatConnectionRef.current = connection;

            connection.onclose((error) => console.log("Conexão SignalR (Grupo) fechada.", error));

            // CORRIGIDO: O handler de mensagens agora usa a estrutura correta de ChatMessageType
            connection.on("ReceiveMessage", (channelId: string, user: string, message: string, createdAt: string, senderUserId: string) => {
                if (currentChannelIdRef.current === channelId) {
                    setChatMessages((prevMessages) => {
                        // Verificação de duplicados para evitar problemas com a atualização otimista
                        const messageExists = prevMessages.some(
                            (m) => m.message === message && m.userId === senderUserId && new Date(m.createdAt || "").getTime() === new Date(createdAt).getTime()
                        );
                        if (messageExists) {
                            return prevMessages;
                        }
                        const newMessage: ChatMessageType = {
                            userId: senderUserId, // Mapeado corretamente
                            user,
                            message,
                            createdAt,
                        };
                        return [...prevMessages, newMessage];
                    });
                }
            });

            connection
                .start()
                .then(() => console.log("SignalR (Grupo) Conectado."))
                .catch((err) => console.error("Erro na conexão SignalR (Grupo): ", err));
        }
        
        return () => {
            groupChatConnectionRef.current?.stop();
        };
    }, [status, session]);

    // Função para buscar o histórico de mensagens de um grupo
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
            }));
        } catch (error) {
            console.error("Erro ao buscar histórico do chat de grupo:", error);
            toast.error("Erro ao carregar o histórico do chat.");
            return [];
        }
    };
    
    // Lógica para abrir um chat
    const handleOpenChat = async (groupId: string) => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar no chat.");
            return;
        }
        if (currentChannelId === groupId) return;

        const connection = groupChatConnectionRef.current;
        if (connection?.state !== signalR.HubConnectionState.Connected) {
            toast.error("Conexão com o chat não está ativa.");
            return;
        }
        
        if (currentChannelId) {
            await connection.invoke("LeaveChannel", currentChannelId).catch(err => console.error("Erro ao sair do canal anterior:", err));
        }
        
        setSelectedCommunity(groupId);
        setCurrentChannelId(groupId);
        setChatMessages([]);

        try {
            await connection.invoke("JoinChannel", groupId);
            const historyMessages = await fetchGroupChatHistory(groupId, session.user.accessToken);
            setChatMessages(historyMessages);
        } catch (err) {
            console.error(`Erro ao entrar no canal ${groupId} ou buscar histórico:`, err);
            toast.error("Não foi possível entrar no chat do grupo.");
            setSelectedCommunity(null);
            setCurrentChannelId(null);
        }
    };
    
    // Lógica para enviar mensagem
    const handleSendChatMessage = async (message: string, channelId: string) => {
        const connection = groupChatConnectionRef.current;
        if (!message.trim() || !channelId || connection?.state !== signalR.HubConnectionState.Connected) {
            toast.error("Não é possível enviar a mensagem.");
            return;
        }

        setIsSendingMessage(true);
        try {
            // CORRIGIDO: Atualização otimista com a estrutura de dados correta
            const optimisticMessage: ChatMessageType = {
                userId: session?.user.id || "",
                user: session?.user.name || "Eu",
                message: message,
                createdAt: new Date().toISOString(),
            };
            setChatMessages((prev) => [...prev, optimisticMessage]);

            await connection.invoke("SendMessage", channelId, message);
        } catch (err) {
            console.error("Erro ao enviar mensagem de GRUPO via SignalR: ", err);
            toast.error("Erro ao enviar mensagem.");
            setChatMessages((prev) => prev.filter((m) => m.message !== message && m.user === (session?.user.name || "Eu")));
        } finally {
            setIsSendingMessage(false);
        }
    };

    const selectedCommunityData = groups.find((g) => g.id === selectedCommunity);

    const handleCloseChat = () => {
        const connection = groupChatConnectionRef.current;
        if (connection && currentChannelId) {
            connection.invoke("LeaveChannel", currentChannelId).catch(err => console.error("Erro ao sair do canal ao fechar:", err));
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
                            {selectedCommunityData && currentChannelId === selectedCommunityData.id ? (
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
