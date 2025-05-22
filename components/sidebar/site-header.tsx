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
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export function SiteHeader() {
    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b h-[var(--header-height)]">
            <div className="flex w-full items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <Image src="/logo.png" width={90} height={80} alt="Logo" />
                </Link>

                <div className="flex items-center gap-2">
                    <ThemeSwitcher />

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
