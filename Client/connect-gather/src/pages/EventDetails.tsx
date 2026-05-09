import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Users, ArrowLeft, Share2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { eventsAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { toast } from "sonner";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getById(id!);
        setEvent(response.data.event);
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to register for this event");
      return;
    }

    try {
      setIsRegistering(true);
      await eventsAPI.register(id!);
      toast.success("Successfully registered for the event!");
      // Refresh event data
      const response = await eventsAPI.getById(id!);
      setEvent(response.data.event);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="user" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="user" />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Event not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="user" />
      <div className="container mx-auto px-4 py-8">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img src={event.image || '/placeholder.svg'} alt={event.title} className="w-full h-64 md:h-96 object-cover" />
            </div>
            <Badge variant="secondary" className="mb-3">{event.category}</Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">{event.description}</p>

            <h2 className="font-heading text-xl font-semibold mb-4">Attendees ({event.attendees})</h2>
            <div className="flex -space-x-2 mb-8">
              {Array(Math.min(8, event.attendees)).fill(0).map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {event.attendees > 8 && (
                <div className="h-10 w-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                  +{event.attendees - 8}
                </div>
              )}
            </div>

            <h2 className="font-heading text-xl font-semibold mb-4">Location</h2>
            <div className="rounded-xl border border-border bg-muted/30 h-48 flex items-center justify-center text-muted-foreground">
              <MapPin className="h-6 w-6 mr-2" /> {event.location}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-card space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{formatDate(event.date)}</p>
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary" />
                <p>{event.location}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-5 w-5 text-primary" />
                <p>{event.attendees}/{event.maxAttendees} attending</p>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3">Organized by</h3>
                <div className="flex items-center gap-3">
                  <img 
                    src={event.organizer?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                    alt={event.organizer?.name} 
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                  <div>
                    <p className="font-medium text-sm">{event.organizer?.name}</p>
                    <p className="text-xs text-muted-foreground">Event Organizer</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-11" 
                size="lg" 
                onClick={handleRegister}
                disabled={isRegistering || event.attendees >= event.maxAttendees}
              >
                {isRegistering ? "Registering..." : event.attendees >= event.maxAttendees ? "Event Full" : "Register Now"}
              </Button>
              <Button variant="outline" className="w-full h-11" size="lg">
                <Share2 className="h-4 w-4 mr-2" /> Share Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
