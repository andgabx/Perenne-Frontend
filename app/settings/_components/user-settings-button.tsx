import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserSettingsButton = () => {
    return (
        <Button
            variant="ghost"
            className="hover:scale-105 transition-all duration-300 w-full"
        >
            <Link href="/settings/usersettings" className="w-full">
                <section
                    id="inicio"
                    className="h-[10vh] bg-[#3C6C0C] translate-y-[10%] w-full rounded-[38px]"
                >
                    <section className="h-[9vh] bg-white overflow-hidden w-full rounded-[38px] mt-8">
                        <div className="flex flex-col items-center justify-center h-full w-full max-w-[40vw] mx-auto">
                            <h1 className="text-black text-sm xs:text-md sm:text-xl md:text-2xl font-bold break-words">
                                Configurações do usuário
                            </h1>
                        </div>
                    </section>
                </section>
            </Link>
        </Button>
    );
};

export default UserSettingsButton;
