import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../theme-switch";
import Image from "next/image";

export function Header() {
    return (
        <header className="w-full px-10">
            <div className="flex h-16 items-center justify-between">
                <Image src="/logo.png" alt="logo" width={100} height={100} />

                

                <div className="flex items-center space-x-4">

                <nav className="hidden md:flex items-center space-x-14 px-8">
                    <Link
                        href="/"
                        className="text-base font-medium hover:text-gray-600 transition-colors"
                    >
                        Início
                    </Link>
                    <Link
                        href="/sobre"
                        className="text-base font-medium hover:text-gray-600 transition-colors"
                    >
                        Sobre nós
                    </Link>
                    <Link
                        href="/missao"
                        className="text-base font-medium hover:text-gray-600 transition-colors"
                    >
                        Missão
                    </Link>
                    <Link
                        href="/contato"
                        className="text-base font-medium hover:text-gray-600 transition-colors"
                    >
                        Contato
                    </Link>
                </nav>

                    <Button className="bg-[#24bd0a] px-4">
                        Nossa plataforma
                    </Button>

                    {/* <ThemeSwitcher /> */}
                </div>

            </div>
        </header>
    );
}
