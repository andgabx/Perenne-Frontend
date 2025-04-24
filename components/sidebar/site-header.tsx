"use client";

import { Bell, MessageCircle, Settings, Sheet, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switch";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { DrawerTrigger } from "../ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function SiteHeader() {
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
                    <Drawer >
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-[70vh] w-[40vw] fixed right-0 left-auto ml-auto">     
                            <DrawerHeader>  
                                <DrawerTitle>Chat</DrawerTitle>
                            </DrawerHeader>
                            <div className="flex flex-col gap-4 p-4 overflow-y-auto">
                                {/* Usuário 1 */}
                                <div className="flex items-start gap-2">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">Filipe</p>
                                        <div className="bg-muted rounded-lg p-3 mt-1">
                                            <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">09:30</span>
                                    </div>
                                </div>

                                {/* Usuário 2 */}
                                <div className="flex items-start gap-2 flex-row-reverse">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/gabriel.png" />
                                        <AvatarFallback>MS</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-medium">Gabriel</p>
                                        <div className="bg-primary text-primary-foreground rounded-lg p-3 mt-1">
                                            <p className="text-sm">Oi! Preciso de ajuda com meu projeto.</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">09:32</span>
                                    </div>
                                </div>

                                {/* Usuário 1 */}
                                <div className="flex items-start gap-2">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">Filipe</p>
                                        <div className="bg-muted rounded-lg p-3 mt-1">
                                            <p className="text-sm">Claro! Qual é a dificuldade que você está tendo?</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">09:33</span>
                                    </div>
                                </div>

                                {/* Campo de input */}
                                <div className="border-t pt-4">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Digite sua mensagem..." 
                                            className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <Button size="icon" className="rounded-full">
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
