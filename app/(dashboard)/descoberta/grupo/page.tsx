// Original path: page.tsx (assuming it's within an app route like /groups/page.tsx)
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

// Import new components (adjust paths as needed)
import CreateGroupForm from "./create-group-form"; // Correct path
import GroupList from "./group-list";
import { GroupType } from "./group-list-item"; // Get GroupType
import ChatWindow, { ChatMessageType } from "../../chat/_components/chat-window"; 

const GroupPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State for CreateGroupForm is now internal to that component
    // const [name, setName] = useState("");
    // const [description, setDescription] = useState("");

    const [allGroups, setAllGroups] = useState<GroupType[]>([]);
    const [myGroups, setMyGroups] = useState<GroupType[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
    // const [currentMessage, setCurrentMessage] = useState(""); // Moved to ChatWindow
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    // Loading states
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [isLoadingAllGroups, setIsLoadingAllGroups] = useState(false);
    const [isLoadingMyGroups, setIsLoadingMyGroups] = useState(false);
    const [isJoiningGroup, setIsJoiningGroup] = useState<string | null>(null); // store ID of group being joined
    const [isOpeningChat, setIsOpeningChat] = useState<string | null>(null); // store ID of chat being opened
    const [isSendingMessage, setIsSendingMessage] = useState(false);


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);


    const fetchMyGroups = async () => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            setMyGroups([]);
            return;
        }
        setIsLoadingMyGroups(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/getgroups`,
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "ngrok-skip-browser-warning": "69420",
                    },
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to fetch user groups:", errorText);
                setMyGroups([]);
                toast.error("Falha ao buscar seus grupos.");
                return;
            }
            const data = await response.json();
            setMyGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching user groups:", error);
            toast.error("Erro ao buscar seus grupos.");
            setMyGroups([]);
        } finally {
            setIsLoadingMyGroups(false);
        }
    };

    useEffect(() => {
        fetchMyGroups();
    }, [session, status]); // Removed NEXT_PUBLIC_API_URL as it's unlikely to change at runtime

    const fetchAllGroups = async () => {
        if (!session?.user?.accessToken) {
            setAllGroups([]);
            return;
        }
        setIsLoadingAllGroups(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/getall`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "ngrok-skip-browser-warning": "69420",
                    },
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error (getall groups):", errorText);
                setAllGroups([]);
                toast.error("Falha ao buscar grupos disponíveis.");
                return;
            }
            const data = await response.json();
            setAllGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar todos os grupos:", error);
            toast.error("Erro ao buscar grupos disponíveis.");
            setAllGroups([]);
        } finally {
            setIsLoadingAllGroups(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && session?.user?.accessToken) {
            fetchAllGroups();
        }
    }, [session, status]);

    useEffect(() => {
        if (status !== "authenticated" || !session?.user.accessToken) {
            if (connectionRef.current) {
                connectionRef.current.stop();
                connectionRef.current = null;
            }
            return;
        }

        if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
            // If channel changed, and connection exists, try to join new channel or leave old one
            if (currentChannelId && connectionRef.current.state === signalR.HubConnectionState.Connected) {
                 // Logic to leave previous channel if any, and join new one
                // This part might need refinement based on desired behavior on channel switch
            }
           // return; // Return if already connected, unless channel changed
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
            (user: string, message: string, createdAt: string, senderUserId: string) => {
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { user, message, createdAt, senderUserId },
                ]);
            }
        );

        newConnection
            .start()
            .then(() => {
                console.log("SignalR Connected.");
                connectionRef.current = newConnection;
                if (currentChannelId && newConnection.state === signalR.HubConnectionState.Connected) {
                    newConnection
                        .invoke("JoinChannel", currentChannelId)
                        .then(() => console.log(`Joined channel ${currentChannelId} on connect.`))
                        .catch((err) => console.error(`Error joining channel ${currentChannelId}:`, err));
                }
            })
            .catch((err) => console.error("SignalR Connection Error: ", err));

        return () => {
            if (newConnection) { // Use newConnection here for cleanup
                newConnection.stop();
                console.log("SignalR Connection stopped on cleanup.");
            }
        };
    }, [status, session, currentChannelId]); // Removed API_URL, added currentChannelId

    const handleCreateGroupSubmit = async (name: string, description: string) => {
        if (!session?.user?.accessToken) {
            toast.error("Autenticação necessária.");
            return;
        }
        setIsCreatingGroup(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "ngrok-skip-browser-warning": "69420",
                    },
                    body: JSON.stringify({ name, description }),
                }
            );

            if (response.ok) {
                toast.success("Grupo criado com sucesso!");
                fetchMyGroups(); // Update user's groups
                fetchAllGroups(); // Also update all available groups if necessary
            } else {
                const errorData = await response.text();
                console.error("Erro ao criar grupo:", errorData);
                toast.error(`Erro ao criar grupo: ${errorData}`);
            }
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
            toast.error("Erro ao criar grupo.");
        } finally {
            setIsCreatingGroup(false);
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar em um grupo");
            return;
        }
        setIsJoiningGroup(groupId);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Erro ao entrar no grupo (API):", errorData);
                toast.error(`Erro ao entrar no grupo: ${errorData}`);
                return;
            }

            toast.success("Entrou no grupo com sucesso!");
            fetchMyGroups(); // Refresh "My Groups"
            // Optionally, remove the group from "All Groups" if it now appears in "My Groups"
            // or simply let fetchAllGroups refresh if its logic changes based on membership
            setAllGroups(prev => prev.filter(g => g.id !== groupId));


        } catch (error) {
            console.error("Erro ao entrar no grupo:", error);
            toast.error("Erro ao entrar no grupo.");
        } finally {
            setIsJoiningGroup(null);
        }
    };

    const handleOpenChat = async (groupId: string) => {
        if (status !== "authenticated" || !session?.user?.accessToken) {
            toast.error("Você precisa estar logado para entrar no chat");
            return;
        }
         if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
            toast.error("Conexão de chat não está ativa. Tentando reconectar...");
            // Attempt to restart connection if not connected, or rely on automatic reconnect
            // This might be complex if start() is called while another start() is in progress
             if (connectionRef.current && connectionRef.current.state !== signalR.HubConnectionState.Connecting) {
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

        setIsOpeningChat(groupId); // For potential loading indicator on the button
        try {
            if (currentChannelId && currentChannelId !== groupId && connectionRef.current?.state === signalR.HubConnectionState.Connected) {
                await connectionRef.current.invoke("LeaveChannel", currentChannelId);
                console.log(`Left previous channel: ${currentChannelId}`);
            }
            if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
                await connectionRef.current.invoke("JoinChannel", groupId);
                setCurrentChannelId(groupId);
                setChatMessages([]); // Clear messages for the new channel
                console.log(`Juntou-se ao canal SignalR: ${groupId}`);
            } else {
                 console.warn("Cannot join channel, SignalR not connected.");
                 toast.error("Não foi possível conectar ao canal do chat.");
            }
        } catch (error) {
            console.error("Erro ao entrar no canal de chat:", error);
            toast.error("Erro ao entrar no canal de chat.");
        } finally {
            setIsOpeningChat(null);
        }
    };

    const handleSendChatMessage = async (message: string, channelId: string) => {
        if (!message.trim() || !channelId || !connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
            toast.error("Não é possível enviar mensagem.");
            return;
        }
        setIsSendingMessage(true);
        try {
            await connectionRef.current.invoke("SendMessage", channelId, message);
            // Message will be added via ReceiveMessage handler, no need to manually add here
            // setCurrentMessage(""); // This state is now in ChatWindow
        } catch (err) {
            console.error("Erro ao enviar mensagem via SignalR: ", err);
            toast.error("Erro ao enviar mensagem.");
        } finally {
            setIsSendingMessage(false);
        }
    };

    const currentGroupForChat = myGroups.find((g) => g.id === currentChannelId);

    if (status === "loading") {
        return <p className="p-4 text-center">Carregando sessão...</p>;
    }
    if (!session) {
        // This should be handled by the redirect in useEffect, but as a fallback:
        return <p className="p-4 text-center">Redirecionando para o login...</p>;
    }

    return (
        <div className="p-4 space-y-8 max-w-4xl mx-auto"> {/* Increased max-width slightly */}
            <CreateGroupForm
                onSubmit={handleCreateGroupSubmit}
                isLoading={isCreatingGroup}
            />

            <div className="grid md:grid-cols-2 gap-8"> {/* Use grid for side-by-side lists on medium screens up */}
                <GroupList
                    title="Grupos Disponíveis (Entrar no Grupo)"
                    groups={allGroups.filter(ag => !myGroups.some(mg => mg.id === ag.id))} // Show only groups user is not in
                    actionButtonText="Entrar no Grupo"
                    onActionClick={handleJoinGroup}
                    emptyListMessage="Nenhum grupo novo disponível."
                    isLoading={isLoadingAllGroups && allGroups.length === 0} // Show loading only if list is empty
                />
                <GroupList
                    title="Meus Grupos (Abrir Chat)"
                    groups={myGroups}
                    actionButtonText="Entrar no Chat"
                    onActionClick={handleOpenChat}
                    emptyListMessage="Você não é membro de nenhum grupo."
                    isLoading={isLoadingMyGroups && myGroups.length === 0} // Show loading only if list is empty
                />
            </div>

            {currentChannelId && (
                <ChatWindow
                    currentGroup={currentGroupForChat}
                    currentChannelId={currentChannelId}
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                    isSendingMessage={isSendingMessage}
                />
            )}
        </div>
    );
};

