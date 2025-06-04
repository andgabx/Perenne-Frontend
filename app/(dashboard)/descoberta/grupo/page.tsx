// Original path: page.tsx (assuming it's within an app route like /groups/page.tsx)
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";
import { GroupType } from "./_components/group-list-item";

// Import new components (adjust paths as needed)

import ChatWindow from "../../chat/_components/chat-window";
import type { ChatMessageType } from "../../chat/_components/chat-window";
import CreateGroupForm from "./_components/create-group-form";
import GroupList from "./_components/group-list";
import { getHeaders } from "@/pages/api/headers";

const GroupPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [allGroups, setAllGroups] = useState<GroupType[]>([]);
    const [myGroups, setMyGroups] = useState<GroupType[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);
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
                    headers: getHeaders(session.user.accessToken),
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
                    headers: getHeaders(session.user.accessToken),
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

        if (
            connectionRef.current &&
            connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
            // If channel changed, and connection exists, try to join new channel or leave old one
            if (
                currentChannelId &&
                connectionRef.current.state ===
                    signalR.HubConnectionState.Connected
            ) {
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
                // Use newConnection here for cleanup
                newConnection.stop();
                console.log("SignalR Connection stopped on cleanup.");
            }
        };
    }, [status, session, currentChannelId]); // Removed API_URL, added currentChannelId

    const handleCreateGroupSubmit = async (
        name: string,
        description: string
    ) => {
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
                    headers: getHeaders(session.user.accessToken),
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
                    headers: getHeaders(session.user.accessToken),
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
            setAllGroups((prev) => prev.filter((g) => g.id !== groupId));
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
        if (
            !connectionRef.current ||
            connectionRef.current.state !== signalR.HubConnectionState.Connected
        ) {
            toast.error(
                "Conexão de chat não está ativa. Tentando reconectar..."
            );
            // Attempt to restart connection if not connected, or rely on automatic reconnect
            // This might be complex if start() is called while another start() is in progress
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

        setIsOpeningChat(groupId); // For potential loading indicator on the button
        try {
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

    return (
        <div className="p-4 space-y-8 max-w-4xl mx-auto">
            {" "}
            {/* Increased max-width slightly */}
            <CreateGroupForm
                onSubmit={handleCreateGroupSubmit}
                isLoading={isCreatingGroup}
            />
            <div className="grid md:grid-cols-2 gap-8">
                {" "}
                {/* Use grid for side-by-side lists on medium screens up */}
                <GroupList
                    title="Grupos Disponíveis (Entrar no Grupo)"
                    groups={allGroups.filter(
                        (ag) => !myGroups.some((mg) => mg.id === ag.id)
                    )} // Show only groups user is not in
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
