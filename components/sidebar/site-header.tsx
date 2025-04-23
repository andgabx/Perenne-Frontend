"use client";

import { Bell, Settings, Sheet, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switch";

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
