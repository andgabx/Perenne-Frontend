import { SiteHeader } from "@/components/sidebar/site-header";
import { User } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="min-h-screen">
            <SiteHeader />
            <div className="container mx-auto p-6 max-w-[50vw]">
                <div className="bg-background rounded-lg border p-4 mb-6 flex items-center gap-3">
                    <User className="h-8 w-8" />
                    <span className="text-lg">Usuário</span>
                </div>

                {/* Menu de Configurações */}
                <div className="grid grid-cols-[250px,1fr] gap-6">
                    {/* Menu lateral */}
                    <nav className="flex flex-col">
                        <Link
                            href="/settings/privacidade"
                            className="block p-3 bg-muted rounded-lg"
                        >
                            Privacidade da conta
                        </Link>
                        <Link
                            href="/settings/notificacoes"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Notificações
                        </Link>
                        <Link
                            href="/settings/aparencia"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Aparência
                        </Link>
                        <Link
                            href="/settings/acessibilidade"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Acessibilidade
                        </Link>
                        <Link
                            href="/settings/mensagens"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Mensagens e visibilidade
                        </Link>
                        <Link
                            href="/settings/idiomas"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Idiomas
                        </Link>
                        <Link
                            href="/settings/termos"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Termos de Serviço
                        </Link>
                        <Link
                            href="/settings/desconectar"
                            className="block p-3 hover:bg-muted/50 rounded-lg"
                        >
                            Desconectar
                        </Link>
                        <Link
                            href="/settings/apagar"
                            className="block p-3 hover:bg-muted/50 rounded-lg text-destructive"
                        >
                            Apagar conta
                        </Link>
                    </nav>

                    {/* Conteúdo principal */}
                    <div className="bg-background rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Privacidade da conta
                        </h2>
                        <div className="prose max-w-none">
                            {/* Aqui vai o conteúdo específico de cada seção */}
                            <p>
                                Configure as opções de privacidade da sua conta.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