export default GroupPage;


/* "use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr"; // Importa SignalR
import toast from "react-hot-toast";

interface Group {
    id: string;
    name: string;
    description: string;
}

interface ChatMessage {
    user: string; // Nome de exibição do remetente
    message: string;
    createdAt?: string; // Opcional, se quiser exibir a data/hora da mensagem
    senderUserId?: string; // Opcional, se quiser saber o ID do remetente
}

const GroupPage = () => {
    const { data: session, status } = useSession();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [allGroups, setAllGroups] = useState<Group[]>([]); // Para todos os grupos disponíveis
    const [myGroups, setMyGroups] = useState<Group[]>([]); // Para grupos dos quais o usuário é membro
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(
        null
    ); // Estado para o ID do canal de chat ativo
    const router = useRouter();

    if (!session) {
        router.push("/login");
    }

    // Ref para a conexão SignalR para que ela persista entre as renderizações
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    // Função para buscar grupos dos quais o usuário é membro
    // MOVIDA PARA FORA DO useEffect para ser acessível por outras funções
    const fetchMyGroups = async () => {
        // Só busca se o usuário estiver autenticado e tiver um token
        if (status !== "authenticated" || !session?.user?.accessToken) {
            console.log("sem token");
            setMyGroups([]); // Limpa os grupos se não estiver autenticado
            return;
        }
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/getgroups`,
                {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                        "ngrok-skip-browser-warning": "69420",
                    },
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to fetch user groups:", errorText);
                setMyGroups([]);
                return;
            }
            const data = await response.json();
            setMyGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching user groups:", error);
            setMyGroups([]);
        }
    };

    // Efeito para chamar fetchMyGroups na montagem e quando a sessão mudar
    useEffect(() => {
        fetchMyGroups();
    }, [session, status, process.env.NEXT_PUBLIC_API_URL]); // Dependências: re-executa se a sessão, status ou API_URL mudar

    // Função para buscar todos os grupos disponíveis
    const fetchAllGroups = async (accessToken: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/getall`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                        "ngrok-skip-browser-warning": "69420",
                    },
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error (getall groups):", errorText);
                setAllGroups([]);
                return;
            }
            const data = await response.json();
            setAllGroups(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar todos os grupos:", error);
            setAllGroups([]);
        }
    };

    useEffect(() => {
        if (session?.user?.accessToken) {
            fetchAllGroups(session.user.accessToken);
        }
    }, [process.env.NEXT_PUBLIC_API_URL, session, status]);

    // Efeito para gerenciar a conexão SignalR
    useEffect(() => {
        // Garante que a sessão e o token de acesso estejam disponíveis
        if (status !== "authenticated" || !session?.user.accessToken) {
            // Se não autenticado, para qualquer conexão existente
            if (connectionRef.current) {
                connectionRef.current.stop();
                connectionRef.current = null;
                console.log(
                    "SignalR connection stopped due to unauthenticated status."
                );
            }
            return;
        }

        // Se já existe uma conexão e ela está conectada, não crie outra
        if (
            connectionRef.current &&
            connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
            return;
        }

        // Constrói a conexão SignalR
        const currentGroup = myGroups.find((g) => g.id === currentChannelId);
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
                accessTokenFactory: () => session.user.accessToken!, // Garante que o token seja uma string
            })
            .withAutomaticReconnect() // Tenta reconectar automaticamente
            .build();

        // Define o handler para quando a conexão é fechada
        newConnection.onclose((error) => {
            console.log("SignalR Connection closed.", error);
            // A reconexão automática já lida com a maioria dos casos.
            // Você pode adicionar lógica extra aqui se precisar de um comportamento específico.
        });

        // Define o handler para receber mensagens do hub (método "ReceiveMessage" do ChatHub.cs)
        // O servidor envia: senderDisplayName, messageContent, chatMessage.CreatedAt, userIdGuid.ToString()
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
                    { user, message, createdAt, senderUserId },
                ]);
            }
        );

        // Inicia a conexão
        newConnection
            .start()
            .then(() => {
                console.log("SignalR Connected.");
                connectionRef.current = newConnection; // Armazena a conexão na ref
                // Se já houver um canal selecionado, tenta se juntar a ele automaticamente
                if (
                    currentChannelId &&
                    newConnection.state === signalR.HubConnectionState.Connected
                ) {
                    newConnection
                        .invoke("JoinChannel", currentChannelId)
                        .then(() =>
                            console.log(
                                `Re-joined channel ${currentChannelId} on reconnect.`
                            )
                        )
                        .catch((err) =>
                            console.error(
                                `Error re-joining channel ${currentChannelId}:`,
                                err
                            )
                        );
                }
            })
            .catch((err) => {
                console.error("SignalR Connection Error: ", err);
                // A reconexão automática tentará novamente
            });

        // Função de limpeza para quando o componente é desmontado
        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
                connectionRef.current = null;
                console.log("SignalR Connection stopped.");
            }
        };
    }, [status, session, process.env.NEXT_PUBLIC_API_URL, currentChannelId]); // Adicionado currentChannelId às dependências para tentar re-join

    // Função para lidar com a criação de um novo grupo (via REST API)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user.accessToken}`,
                        "ngrok-skip-browser-warning": "69420",
                    },
                    body: JSON.stringify({ name, description }),
                }
            );

            if (response.ok) {
                setName("");
                setDescription("");
                fetchMyGroups(); // Atualiza a lista de "Meus Grupos" também
                alert("Grupo criado com sucesso!");
            } else {
                const errorData = await response.text();
                console.error("Erro ao criar grupo:", errorData);
                alert(`Erro ao criar grupo: ${errorData}`);
            }
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
            alert("Erro ao criar grupo.");
        }
    };

    // Função para lidar com a entrada em um grupo (via REST API)
    // Usada para "Grupos Disponíveis" (onde o usuário ainda não é membro)
    const handleJoinGroup = async (groupId: string) => {
        if (
            status !== "authenticated" ||
            !session ||
            !session.user.accessToken
        ) {
            alert("Você precisa estar logado para entrar em um grupo");
            return;
        }

        try {
            // Tenta entrar no grupo via REST API (para registrar a associação do usuário ao grupo)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupId}/join`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Erro ao entrar no grupo (API):", errorData);
                toast.error(`Erro ao entrar no grupo: ${errorData}`, {
                    position: "bottom-right",
                    duration: 3000,
                });
                return;
            }

            toast.success("Entrou no grupo com sucesso!", {
                position: "bottom-right",
                duration: 3000,
            });
            // Após entrar no grupo via API, atualiza a lista de "Meus Grupos"
            fetchMyGroups();
            // Não chama handleOpenChat aqui, pois o usuário pode querer apenas entrar no grupo, não necessariamente abrir o chat imediatamente.
            // A abertura do chat será feita pelo novo botão "Entrar no Chat" na seção "Meus Grupos".
        } catch (error) {
            console.error("Erro ao entrar no grupo:", error);
            alert("Erro ao entrar no grupo.");
        }
    };

    // Função para abrir o chat de um grupo do qual o usuário JÁ É MEMBRO
    const handleOpenChat = async (groupId: string) => {
        if (
            status !== "authenticated" ||
            !session ||
            !session.user.accessToken
        ) {
            toast.error("Você precisa estar logado para entrar no chat", {
                position: "bottom-right",
                duration: 3000,
            });
            return;
        }

        if (
            !connectionRef.current ||
            connectionRef.current.state !== signalR.HubConnectionState.Connected
        ) {
            toast.error(
                "Conexão de chat não está ativa. Tente novamente mais tarde.",
                {
                    position: "bottom-right",
                    duration: 3000,
                }
            );
            console.warn(
                "Conexão SignalR não estabelecida ou não conectada. Não foi possível entrar no canal de chat."
            );
            return;
        }

        try {
            // Primeiro, tenta sair do canal anterior, se houver
            if (currentChannelId && currentChannelId !== groupId) {
                await connectionRef.current
                    .invoke("LeaveChannel", currentChannelId)
                    .then(() =>
                        console.log(
                            `Left previous channel: ${currentChannelId}`
                        )
                    )
                    .catch((err) =>
                        console.error(
                            `Error leaving channel ${currentChannelId}:`,
                            err
                        )
                    );
            }

            // Agora, tenta entrar no novo canal
            await connectionRef.current.invoke("JoinChannel", groupId);
            setCurrentChannelId(groupId); // Define o canal atual para envio de mensagens
            setChatMessages([]); // Limpa as mensagens ao entrar em um novo canal
            console.log(`Juntou-se ao canal SignalR: ${groupId}`);
        } catch (error) {
            console.error("Erro ao entrar no canal de chat:", error);
            toast.error("Erro ao entrar no canal de chat:", {
                position: "bottom-right",
                duration: 3000,
            });
        }
    };

    // Função para enviar uma mensagem via SignalR
    const sendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !currentMessage.trim() ||
            !currentChannelId ||
            !connectionRef.current ||
            connectionRef.current.state !== signalR.HubConnectionState.Connected
        ) {
            toast.error(
                "Não é possível enviar mensagem: mensagem vazia, canal não selecionado ou conexão não ativa.",
                {
                    position: "bottom-right",
                    duration: 3000,
                }
            );
            return;
        }

        try {
            // O ChatHub.cs espera (channelId, messageContent)
            // O nome do usuário é obtido no servidor via Context.UserIdentifier
            await connectionRef.current.invoke(
                "SendMessage",
                currentChannelId,
                currentMessage
            );
            setCurrentMessage(""); // Limpa o input da mensagem
            console.log("Mensagem enviada via SignalR.");
        } catch (err) {
            console.error("Erro ao enviar mensagem via SignalR: ", err);
            alert("Erro ao enviar mensagem.");
        }
    };

    const currentGroup = myGroups.find((g) => g.id === currentChannelId);

    return (
        <div className="p-4 space-y-8 max-w-2xl mx-auto"> */
            {/* Formulário para Criar Grupo */}/* 
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
            >
                <h1 className="text-2xl font-bold text-white mb-4">
                    Criar Novo Grupo
                </h1>
                <input
                    type="text"
                    placeholder="Nome do grupo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Descrição do grupo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
                >
                    Criar Grupo
                </Button>
            </form>

            <div className="flex justify-center flex-row gap-16">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Grupos Disponíveis (Entrar no Grupo)
                    </h1>
                    {allGroups.length === 0 ? (
                        <p className="text-gray-400">
                            Nenhum grupo disponível.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {allGroups.map((group) => (
                                <li
                                    key={group.id}
                                    className="border border-gray-700 p-4 rounded-lg bg-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                >
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-lg font-bold text-white">
                                            NOME: {group.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            DESCRIÇÃO: {group.description}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ID: {group.id}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleJoinGroup(group.id)
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                                    >
                                        Entrar no Grupo
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Meus Grupos (Abrir Chat)
                    </h1>
                    {myGroups.length === 0 ? (
                        <p className="text-gray-400">
                            Você não é membro de nenhum grupo.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {myGroups.map((group) => (
                                <li
                                    key={group.id}
                                    className="border border-gray-700 p-4 rounded-lg bg-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                >
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-lg font-bold text-white">
                                            NOME: {group.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            DESCRIÇÃO: {group.description}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ID: {group.id}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => handleOpenChat(group.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                                    >
                                        Entrar no Chat
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div> */

            {/* Interface de Chat */}/* 
            {currentChannelId && (
                <div className="bg-background p-6 rounded-lg shadow-lg space-y-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-black">
                            Chat do Grupo{" "}
                        </h1>
                        <div className="text-primary text-2xl font-bold">
                            {currentGroup
                                ? `${currentGroup.name}`
                                : `(ID: ${currentChannelId})`}
                        </div>
                    </div>
                    <div className="h-64 overflow-y-auto border border-gray-700 rounded-md p-3 bg-gray-300 text-gray-200">
                        {chatMessages.length === 0 ? (
                            <p className="text-gray-500">
                                Nenhuma mensagem ainda. Comece a conversar!
                            </p>
                        ) : (
                            chatMessages.map((msg, index) => (
                                <div key={index} className="mb-2"> */
                                    {/* Exibe a data/hora se disponível */}/* 
                                    {msg.createdAt && (
                                        <span className="text-gray-300 text-xs mr-2">
                                            {new Date(
                                                msg.createdAt
                                            ).toLocaleTimeString()}
                                        </span>
                                    )}
                                    <span className="font-bold text-blue-400">
                                        {msg.user}:
                                    </span>{" "}
                                    {msg.message}
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={sendChatMessage} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Digite sua mensagem..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            className="w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-4"
                        />
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 hover:scale-105 h-full text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
                        >
                            Enviar
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GroupPage;
 */