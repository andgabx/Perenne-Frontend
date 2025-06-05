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
import { useRouter } from "next/navigation";
import * as signalR from "@microsoft/signalr";
import type { ChatMessageType } from "./chat-window"; // Reutilizando ChatMessageType
import EmptyWindow from "./empty-window";

export interface UserType {
    id: string;
    name: string;
    avatarUrl?: string;
}

// Interface para o payload da mensagem privada recebida do servidor
interface PrivateMessagePayload {
    chatChannelId: string;
    senderId: string;
    senderDisplayName: string;
    message: string;
    createdAt: string;
    messageId: string;
}

// Interface para os detalhes do chat privado obtidos da API
interface PrivateChatChannelDetails {
    id: string; // chatChannelId
    isPrivate: boolean;
    user1Id?: string;
    user2Id?: string;
    otherParticipant: {
        id: string;
        displayName: string;
    };
    messages?: ChatMessageType[]; // Para carregar histórico
}

const PrivateUserChat = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");

    const [selectedPrivateChatUser, setSelectedPrivateChatUser] =
        useState<UserType | null>(null);
    const [currentPrivateChatChannel, setCurrentPrivateChatChannel] =
        useState<PrivateChatChannelDetails | null>(null);

    const privateChatConnectionRef = useRef<signalR.HubConnection | null>(null);
    const [privateChatMessages, setPrivateChatMessages] = useState<{
        [chatChannelId: string]: ChatMessageType[];
    }>({});
    const [isSendingPrivateMessage, setIsSendingPrivateMessage] =
        useState(false);
    const [privateMessageInput, setPrivateMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao buscar usuários");
            }
            const data = await response.json();
            setUsers(
                data.filter((user: UserType) => user.id !== session?.user?.id)
            );
        } catch (error: any) {
            toast.error(error.message || "Erro ao buscar usuários.");
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchUsers();
        }
    }, [status, session]);

    // Efeito para Conexão SignalR (Uma única conexão para chat privado)
    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            if (
                privateChatConnectionRef.current &&
                privateChatConnectionRef.current.state ===
                    signalR.HubConnectionState.Connected
            ) {
                privateChatConnectionRef.current
                    .stop()
                    .then(() =>
                        console.log(
                            "SignalR (Privado) Connection stopped due to session/status change."
                        )
                    )
                    .catch((err) =>
                        console.error(
                            "Error stopping SignalR (Privado) connection:",
                            err
                        )
                    );
            }
            privateChatConnectionRef.current = null;
            return;
        }

        // Só cria nova conexão se não existir ou não estiver conectada/conectando
        if (
            !privateChatConnectionRef.current ||
            privateChatConnectionRef.current.state ===
                signalR.HubConnectionState.Disconnected
        ) {
            const newPrivateConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                    // <-- URL CORRIGIDA
                    accessTokenFactory: () => session.user.accessToken!,
                })
                .withAutomaticReconnect()
                .build();

            newPrivateConnection.onclose((error) => {
                console.log("SignalR (Privado) Connection closed.", error);
            });

            newPrivateConnection.on(
                "ReceivePrivateMessage",
                (payload: PrivateMessagePayload) => {
                    console.log("Private message received:", payload);
                    const {
                        chatChannelId,
                        senderId,
                        senderDisplayName,
                        message,
                        createdAt,
                    } = payload;

                    setPrivateChatMessages((prevMessages) => {
                        const existingMessages =
                            prevMessages[chatChannelId] || [];
                        const newMessage: ChatMessageType = {
                            userId: senderId, // ID do usuário que enviou
                            user: senderDisplayName || senderId, // Nome de exibição do remetente
                            message,
                            createdAt,
                            senderUserId: senderId, // ID do remetente
                        };

                        if (
                            existingMessages.some(
                                (m) =>
                                    m.message === newMessage.message &&
                                    m.createdAt === newMessage.createdAt &&
                                    m.senderUserId === newMessage.senderUserId
                            )
                        ) {
                            return prevMessages;
                        }
                        return {
                            ...prevMessages,
                            [chatChannelId]: [
                                ...existingMessages,
                                newMessage,
                            ].sort(
                                (a, b) =>
                                    new Date(a.createdAt!).getTime() -
                                    new Date(b.createdAt!).getTime()
                            ),
                        };
                    });
                }
            );

            newPrivateConnection
                .start()
                .then(() => {
                    console.log("SignalR (Privado) Connected successfully.");
                    privateChatConnectionRef.current = newPrivateConnection;
                })
                .catch((err) => {
                    console.error("SignalR (Privado) Connection Error: ", err);
                    toast.error("Falha ao conectar ao chat privado.");
                });
        }

        // Cleanup function
        return () => {
            // Stop connection when the component unmounts or dependencies change significantly
            // This check is important because the effect might run multiple times
            if (
                privateChatConnectionRef.current &&
                (status !== "authenticated" || !session?.user?.accessToken)
            ) {
                // Ensure cleanup only if session/status leads to disconnection
                privateChatConnectionRef.current
                    .stop()
                    .then(() =>
                        console.log(
                            "SignalR (Privado) Connection stopped on cleanup."
                        )
                    )
                    .catch((err) =>
                        console.error(
                            "Error stopping SignalR (Privado) connection on cleanup:",
                            err
                        )
                    );
                privateChatConnectionRef.current = null;
            }
        };
    }, [status, session]);

    const fetchChatHistory = async (
        channelId: string,
        otherParticipantName: string
    ) => {
        if (!session?.user?.accessToken || !channelId) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/private/${channelId}/messages/50`,
                {
                    headers: getHeaders(session.user.accessToken),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erro ao buscar histórico do chat."
                );
            }
            const messages: ChatMessageType[] = await response.json();

            setPrivateChatMessages((prev) => ({
                ...prev,
                [channelId]: messages
                    .map((m) => ({
                        ...m,
                        user:
                            m.senderUserId === session?.user?.id
                                ? "Eu"
                                : otherParticipantName || m.senderUserId || "",
                    }))
                    .sort(
                        (a, b) =>
                            new Date(a.createdAt!).getTime() -
                            new Date(b.createdAt!).getTime()
                    ),
            }));
        } catch (error: any) {
            toast.error(error.message || "Erro ao buscar histórico do chat.");
            console.error("Erro ao buscar histórico do chat:", error);
        }
    };

    const handleOpenPrivateChat = async (userToChatWith: UserType) => {
        if (
            status !== "authenticated" ||
            !session?.user?.accessToken ||
            !session?.user?.id
        ) {
            toast.error("Você precisa estar logado para iniciar um chat.");
            return;
        }
        if (userToChatWith.id === session.user.id) {
            toast.error("Você não pode iniciar um chat consigo mesmo.");
            return;
        }

        setSelectedPrivateChatUser(userToChatWith);
        setCurrentPrivateChatChannel(null);

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
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erro ao iniciar chat privado."
                );
            }

            const chatChannelDetails: PrivateChatChannelDetails =
                await response.json();
            setCurrentPrivateChatChannel(chatChannelDetails);

            if (chatChannelDetails && chatChannelDetails.id) {
                if (!privateChatMessages[chatChannelDetails.id]?.length) {
                    await fetchChatHistory(
                        chatChannelDetails.id,
                        chatChannelDetails.otherParticipant.displayName
                    );
                } else {
                    setPrivateChatMessages((prev) => ({
                        ...prev,
                        [chatChannelDetails.id]: (
                            prev[chatChannelDetails.id] || []
                        )
                            .map((m) => ({
                                ...m,
                                user:
                                    m.senderUserId === session?.user?.id
                                        ? "Eu"
                                        : chatChannelDetails.otherParticipant
                                              .displayName ||
                                          m.senderUserId ||
                                          "",
                            }))
                            .sort(
                                (a, b) =>
                                    new Date(a.createdAt!).getTime() -
                                    new Date(b.createdAt!).getTime()
                            ),
                    }));
                }
            }
            console.log(
                `Chat privado com ${userToChatWith.name} (ID: ${userToChatWith.id}) iniciado. Channel ID: ${chatChannelDetails?.id}`
            );
        } catch (error: any) {
            toast.error(
                error.message || "Não foi possível iniciar o chat privado."
            );
            console.error("Erro ao iniciar chat privado:", error);
            setSelectedPrivateChatUser(null);
        }
    };

    const handleSendPrivateMessage = async () => {
        if (
            !privateMessageInput.trim() ||
            !currentPrivateChatChannel?.id ||
            !selectedPrivateChatUser?.id
        ) {
            toast.error("Selecione um chat e digite uma mensagem.");
            return;
        }
        if (
            !privateChatConnectionRef.current ||
            privateChatConnectionRef.current.state !==
                signalR.HubConnectionState.Connected
        ) {
            toast.error(
                "Conexão de chat privado não está ativa. Tentando reconectar..."
            );
            try {
                await privateChatConnectionRef.current?.start();
                console.log(
                    "SignalR (Privado) Reconnected for sending message."
                );
                if (
                    privateChatConnectionRef.current?.state !==
                    signalR.HubConnectionState.Connected
                ) {
                    toast.error("Falha ao reconectar ao chat privado.");
                    return;
                }
            } catch (err) {
                toast.error("Falha ao reconectar ao chat privado.");
                console.error("SignalR (Privado) Reconnection Error: ", err);
                return;
            }
        }
        if (!session?.user?.id || !session?.user?.name) {
            toast.error(
                "Usuário não autenticado ou nome de usuário não disponível."
            );
            return;
        }

        setIsSendingPrivateMessage(true);
        const messageToSend = privateMessageInput;
        setPrivateMessageInput("");

        try {
            await privateChatConnectionRef.current.invoke(
                "SendPrivateMessage",
                selectedPrivateChatUser.id,
                messageToSend
            );

            // Optimistic UI update - server will also send this message via "ReceivePrivateMessage"
            // The "ReceivePrivateMessage" handler has logic to prevent exact duplicates.
            const newMessageForSender: ChatMessageType = {
                userId: session.user.id,
                user: "Eu",
                message: messageToSend,
                createdAt: new Date().toISOString(),
                senderUserId: session.user.id,
            };

            setPrivateChatMessages((prev) => {
                const existingMessages =
                    prev[currentPrivateChatChannel.id] || [];
                // Check for duplicate before adding optimistically
                if (
                    existingMessages.some(
                        (m) =>
                            m.message === newMessageForSender.message &&
                            m.senderUserId ===
                                newMessageForSender.senderUserId &&
                            Math.abs(
                                new Date(m.createdAt!).getTime() -
                                    new Date(
                                        newMessageForSender.createdAt!
                                    ).getTime()
                            ) < 2000
                    )
                ) {
                    // 2s threshold for optimistic
                    return prev;
                }
                return {
                    ...prev,
                    [currentPrivateChatChannel.id]: [
                        ...existingMessages,
                        newMessageForSender,
                    ].sort(
                        (a, b) =>
                            new Date(a.createdAt!).getTime() -
                            new Date(b.createdAt!).getTime()
                    ),
                };
            });
        } catch (err: any) {
            console.error("Erro ao enviar mensagem privada via SignalR: ", err);
            toast.error(
                `Erro ao enviar: ${err.message || "Erro desconhecido"}`
            );
            setPrivateMessageInput(messageToSend);
        } finally {
            setIsSendingPrivateMessage(false);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [privateChatMessages, currentPrivateChatChannel]);

    const filteredUsers = users.filter((user) =>
        (user.name || "").toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    const currentMessagesForChannel = currentPrivateChatChannel?.id
        ? privateChatMessages[currentPrivateChatChannel.id] || []
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Coluna da Lista de Usuários */}
            <div className="lg:col-span-1 flex flex-col h-full">
                <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Conversar com
                        </CardTitle>
                    </CardHeader>
                    <div className="px-6 pb-4">
                        <Input
                            placeholder="Pesquisar usuário..."
                            className="w-full"
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                    </div>
                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-6 pt-0">
                            {isLoadingUsers ? (
                                <p className="text-center text-gray-500">
                                    Carregando usuários...
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
                                                {user.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
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
                                        {selectedPrivateChatUser.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle>
                                    {currentPrivateChatChannel.otherParticipant
                                        .displayName ||
                                        selectedPrivateChatUser.name}
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
                        <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                            {currentMessagesForChannel.map((msg, index) => (
                                <div
                                    key={
                                        msg.createdAt
                                            ? `${msg.senderUserId}-${msg.createdAt}-${index}`
                                            : `${msg.message}-${index}`
                                    }
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
                                            {msg.user}
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
                                    <span className="ml-2 sr-only">Enviar</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <EmptyWindow
                        message="Selecione um usuário para iniciar uma conversa."
                        icon={<User className="h-16 w-16 text-gray-400" />}
                    />
                )}
            </div>
        </div>
    );
};

export default PrivateUserChat;
