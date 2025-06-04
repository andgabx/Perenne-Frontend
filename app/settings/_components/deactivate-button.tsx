import { Button } from "@/components/ui/button";

const DeactivateButton = () => {
    return (
        <section
            id="inicio"
            className="h-[10vh] bg-[#3C6C0C] translate-y-[10%] w-full rounded-[38px] hover:scale-105 transition-all duration-300"
        >
            <section className="h-[9vh] bg-[#FCB201] overflow-hidden w-full rounded-[38px] mt-8">
                <div className="flex flex-col items-center justify-center h-full mx-auto w-[40vw]">
                    <Button variant="ghost" className="text-black font-extrabold text-sm xs:text-md sm:text-xl md:text-2xl break-words ">
                        <h1 className="text-black font-extrabold text-sm xs:text-md sm:text-xl md:text-2xl break-words">
                            DESATIVAR CONTA
                        </h1>
                    </Button>
                </div>
            </section>
        </section>
    );
}
 
export default DeactivateButton;