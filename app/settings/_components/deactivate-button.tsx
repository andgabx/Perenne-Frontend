import { Button } from "@/components/ui/button";

const DeactivateButton = () => {
    return (
        <Button
            className="text-black font-extrabold text-sm xs:text-md sm:text-xl md:text-2xl break-words mx-auto w-[40vw] px-6 py-8 border-4 border-amber-400"
            variant="ghost"
        >
            <h1 className="text-black font-extrabold text-sm xs:text-md sm:text-xl md:text-2xl break-words">
                DESATIVAR CONTA
            </h1>
        </Button>
    );
};

export default DeactivateButton;
