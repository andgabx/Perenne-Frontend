"use client";

import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switch";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function SiteHeader() {
    const { data: session } = useSession();
    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b h-[var(--header-height)]">
            <div className="flex w-full items-center justify-between px-4">
                <Link href="/descoberta" className="flex items-center">
                    <Image src="/logo.png" width={90} height={80} alt="Logo" />
                </Link>
                {session && (
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
                )}
            </div>
        </header>
    );
}
