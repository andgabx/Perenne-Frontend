"use client";

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
        <section className="h-[10vh] bg-yellow-300 translate-y-[10%] w-full rounded-[38px] ">
            <section className="h-[9vh] bg-white overflow-hidden w-full rounded-[38px] mt-8">
                <div className="flex flex-col items-center justify-center mx-auto h-full w-[40vw]">
                    <h1 className="text-green-900 text-sm xs:text-md sm:text-xl md:text-2xl font-bold break-words text-center">
                        {userInfo?.firstName} {userInfo?.lastName}
                    </h1>
                </div>
            </section>
        </section>
    );
};

export default UserMain;
