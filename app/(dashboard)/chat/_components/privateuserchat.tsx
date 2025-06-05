"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //
import { Button } from "@/components/ui/button"; //
import { Input } from "@/components/ui/input"; //
import { ScrollArea } from "@/components/ui/scroll-area"; //
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; //
import { Send, User, X, Users } from "lucide-react"; //
import { getHeaders } from "@/pages/api/headers"; //
import toast from "react-hot-toast"; //
import { useSession } from "next-auth/react"; //
import { useRouter } from "next/navigation"; //
import * as signalR from "@microsoft/signalr"; //
import type { ChatMessageType } from "./chat-window"; // Reutilizando ChatMessageType //
import EmptyWindow from "./empty-window"; //

// Definição para o tipo de usuário (simplificado)
export interface UserType {
    id: string; //
    name: string; //
    avatarUrl?: string; // Opcional //
    // Adicione outros campos conforme necessário
}

const PrivateUserChat = () => {
    const { data: session, status } = useSession(); //
    const router = useRouter(); //

    // Estado para Chat Privado
    const [users, setUsers] = useState<UserType[]>([]); //
    const [isLoadingUsers, setIsLoadingUsers] = useState(false); //
    const [userSearchQuery, setUserSearchQuery] = useState(""); //
    const [selectedPrivateChatUserId, setSelectedPrivateChatUserId] = useState<
        string | null
    >(null); //
    const privateChatConnectionRef = useRef<signalR.HubConnection | null>(null); //
    const [privateChatMessages, setPrivateChatMessages] = useState<{
        [key: string]: ChatMessageType[];
    }>({}); //
    const [isSendingPrivateMessage, setIsSendingPrivateMessage] =
        useState(false); //
    const [privateMessageInput, setPrivateMessageInput] = useState(""); //

    // Efeito para redirecionar se não autenticado
    useEffect(() => {
        if (status === "unauthenticated") { //
            router.push("/login"); //
        }
    }, [status, router]); //

    // Função para buscar usuários
    const fetchUsers = async () => {
        if (!session?.user?.accessToken) return; //
        setIsLoadingUsers(true); //
        try {
            const response = await fetch( //
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/getallusers`,
                {
                    headers: getHeaders(session.user.accessToken), //
                }
            );
            if (!response.ok) throw new Error("Erro ao buscar usuários"); //
            const data = await response.json(); //
            // Filtrar o próprio usuário da lista
            setUsers(data.filter((user: UserType) => user.id !== session.user.id));
        } catch (error) {
            toast.error("Erro ao buscar usuários."); //
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setIsLoadingUsers(false); //
        }
    };

    useEffect(() => {
        if (status === "authenticated") { //
            fetchUsers(); //
        }
    }, [status, session]); //

    // Efeito para Conexão SignalR do Chat Privado
    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.accessToken) { //
            if (privateChatConnectionRef.current) { //
                privateChatConnectionRef.current.stop(); //
                privateChatConnectionRef.current = null; //
            }
            return; //
        }

        const newPrivateConnection = new signalR.HubConnectionBuilder() //
            .withUrl(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/private/start`, //
                {
                    accessTokenFactory: () => session.user.accessToken!, //
                }
            )
            .withAutomaticReconnect() //
            .build(); //

        newPrivateConnection.onclose((error) => { //
            console.log("SignalR (Privado) Connection closed.", error); //
        });

        newPrivateConnection.on( //
            "ReceivePrivateMessage",
            (
                fromUserId: string, //
                message: string, //
                createdAt: string, //
                displayName: string //
            ) => {
                const messageSenderId = fromUserId; //
                // Determina com quem é a conversa: se a mensagem é minha, o parceiro é selectedPrivateChatUserId,
                // caso contrário, é quem enviou (fromUserId).
                const chatPartnerId =
                    fromUserId === session?.user?.id
                        ? selectedPrivateChatUserId
                        : fromUserId; //

                if (!chatPartnerId) return; // Não processar se não estiver claro para qual chat é //

                setPrivateChatMessages((prevMessages) => { //
                    const newMessagesForUser = [ //
                        ...(prevMessages[chatPartnerId] || []),
                        {
                            userId: messageSenderId, //
                            user: displayName || messageSenderId, //
                            message, //
                            createdAt, //
                            senderUserId: messageSenderId, //
                        },
                    ];
                    return { //
                        ...prevMessages,
                        [chatPartnerId]: newMessagesForUser, //
                    };
                });
            }
        );

        newPrivateConnection
            .start() //
            .then(() => {
                console.log("SignalR (Privado) Connected."); //
                privateChatConnectionRef.current = newPrivateConnection; //
            })
            .catch((err) =>
                console.error("SignalR (Privado) Connection Error: ", err) //
            );

        return () => {
            if (newPrivateConnection) { //
                newPrivateConnection
                    .stop() //
                    .then(() =>
                        console.log( //
                            "SignalR (Privado) Connection stopped on cleanup."
                        )
                    );
            }
        };
    }, [status, session, selectedPrivateChatUserId]); // Adicionado selectedPrivateChatUserId para reavaliar o chatPartnerId na lógica de recebimento

    const handleOpenPrivateChat = (userIdToChatWith: string) => { //
        if (status !== "authenticated" || !session?.user?.accessToken) { //
            toast.error("Você precisa estar logado para iniciar um chat."); //
            return; //
        }
        if (
            !privateChatConnectionRef.current || //
            privateChatConnectionRef.current.state !== //
                signalR.HubConnectionState.Connected //
        ) {
            toast.error("Conexão de chat privado não está ativa."); //
            return; //
        }
        setSelectedPrivateChatUserId(userIdToChatWith); //
        if (!privateChatMessages[userIdToChatWith]) { //
            setPrivateChatMessages((prev) => ({ //
                ...prev,
                [userIdToChatWith]: [], //
            }));
        }
        console.log(`Abrindo chat privado com: ${userIdToChatWith}`); //
    };

    const handleSendPrivateMessage = async () => { //
        if (
            !privateMessageInput.trim() || //
            !selectedPrivateChatUserId || //
            !privateChatConnectionRef.current || //
            privateChatConnectionRef.current.state !== //
                signalR.HubConnectionState.Connected //
        ) {
            toast.error( //
                "Não é possível enviar mensagem privada. Verifique a seleção e a conexão."
            );
            return; //
        }
        if (!session?.user?.id) { //
            toast.error("Usuário não autenticado."); //
            return; //
        }

        setIsSendingPrivateMessage(true); //
        const messageToSend = privateMessageInput; //
        setPrivateMessageInput(""); // Limpa o input imediatamente //

        try {
            await privateChatConnectionRef.current.invoke( //
                "SendPrivateMessage",
                selectedPrivateChatUserId,
                messageToSend
            );

            const newMessage: ChatMessageType = { //
                userId: session.user.id, //
                user: session.user.name || session.user.email || "Eu", //
                message: messageToSend, //
                createdAt: new Date().toISOString(), //
                senderUserId: session.user.id, //
            };
            setPrivateChatMessages((prev) => ({ //
                ...prev,
                [selectedPrivateChatUserId]: [ //
                    ...(prev[selectedPrivateChatUserId] || []),
                    newMessage,
                ],
            }));
        } catch (err) {
            console.error( //
                "Erro ao enviar mensagem privada via SignalR: ",
                err
            );
            toast.error("Erro ao enviar mensagem privada."); //
            setPrivateMessageInput(messageToSend); // Restaura a mensagem no input em caso de erro //
        } finally {
            setIsSendingPrivateMessage(false); //
        }
    };

    const selectedPrivateChatUserData = users.find( //
        (u) => u.id === selectedPrivateChatUserId
    );
    const currentPrivateMessages = selectedPrivateChatUserId //
        ? privateChatMessages[selectedPrivateChatUserId] || []
        : [];

    const filteredUsers = users.filter((user) => //
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) //
    );

    // Este componente retorna apenas o layout para o chat privado
    // Ele será colocado dentro de uma aba no page.tsx
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"> {/* Layout de chat privado */}
            {/* Coluna da Lista de Usuários */}
            <div className="lg:col-span-1 flex flex-col h-full"> {/* */}
                <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]"> {/* */}
                    <CardHeader> {/* */}
                        <CardTitle className="flex items-center gap-2"> {/* */}
                            <User className="h-5 w-5" /> Conversar com {/* */}
                        </CardTitle>
                    </CardHeader>
                    <div className="px-6 pb-4"> {/* */}
                        <Input
                            placeholder="Pesquisar usuário..."
                            className="w-full" //
                            value={userSearchQuery} //
                            onChange={(e) => //
                                setUserSearchQuery(e.target.value)
                            }
                        />
                    </div>
                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden"> {/* */}
                        <ScrollArea className="flex-1 p-6 pt-0"> {/* */}
                            {isLoadingUsers ? ( //
                                <p className="text-center text-gray-500"> {/* */}
                                    Carregando usuários...
                                </p>
                            ) : filteredUsers.length > 0 ? ( //
                                filteredUsers.map((user) => ( //
                                    <div
                                        key={user.id} //
                                        className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${ //
                                            selectedPrivateChatUserId === //
                                            user.id
                                                ? "bg-blue-100 dark:bg-blue-800" //
                                                : ""
                                        }`}
                                        onClick={() => //
                                            handleOpenPrivateChat(user.id)
                                        }
                                    >
                                        <Avatar className="h-10 w-10 mr-3"> {/* */}
                                            <AvatarImage //
                                                src={user.avatarUrl}
                                                alt={user.name}
                                            />
                                            <AvatarFallback> {/* */}
                                                {user.name //
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium"> {/* */}
                                            {user.name}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500"> {/* */}
                                    Nenhum usuário encontrado.
                                </p>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Coluna da Janela de Chat Privado */}
            <div className="lg:col-span-2 flex flex-col h-full"> {/* */}
                {selectedPrivateChatUserId && selectedPrivateChatUserData ? ( //
                    <Card className="h-full flex flex-col rounded-[20px] md:rounded-[40px]"> {/* */}
                        <CardHeader className="flex flex-row items-center justify-between border-b"> {/* */}
                            <div className="flex items-center gap-3"> {/* */}
                                <Avatar className="h-10 w-10"> {/* */}
                                    <AvatarImage //
                                        src={
                                            selectedPrivateChatUserData.avatarUrl
                                        }
                                        alt={
                                            selectedPrivateChatUserData.name
                                        }
                                    />
                                    <AvatarFallback> {/* */}
                                        {selectedPrivateChatUserData.name //
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle> {/* */}
                                    {selectedPrivateChatUserData.name}
                                </CardTitle>
                            </div>
                            <Button //
                                variant="ghost"
                                size="icon"
                                onClick={() => //
                                    setSelectedPrivateChatUserId(null)
                                }
                            >
                                <X className="h-5 w-5" /> {/* */}
                            </Button>
                        </CardHeader>
                        <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-50 dark:bg-gray-800"> {/* */}
                            {currentPrivateMessages.map((msg, index) => ( //
                                <div
                                    key={index} //
                                    className={`flex ${ //
                                        msg.userId === session?.user?.id
                                            ? "justify-end" //
                                            : "justify-start" //
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg ${ //
                                            msg.userId === session?.user?.id
                                                ? "bg-blue-500 text-white" //
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100" //
                                        }`}
                                    >
                                        <p className="text-sm font-semibold mb-1"> {/* */}
                                            {msg.userId === session?.user?.id
                                                ? "Eu" //
                                                : msg.user} {/* */}
                                        </p>
                                        <p>{msg.message}</p> {/* */}
                                        <p className="text-xs opacity-70 mt-1"> {/* */}
                                            {msg.createdAt //
                                                ? new Date( //
                                                      msg.createdAt
                                                  ).toLocaleTimeString()
                                                : "Agora"} {/* */}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                        <CardContent className="p-4 border-t"> {/* */}
                            <div className="flex items-center gap-2"> {/* */}
                                <Input
                                    placeholder="Digite sua mensagem..." //
                                    value={privateMessageInput} //
                                    onChange={(e) => //
                                        setPrivateMessageInput(e.target.value)
                                    }
                                    onKeyPress={(e) => //
                                        e.key === "Enter" && //
                                        !isSendingPrivateMessage && //
                                        handleSendPrivateMessage() //
                                    }
                                    className="flex-1" //
                                    disabled={isSendingPrivateMessage} //
                                />
                                <Button //
                                    onClick={handleSendPrivateMessage}
                                    disabled={ //
                                        isSendingPrivateMessage || //
                                        !privateMessageInput.trim() //
                                    }
                                >
                                    <Send className="h-5 w-5" /> {/* */}
                                    <span className="ml-2 sr-only"> {/* */}
                                        Enviar
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <EmptyWindow //
                        message="Selecione um usuário para iniciar uma conversa."
                        icon={<User className="h-16 w-16 text-gray-400" />} //
                    />
                )}
            </div>
        </div>
    );
};

export default PrivateUserChat;