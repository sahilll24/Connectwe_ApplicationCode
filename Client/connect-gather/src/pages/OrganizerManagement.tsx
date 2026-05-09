import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

export default function OrganizerManagement() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getOrganizers();
      setOrganizers(response.data.organizers);
    } catch (error) {
      toast.error("Failed to load organizers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (organizerId: string) => {
    try {
      await adminAPI.suspendUser(organizerId);
      toast.success("Organizer suspended successfully");
      fetchOrganizers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to suspend organizer");
    }
  };

  const handleActivate = async (organizerId: string) => {
    try {
      await adminAPI.activateUser(organizerId);
      toast.success("Organizer activated successfully");
      fetchOrganizers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to activate organizer");
    }
  };

  const handleDelete = async (organizerId: string) => {
    if (!confirm("Are you sure you want to delete this organizer? All their events will also be deleted.")) return;
    
    try {
      await adminAPI.deleteUser(organizerId);
      toast.success("Organizer deleted successfully");
      fetchOrganizers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete organizer");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="admin" />
      <div className="flex">
        <DashboardSidebar variant="admin" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Organizer Management</h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No organizers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    organizers.map((org) => (
                      <TableRow key={org._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={org.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                              alt="" 
                              className="h-8 w-8 rounded-full object-cover" 
                            />
                            <span className="font-medium">{org.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{org.email}</TableCell>
                        <TableCell>{org.eventCount || 0}</TableCell>
                        <TableCell>
                          <Badge className={org.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                            {org.status === "active" ? "Verified" : org.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {org.status === "active" ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-warning"
                                onClick={() => handleSuspend(org._id)}
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-success"
                                onClick={() => handleActivate(org._id)}
                              >
                                Activate
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(org._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
