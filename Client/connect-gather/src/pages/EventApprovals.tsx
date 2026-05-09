import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { eventsAPI } from "@/lib/api";
import { CalendarDays, MapPin, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function EventApprovals() {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventsAPI.getPending();
      setPendingEvents(response.data.events);
    } catch (error) {
      toast.error("Failed to load pending events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      await eventsAPI.approve(eventId);
      toast.success("Event approved successfully");
      // Refresh the list
      fetchPendingEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve event");
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      await eventsAPI.reject(eventId);
      toast.success("Event rejected");
      // Refresh the list
      fetchPendingEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject event");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="admin" />
      <div className="flex">
        <DashboardSidebar variant="admin" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Event Approvals</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No pending events to approve.</p>
                </div>
              ) : (
                pendingEvents.map((event) => (
                  <div key={event._id} className="flex flex-col sm:flex-row gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
                    <img 
                      src={event.image || '/placeholder.svg'} 
                      alt={event.title} 
                      className="w-full sm:w-48 h-32 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-heading font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                        </div>
                        <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {event.location}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <img 
                          src={event.organizer?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                          alt="" 
                          className="h-6 w-6 rounded-full object-cover" 
                        />
                        <span className="text-sm text-muted-foreground">
                          {event.organizer?.name || event.organizer}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90 text-success-foreground"
                          onClick={() => handleApprove(event._id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(event._id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
