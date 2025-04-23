"use client";

import { SidebarIcon } from "lucide-react";

import { SearchForm } from "@/components/sidebar/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme-switch";

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b h-[var(--header-height)]">
            <div className="flex w-full items-center gap-2 px-4">
                <Button
                    className="h-8 w-8 md:hidden"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon />
                </Button>
                <ThemeSwitcher />
                <SearchForm className="w-full sm:ml-auto sm:w-auto" />
            </div>
        </header>
    );
}
