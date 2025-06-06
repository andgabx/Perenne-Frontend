"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const ICON_SIZE = 16;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    {theme === "light" ? (
                        <Sun
                            key="light"
                            //size={ICON_SIZE}
                            className={"text-[#3C6C0C] size-[100%]"}
                        />
                    ) : theme === "dark" ? (
                        <Moon
                            key="dark"
                            //size={ICON_SIZE}
                            className={"text-[#3C6C0C] size-[100%]"}
                        />
                    ) : (
                        <Laptop
                            key="system"
                            //size={ICON_SIZE}
                            className={"text-[#3C6C0C] size-[100%]"}
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-content" align="start">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(e) => setTheme(e)}
                >
                    <DropdownMenuRadioItem
                        className="flex gap-2 data-[state=checked]:text-[#234B0C] data-[state=checked]:before:bg-[#234B0C]"
                        value="light"
                    >
                        <span>Tema Claro</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        className="flex gap-2 data-[state=checked]:text-[#234B0C] data-[state=checked]:before:bg-[#234B0C]"
                        value="dark"
                    >
                        <span>Tema Escuro</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        className="flex gap-2 data-[state=checked]:text-[#234B0C] data-[state=checked]:before:bg-[#234B0C]"
                        value="system"
                    >
                        <span>Tema Padrão</span>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ThemeSwitcher };
