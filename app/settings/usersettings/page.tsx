"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserInfo } from "@/pages/api/user/get-user-info";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/sidebar/site-header";
import UserHeader from "./_components/user-header";
import UserInfoCard from "./_components/user-info-card";

const UserSettings = () => {
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
            <UserHeader />
            <UserInfoCard />
        </div>
    );
};

export default UserSettings;
