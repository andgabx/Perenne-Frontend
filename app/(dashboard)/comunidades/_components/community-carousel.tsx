import { CardContent, Card } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

const CommunitiesCarousel = () => {
    return (
        <div className="mx-auto max-w-[75vw]">
            <div className="bg-white rounded-3xl">
                <Link href="/descoberta/grupo">
                    <p className="text-2xl font-bold py-4 hover:underline text-center">
                        COMUNIDADES
                    </p>
                </Link>
                <div className="px-[3vw]">
                    <Carousel className="w-full max-h-[50vh]">
                        <CarouselContent>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/3">
                                    <Card className="w-full h-full flex items-center justify-center">
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
            </div>
        </div>
    );
};

export default CommunitiesCarousel;