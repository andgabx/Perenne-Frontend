"use client";

import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switch";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function SiteHeader() { 
    const { data: session } = useSession();
    const pathname = usePathname();
    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b h-[var(--header-height)] min-h-[80px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.5)]">
            <div className="flex w-full items-center justify-between px-[3vw]">
                <Link href="/descoberta" className="flex items-center">
                    <Image src="/logo.png" width={150} height={150} alt="Logo" />
                </Link>
                {session && (
                    <div className="flex items-center gap-6">
                        <ThemeSwitcher />

                        <Link href="/settings">
                            {pathname === "/settings" ? (
                                <Button variant="ghost" className="text-green-500 flex items-center hover:scale-105 transition-all duration-300 hover:animate-spin">
                                    <Settings className="size-[100%]" />
                                </Button>
                            ) : (
                                <Button variant="ghost" className="text-gray-400 flex items-center hover:scale-105 transition-all duration-300 hover:animate-spin">
                                    <Settings className="size-[100%]" />
                                </Button>
                            )}
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
    /*
     <Button variant="ghost">
        <Bell className="size-[100%]"/>
    </Button>
    */
}
