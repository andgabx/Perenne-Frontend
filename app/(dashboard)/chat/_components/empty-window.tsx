import { Card } from "@/components/ui/card"; //
import { Users } from "lucide-react"; //
import React from "react"; //

interface EmptyWindowProps {
    message?: string; //
    icon?: React.ReactNode; //
}

const EmptyWindow: React.FC<EmptyWindowProps> = ({ message, icon }) => { //
    return (
        <Card className="h-full flex items-center justify-center bg-[#F5F9F5] rounded-[40px] p-2 md:p-8 w-full mx-auto"> {/* */}
            <div className="text-center flex flex-col items-center justify-center"> {/* */}
                {icon ? ( //
                    icon
                ) : (
                    <Users className="h-16 w-16 text-gray-400 mb-2" /> //
                )}
                <h3 className="text-5xl font-extrabold text-[#3C6C0C] mb-2"> {/* */}
                    {message ? message : "Selecione uma mensagem"} {/* */}
                </h3>
                <p className="text-gray-600"> {/* */}
                    Ao selecionar, o bate-papo aparecerá aqui.
                </p>
            </div>
        </Card>
    );
};

export default EmptyWindow; //