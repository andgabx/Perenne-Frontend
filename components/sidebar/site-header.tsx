"use client";

import { Bell, MessageCircle, Settings, Sheet, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    HubConnectionBuilder,
    LogLevel,
    HubConnection,
} from "@microsoft/signalr";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switch";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SiteHeader() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [connectionStatus, setConnectionStatus] = useState<
        "connecting" | "connected" | "disconnected"
    >("connecting");
    const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const newConnection = new HubConnectionBuilder()
    //         .withUrl("http://181.221.114.217:5000/chatHub")
    //         .configureLogging(LogLevel.Information)
    //         .build();

    //     setConnection(newConnection);
    //     setConnectionStatus("connecting");

    //     newConnection
    //         .start()
    //         .then(() => {
    //             console.log("Conectado ao hub.");
    //             setConnectionStatus("connected");
    //             setError(null);
    //         })
    //         .catch((err: Error) => {
    //             console.error("Erro ao conectar: " + err.toString());
    //             setConnectionStatus("disconnected");
    //             setError(
    //                 "Não foi possível conectar ao servidor de chat. Por favor, tente novamente mais tarde."
    //             );
    //         });

    //     newConnection.on("ReceiveMessage", (message: string) => {
    //         setMessages((prev) => [...prev, message]);
    //     });

    //     newConnection.onclose(() => {
    //         setConnectionStatus("disconnected");
    //         setError("Conexão perdida. Tentando reconectar...");
    //     });

    //     return () => {
    //         newConnection.stop();
    //     };
    // }, []);

    const sendMessage = async () => {
        if (messageInput && connection) {
            try {
                await connection.invoke("SendMessage", messageInput);
                setMessageInput("");
            } catch (err: unknown) {
                console.error(
                    "Erro ao enviar mensagem: " + (err as Error).toString()
                );
                setError(
                    "Erro ao enviar mensagem. Por favor, tente novamente."
                );
            }
        }
    };

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case "connected":
                return "bg-green-500";
            case "connecting":
                return "bg-yellow-500";
            case "disconnected":
                return "bg-red-500";
        }
    };

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b h-[var(--header-height)]">
            <div className="flex w-full items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <div className="border border-black px-4 py-1">
                        <span className="font-bold">LOGO</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-[70vh] w-[40vw] fixed right-0 left-auto ml-auto">
                            <DrawerHeader>
                                <div className="flex items-center justify-between">
                                    <DrawerTitle>Chat</DrawerTitle>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {connectionStatus === "connected"
                                                ? "Conectado"
                                                : connectionStatus ===
                                                  "connecting"
                                                ? "Conectando..."
                                                : "Desconectado"}
                                        </span>
                                        <div
                                            className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}
                                        />
                                    </div>
                                </div>
                            </DrawerHeader>
                            <div className="flex flex-col h-full">
                                {error && (
                                    <Alert
                                        variant="destructive"
                                        className="m-4"
                                    >
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                <div className="flex-1 overflow-y-auto p-4">
                                    <ul className="space-y-2">
                                        {messages.map((message, index) => (
                                            <li
                                                key={index}
                                                className="bg-muted p-2 rounded-lg"
                                            >
                                                {message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border-t p-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) =>
                                                setMessageInput(e.target.value)
                                            }
                                            placeholder="Digite sua mensagem..."
                                            className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            disabled={
                                                connectionStatus !== "connected"
                                            }
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            size="icon"
                                            className="rounded-full"
                                            disabled={
                                                connectionStatus !== "connected"
                                            }
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <Link href="/settings">
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

