import { EventCard } from "./_components/event-card";

export default function Eventos() {
    const events = [
        {
            title: "Evento 1",
            date: "2024-01-01",
            timeRange: "10:00 - 12:00",
            type: "Evento",
        },
        {
            title: "Evento 2",
            date: "2024-01-02",
            timeRange: "10:00 - 12:00",
            type: "Evento",
        },
        {
            title: "Evento 3",
            date: "2024-01-03",
            timeRange: "10:00 - 12:00",
            type: "Evento",
        },
        {
            title: "Evento 4",
            date: "2024-01-04",
            timeRange: "10:00 - 12:00",
            type: "Evento",
        },
    ];
    return (
        <div className="flex flex-col gap-4 p-8">
            <p className="text-2xl font-bold">Comunidade 1</p>
            <div className="flex grid-cols-4 gap-4">
            {events.map((event) => (
                <EventCard
                    title={event.title}
                    date={event.date}
                    timeRange={event.timeRange}
                    type={event.type}
                    />
                ))}
            </div>

            <p className="text-2xl font-bold">Comunidade 2</p>
            <div className="flex grid-cols-4 gap-4">
            {events.map((event) => (
                <EventCard
                    title={event.title}
                    date={event.date}
                    timeRange={event.timeRange}
                    type={event.type}
                    />
                ))}
            </div>
        </div>
    );
}
