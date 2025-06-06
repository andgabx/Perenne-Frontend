"use client";

import { SiteHeader } from "@/components/sidebar/site-header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/pages/api/user/get-user-info";
import UserMain from "./_components/user-main";
import Link from "next/link";
import DeactivateButton from "./_components/deactivate-button";
import LogoutUserButton from "./_components/logout-user-button";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [userInfo, setUserInfo] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    useEffect(() => {
        if (session) {
            getUserInfo(session?.user?.accessToken || "")
                .then((data) => {
                    setUserInfo(data);
                })
                .catch((error) => {
                    console.error(
                        "Erro ao obter informações do usuário:",
                        error
                    );
                });
        }
    }, [session]);

    return (
        <div className="min-h-screen bg-[url('/bg.png')] bg-cover bg-center">
            <SiteHeader />
            <div className="container mx-auto p-6 md:w-[50vw] space-y-10">
                <div className="hover:scale-105 transition-all duration-300">
                    <Link href="/settings/usersettings">
                        <UserMain />
                    </Link>
                </div>
                {/* <UserSettingsButton /> */}
                <Card className="py-10 space-y-6">
                    <h1 className="text-sm xs:text-md sm:text-xl md:text-2xl break-words text-center font-black text-[#3C6C0C] pb-4">
                        SOBRE A CONTA
                    </h1>
                    <LogoutUserButton />
                    <DeactivateButton />
                    <div className="text-center text-sm xs:text-md sm:text-lg md:text-xl text-red-500 mt-4">Funcionalidade desativada durante avaliação.</div>
                </Card>
            </div>
        </div>
    );
}
