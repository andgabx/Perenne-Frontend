"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserInfo } from "@/pages/api/user/get-user-info";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserMain = () => {

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
        <section className="h-[10vh] bg-green-900  w-full rounded-[38px] ">
            <section className="h-[9vh] bg-white overflow-hidden translate-y-[10%] w-full rounded-[38px] mt-8">
                <div className="flex gap-6 items-center justify-start mx-auto h-full w-[40vw]">
                    <Avatar className="w-12 h-12 bg-green-900">
                        <AvatarImage src={userInfo?.profilePicture} />
                        <AvatarFallback className="bg-green-900 text-white">
                            {userInfo?.firstName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-green-900 text-sm xs:text-md sm:text-xl md:text-2xl font-bold break-words text-center">
                        {userInfo?.firstName} {userInfo?.lastName}
                    </h1>
                    <Badge variant="outline" className="bg-green-900 text-white px-12 py-0.5 rounded-xl">
                        {userInfo?.role}
                    </Badge>
                </div>
            </section>
        </section>
    );
};

export default UserMain;
