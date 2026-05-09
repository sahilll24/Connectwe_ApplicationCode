import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { EventCard } from "@/components/EventCard";
import { eventsAPI } from "@/lib/api";
import { toast } from "sonner";

export default function OrganizerEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const response = await eventsAPI.getOrganizerEvents();
        setEvents(response.data.events);
      } catch (error) {
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await eventsAPI.delete(eventId);
      toast.success("Event deleted");
      // Refresh the list
      const response = await eventsAPI.getOrganizerEvents();
      setEvents(response.data.events);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="organizer" />
      <div className="flex">
        <DashboardSidebar variant="organizer" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">My Events</h1>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length === 0 ? (
                <p className="text-muted-foreground col-span-3">You haven't created any events yet.</p>
              ) : (
                events.map((e) => (
                  <EventCard 
                    key={e._id} 
                    event={e} 
                    showStatus 
                    showActions 
                    onEdit={() => toast.info("Edit functionality coming soon")} 
                    onDelete={() => handleDelete(e._id)} 
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
