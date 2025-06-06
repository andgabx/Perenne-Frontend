"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, X } from "lucide-react";
import { getHeaders } from "@/pages/api/headers";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import type { HubConnection } from "@microsoft/signalr";
import type { ChatMessageType } from "./chat-window";
import EmptyWindow from "./empty-window";

// --- Tipos e Interfaces ---
export interface UserType {
    id: string;
    name: string;
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
}

interface PrivateChatChannelDetails {
    id: string; // chatChannelId
    isPrivate: boolean;
    otherParticipant: {
        id: string;
        displayName: string;
    };
    messages?: ChatMessageType[];
}

interface PrivateUserChatProps {
    connection: HubConnection;
    privateChatMessages: { [key: string]: ChatMessageType[] };
    setPrivateChatMessages: React.Dispatch<
        React.SetStateAction<{ [key: string]: ChatMessageType[] }>
    >;
}

// --- Componente ---
const PrivateUserChat = ({
    connection,
    privateChatMessages,
    setPrivateChatMessages,
}: PrivateUserChatProps) => {
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [selectedPrivateChatUser, setSelectedPrivateChatUser] =
        useState<UserType | null>(null);
    const [currentPrivateChatChannel, setCurrentPrivateChatChannel] =
        useState<PrivateChatChannelDetails | null>(null);
    const [isSendingPrivateMessage, setIsSendingPrivateMessage] =
        useState(false);
    const [privateMessageInput, setPrivateMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Busca a lista de usuários para iniciar conversa
    useEffect(() => {
        const fetchUsers = async () => {
            if (!session?.user?.accessToken) return;
            setIsLoadingUsers(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/user/getallusers`,
                    {
                        headers: getHeaders(session.user.accessToken),
                    }
                );
                if (!response.ok) throw new Error("Erro ao buscar usuários");
                const data = await response.json();
                setUsers(
                    data
                        .filter((user: any) => user.id !== session?.user?.id)
                        .map((user: any) => ({
                            ...user,
                            name: [user.firstName, user.lastName]
                                .filter(Boolean)
                                .join(" "),
                            avatarUrl: user.profilePictureUrl || "",
                        }))
                );
            } catch (error: any) {
                toast.error(error.message || "Erro ao buscar usuários.");
            } finally {
                setIsLoadingUsers(false);
            }
        };

        if (session) {
            fetchUsers();
        }
    }, [session]);

    // Função para buscar histórico do chat privado
    const fetchChatHistory = async (otherUserId: string, channelId: string) => {
        if (!session?.user?.accessToken || !otherUserId || !channelId) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/private/${otherUserId}`,
                {
                    headers: getHeaders(session.user.accessToken),
                }
            );
            if (!response.ok) {
                throw new Error("Erro ao buscar histórico do chat.");
            }
            const messages: any[] = await response.json();

            // Mapeia a resposta para o tipo correto e armazena no estado do PAI usando a CHAVE CORRETA (channelId)
            setPrivateChatMessages((prev) => {
                const existingMessages = prev[channelId] || [];
                const newMessages = messages
                    .map((msg) => ({
                        userId: msg.senderUserId,
                        user: msg.user,
                        message: msg.message,
                        createdAt: msg.createdAt,
                        senderUserId: msg.senderUserId,
                    }))
                    .filter(
                        (newMsg) =>
                            !existingMessages.some(
                                (existingMsg) =>
                                    existingMsg.message === newMsg.message &&
                                    existingMsg.senderUserId ===
                                        newMsg.senderUserId &&
                                    existingMsg.createdAt === newMsg.createdAt
                            )
                    );

                return {
                    ...prev,
                    [channelId]: [...existingMessages, ...newMessages].sort(
                        (a, b) =>
                            new Date(a.createdAt || "").getTime() -
                            new Date(b.createdAt || "").getTime()
                    ),
                };
            });
        } catch (error: any) {
            toast.error(error.message || "Erro ao buscar histórico do chat.");
        }
    };

    // Abre um chat privado, busca o canal e o histórico
    const handleOpenPrivateChat = async (userToChatWith: UserType) => {
        if (!session?.user?.accessToken) {
            toast.error("Você precisa estar logado para iniciar um chat.");
            return;
        }

        setSelectedPrivateChatUser(userToChatWith);
        setCurrentPrivateChatChannel(null); // Reseta enquanto carrega

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/private/start`,
                {
                    method: "POST",
                    headers: {
                        ...getHeaders(session.user.accessToken),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recipientUserId: userToChatWith.id,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Erro ao iniciar chat privado.");
            }
            const chatChannelDetails: PrivateChatChannelDetails =
                await response.json();
            setCurrentPrivateChatChannel(chatChannelDetails);

            // Busca o histórico e armazena com a chave correta (ID do canal)
            await fetchChatHistory(userToChatWith.id, chatChannelDetails.id);
        } catch (error: any) {
            toast.error(
                error.message || "Não foi possível iniciar o chat privado."
            );
            setSelectedPrivateChatUser(null);
        }
    };

    // Envia uma mensagem privada
    const handleSendPrivateMessage = async () => {
        if (
            !privateMessageInput.trim() ||
            !currentPrivateChatChannel?.id ||
            !selectedPrivateChatUser?.id
        )
            return;
        if (connection.state !== "Connected") {
            toast.error("Conexão com o chat não está ativa.");
            return;
        }

        setIsSendingPrivateMessage(true);
        const messageToSend = privateMessageInput;
        setPrivateMessageInput("");

        const optimisticCreatedAt = new Date().toISOString();
        try {
            // Atualização otimista da UI
            const optimisticMessage: ChatMessageType = {
                userId: session!.user!.id!,
                user: "Eu",
                message: messageToSend,
                createdAt: optimisticCreatedAt,
                senderUserId: session!.user!.id!,
            };

            setPrivateChatMessages((prev) => {
                const channelMessages =
                    prev[currentPrivateChatChannel.id] || [];
                const messageExists = channelMessages.some(
                    (m) =>
                        m.message === messageToSend &&
                        m.senderUserId === session!.user!.id! &&
                        m.createdAt === optimisticCreatedAt
                );

                if (messageExists) return prev;

                return {
                    ...prev,
                    [currentPrivateChatChannel.id]: [
                        ...channelMessages,
                        optimisticMessage,
                    ].sort(
                        (a, b) =>
                            new Date(a.createdAt || "").getTime() -
                            new Date(b.createdAt || "").getTime()
                    ),
                };
            });

            // Envia a mensagem para o servidor
            await connection.invoke(
                "SendPrivateMessage",
                selectedPrivateChatUser.id,
                messageToSend
            );
        } catch (err: any) {
            console.error("Erro ao enviar mensagem privada via SignalR: ", err);
            toast.error(
                `Erro ao enviar: ${err.message || "Erro desconhecido"}`
            );
            setPrivateMessageInput(messageToSend);
            // Reverte a atualização otimista em caso de falha
            setPrivateChatMessages((prev) => {
                const channelMessages =
                    prev[currentPrivateChatChannel.id] || [];
                return {
                    ...prev,
                    [currentPrivateChatChannel.id]: channelMessages.filter(
                        (m) => m.createdAt !== optimisticCreatedAt
                    ),
                };
            });
        } finally {
            setIsSendingPrivateMessage(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [privateChatMessages, currentPrivateChatChannel]);

    // Lógica de renderização
    const filteredUsers = users.filter((user) =>
        (user.name || "").toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    // CORRIGIDO: Usa o ID do canal para buscar as mensagens corretas
    const currentMessagesForChannel = currentPrivateChatChannel
        ? privateChatMessages[currentPrivateChatChannel.id] || []
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Coluna da Lista de Usuários */}
            <div className="lg:col-span-1 flex flex-col h-full">
                <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]">
                    <CardHeader>
                        <CardTitle className="flex items-center py-4 gap-2">
                            <User className="h-5 w-5" /> Conversar com
                        </CardTitle>
                    </CardHeader>
                    <div className="px-6 pb-4">
                        <Input
                            placeholder="Pesquisar usuário..."
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                    </div>
                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-6 pt-0">
                            {isLoadingUsers ? (
                                <p className="text-center text-gray-500">
                                    Carregando...
                                </p>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                            selectedPrivateChatUser?.id ===
                                            user.id
                                                ? "bg-blue-100 dark:bg-blue-800"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleOpenPrivateChat(user)
                                        }
                                    >
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage
                                                src={user.avatarUrl}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>
                                                {(user.firstName?.charAt(0) ||
                                                    "") +
                                                    (user.lastName?.charAt(0) ||
                                                        "") || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {user.name}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">
                                    Nenhum usuário encontrado.
                                </p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Coluna da Janela de Chat Privado */}
            <div className="lg:col-span-2 flex flex-col h-full">
                {selectedPrivateChatUser && currentPrivateChatChannel ? (
                    <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]">
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={selectedPrivateChatUser.avatarUrl}
                                        alt={selectedPrivateChatUser.name}
                                    />
                                    <AvatarFallback>
                                        {(selectedPrivateChatUser.firstName?.charAt(
                                            0
                                        ) || "") +
                                            (selectedPrivateChatUser.lastName?.charAt(
                                                0
                                            ) || "") || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle>
                                    {selectedPrivateChatUser.name}
                                </CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSelectedPrivateChatUser(null);
                                    setCurrentPrivateChatChannel(null);
                                }}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <ScrollArea className="flex-1 max-h-[60vh] p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                            {currentMessagesForChannel.map((msg, index) => (
                                <div
                                    key={`${msg.senderUserId}-${msg.createdAt}-${index}`}
                                    className={`flex ${
                                        msg.senderUserId === session?.user?.id
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg ${
                                            msg.senderUserId ===
                                            session?.user?.id
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold mb-1">
                                            {msg.senderUserId ===
                                            session?.user?.id
                                                ? "Eu"
                                                : selectedPrivateChatUser?.name}
                                        </p>
                                        <p>{msg.message}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {msg.createdAt
                                                ? new Date(
                                                      msg.createdAt
                                                  ).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </ScrollArea>
                        <CardContent className="p-4 border-t">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Digite sua mensagem..."
                                    value={privateMessageInput}
                                    onChange={(e) =>
                                        setPrivateMessageInput(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" &&
                                        !isSendingPrivateMessage &&
                                        handleSendPrivateMessage()
                                    }
                                    className="flex-1"
                                    disabled={
                                        isSendingPrivateMessage ||
                                        !currentPrivateChatChannel
                                    }
                                />
                                <Button
                                    onClick={handleSendPrivateMessage}
                                    disabled={
                                        isSendingPrivateMessage ||
                                        !privateMessageInput.trim() ||
                                        !currentPrivateChatChannel
                                    }
                                >
                                    <Send className="h-5 w-5" />
                                    <span className="sr-only">Enviar</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <EmptyWindow
                        title="Bate-papo Pessoal"
                        message="Selecione um usuário da lista para iniciar uma conversa privada."
                        icon={<User className="h-16 w-16 text-gray-400" />}
                    />
                )}
            </div>
        </div>
    );
};

export default PrivateUserChat;
