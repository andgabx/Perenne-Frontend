import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "../theme-switch"

export function Header() {
  return (
    <header className="w-full border-b px-[15vw]">
      <div className="flex h-16 items-center justify-between">
        <div className="font-bold">LOGO</div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-base font-medium hover:text-gray-600 transition-colors">
            Início
          </Link>
          <Link href="/sobre" className="text-base font-medium hover:text-gray-600 transition-colors">
            Sobre nós
          </Link>
          <Link href="/missao" className="text-base font-medium hover:text-gray-600 transition-colors">
            Missão
          </Link>
          <Link href="/contato" className="text-base font-medium hover:text-gray-600 transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden md:inline-flex">
            Nossa plataforma
          </Button>

          <ThemeSwitcher />
        </div>

        <Button variant="ghost" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  )
}
