import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const LogoutUserButton = () => {
    return (
        <section
            id="inicio"
            className="h-[10vh] bg-[#3C6C0C] translate-y-[10%] w-full rounded-[38px] hover:scale-105 transition-all duration-300"
        >
            <section className="h-[9vh] bg-[#FCB201] overflow-hidden w-full rounded-[38px] mt-8">
                <Button onClick={() => signOut()} className="flex flex-col items-center justify-center h-full mx-auto w-[40vw]" variant="ghost">
                    <h1 className="text-black font-extrabold text-sm xs:text-md sm:text-xl md:text-2xl break-words">
                        SAIR DA CONTA
                    </h1>
                </Button>
            </section>
        </section>
    );
};

export default LogoutUserButton;
