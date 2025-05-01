import { Card, CardContent } from "@/components/ui/card";

interface TeamCardProps {
    name: string;
    description: string;
}

export function TeamCard({ name, description }: TeamCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square flex items-center justify-center border-b">
                <div className="w-16 h-16 flex flex-col items-center justify-center">
                    
                </div>
            </div>
            <CardContent className="p-0">
                <div className=" p-4">
                    <h3 className="font-medium text-center">{name}</h3>
                    <p className="text-sm text-gray-400 text-center">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
