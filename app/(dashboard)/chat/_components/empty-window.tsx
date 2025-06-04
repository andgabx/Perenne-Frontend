import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

const EmptyWindow = () => {
    return (
        <Card className="h-full flex items-center justify-center bg-[#F5F9F5] rounded-[40px] p-2 md:p-8 w-full mx-auto">
            <div className="text-center">
                <h3 className="text-5xl font-extrabold text-[#3C6C0C] mb-2">
                    Selecione uma mensagem
                </h3>
                <p className="text-gray-600">
                Ao selecionar, o bate-papo aparecerá aqui.
                </p>
            </div>
        </Card>
    );
};

export default EmptyWindow;
