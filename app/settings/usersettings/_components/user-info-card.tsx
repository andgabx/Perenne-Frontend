import { getUserInfo } from "@/pages/api/user/get-user-info";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserInfoCard() {
    // Dados de exemplo (substitua pelos dados reais do usuário)
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
        <div className="bg-white rounded-[48px] p-12 w-[50vw] md:p-16 shadow-md mx-auto mt-12">
            {/* Sobre mim */}
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-green-800 text-4xl md:text-5xl font-extrabold font-heebo">
                    Sobre mim
                </h1>
                <Pencil className="text-green-800 w-7 h-7" />
            </div>
            <p className="text-gray-700 text-xl mb-10">{userInfo?.bio}</p>

            {/* Comunidades/cursos */}
            <h2 className="text-green-800 text-3xl md:text-4xl font-extrabold font-heebo mb-6 mt-8">
                Comunidades
            </h2>
            <div className="flex flex-wrap gap-6 mb-12">
                {userInfo?.groups?.length ? (
                    userInfo.groups.map((c: string) => (
                        <span
                            key={c}
                            className="bg-black text-white font-bold rounded-full px-8 py-2 text-lg shadow-sm"
                        >
                            {c}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-400">
                        Nenhuma comunidade/curso em que você participa!
                    </span>
                )}
            </div>

        </div>
    );
}
