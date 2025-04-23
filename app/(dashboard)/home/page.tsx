import { Separator } from "@/components/ui/separator";
import EventsCarousel from "./_components/carousel";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export default function Page() {
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
