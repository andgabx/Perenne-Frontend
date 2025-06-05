import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const LogoutUserButton = () => {
    return (
        
                <Button onClick={() => signOut()} className="flex flex-col items-center justify-center mx-auto w-[40vw] px-6 py-8 bg-[#FCB201] hover:text-white text-black">
                    <h1 className="font-extrabold text-sm xs:text-md sm:text-xl md:text-2xl break-words">
                        SAIR DA CONTA
                    </h1>
                </Button>
      
    );
};

export default LogoutUserButton;
