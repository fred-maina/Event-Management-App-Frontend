import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// New interface for event types
interface EventType {
  id: number;
  name: string;
}

interface TicketType {
  id: string;
  typeCategory: string;
  numberOfTickets: number;
  price: number;
}

interface Event {
  id: string;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  eventVenue: string;
  eventCapacity: number;
  posterUrl: string;
  ticketType: TicketType[];
  eventTypes: EventType[];
}

// Mapping for event type colors
const eventTypeColors: { [key: string]: string } = {
  "Trivia Night": "bg-blue-500 text-white",
  Sports: "bg-green-500 text-white",
  Musical: "bg-purple-500 text-white",
  Drama: "bg-red-500 text-white",
  Music: "bg-indigo-500 text-white",
};

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/events/get/all?page=${page}&size=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Assuming the backend response structure contains eventTypes inside each event
      setEvents(response.data.data.content);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Your Events</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-md" />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <img
                src={event.posterUrl}
                alt={event.eventName}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300?text=No+Image")
                }
              />
              <CardHeader>
                <CardTitle>{event.eventName}</CardTitle>
                <p className="text-sm text-gray-500">Venue: {event.eventVenue}</p>
                <p className="text-sm text-gray-500">Capacity: {event.eventCapacity}</p>
              </CardHeader>
              {/* Render event types as pill buttons */}
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {event.eventTypes && event.eventTypes.length > 0 ? (
                  event.eventTypes.map((type) => {
                    const colorClass =
                      eventTypeColors[type.name] || "bg-gray-500 text-white";
                    return (
                      <span
                        key={type.id}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
                      >
                        {type.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-300 text-gray-700">
                    No Type
                  </span>
                )}
              </div>
              <CardContent>
                <Button
                  variant="link"
                  onClick={() =>
                    setExpandedEvent(expandedEvent === event.id ? null : event.id)
                  }
                >
                  {expandedEvent === event.id ? "Hide Details" : "More Details"}
                </Button>
                {expandedEvent === event.id && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Start: {new Date(event.eventStartDate).toLocaleString()}</p>
                    <p>End: {new Date(event.eventEndDate).toLocaleString()}</p>
                    <h3 className="font-semibold mt-2">Ticket Types:</h3>
                    <ul className="list-disc pl-5">
                      {event.ticketType.map((ticket) => (
                        <li key={ticket.id}>
                          {ticket.typeCategory} - {ticket.numberOfTickets} tickets at KES{" "}
                          {ticket.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-6">
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          Previous
        </Button>
        <span className="text-gray-600">Page {page + 1}</span>
        <Button onClick={() => setPage((prev) => prev + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default EventsPage;
