import { CardContent, Card } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const CommunitiesCarousel = () => {
    return (
        <div className="mx-auto max-w-[75vw]">
            <p className="text-2xl font-bold py-4">COMUNIDADES</p>
            <Carousel className="w-full max-h-[50vh]">
                <CarouselContent> {/* Dar map nas comunidades no backend */}
                    {Array.from({ length: 10 }).map((_, index) => (
                        <CarouselItem key={index} className="md:basis-1/5">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-3xl font-semibold">
                                        {index + 1}
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CommunitiesCarousel;
