import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { organizerAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Participants() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setIsLoading(true);
      const response = await organizerAPI.getParticipants();
      setParticipants(response.data.participants);
    } catch (error) {
      toast.error("Failed to load participants");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="organizer" />
      <div className="flex">
        <DashboardSidebar variant="organizer" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Participants</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              {participants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No participants have registered for your events yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={p.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                              alt="" 
                              className="h-8 w-8 rounded-full object-cover" 
                            />
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{p.email}</TableCell>
                        <TableCell>{p.event}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(p.date)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={p.status === 'attended' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}
                          >
                            {p.status === 'attended' ? 'Attended' : 'Confirmed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
