import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { eventsAPI } from "@/lib/api";
import { CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function MyEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await eventsAPI.getMyEvents();

        // ✅ Remove null/undefined events (MAIN FIX)
        const cleanEvents = (response.data.events || []).filter(
          (event: any) => event !== null && event !== undefined
        );

        setEvents(cleanEvents);
      } catch (error) {
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleCancel = async (eventId: string) => {
    try {
      await eventsAPI.cancelRegistration(eventId);
      toast.success("Registration cancelled");

      // Refresh list safely
      const response = await eventsAPI.getMyEvents();
      const cleanEvents = (response.data.events || []).filter(
        (event: any) => event !== null && event !== undefined
      );

      setEvents(cleanEvents);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to cancel registration"
      );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Invalid date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="user" />
      <div className="flex">
        <DashboardSidebar variant="user" />

        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            My Events
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven't registered for any events yet.
                </p>
              ) : (
                events.map((event) => {
                  // ✅ Extra safety (in case anything slips through)
                  if (!event) return null;

                  return (
                    <div
                      key={event._id}
                      className="flex flex-col sm:flex-row gap-4 rounded-xl border border-border bg-card p-4 shadow-card"
                    >
                      {/* Image */}
                      <img
                        src={event?.image || "/placeholder.svg"}
                        alt={event?.title || "Event"}
                        className="w-full sm:w-40 h-28 object-cover rounded-lg"
                      />

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-heading font-semibold text-lg">
                              {event?.title || "Untitled Event"}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(event?.date)}
                              </span>

                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {event?.location || "Unknown location"}
                              </span>
                            </div>
                          </div>

                          <Badge variant="secondary">Registered</Badge>
                        </div>

                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleCancel(event._id)}
                          >
                            Cancel Registration
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}