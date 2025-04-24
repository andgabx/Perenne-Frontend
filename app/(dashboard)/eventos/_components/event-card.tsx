import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Share, TreePine } from "lucide-react";
import Image from "next/image";

interface EventCardProps {
    title: string;
    date: string;
    timeRange: string;
    type: string;
    imageUrl?: string;
}

export function EventCard({
    title,
    date,
    timeRange,
    type,
    imageUrl,
}: EventCardProps) {
    return (
        <Card className="w-full">
            {/* Área da imagem */}
            <CardHeader className="p-0">
                <div className="relative w-full h-[200px] bg-muted flex items-center justify-center">
                    
                </div>
            </CardHeader>

            {/* Conteúdo do evento */}
            <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">
                    {date} | {timeRange}
                </div>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <TreePine className="h-4 w-4" />
                    <span>{type}</span>
                </div>
            </CardContent>

            {/* Botões de ação */}
            <CardFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" className="flex-1">
                    Me interessa
                </Button>
                <Button variant="outline" className="flex-1">
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                </Button>
            </CardFooter>
        </Card>
    );
}
