import { Separator } from "@/components/ui/separator";
import EventsCarousel from "./_components/carousel";
import { Metadata } from "next";

export const metadata: Metadata = {
    description: "A sidebar with a header and a search form.",
};

export default function Page() {
    const iframeHeight = "800px";

    return (
        <div className="w-full">
            <h1 className="text-2xl w-full font-bold text-center py-4 ">
                HOME
            </h1>
            <Separator />
            <EventsCarousel />
        </div>
    );
}
