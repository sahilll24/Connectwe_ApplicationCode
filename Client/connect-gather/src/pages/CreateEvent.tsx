import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { eventsAPI } from "@/lib/api";
import { toast } from "sonner";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    maxAttendees: "",
    date: "",
    time: "",
    location: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await eventsAPI.create({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        maxAttendees: parseInt(formData.maxAttendees),
        date: formData.date,
        time: formData.time,
        location: formData.location,
        image: formData.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      });
      toast.success("Event created successfully! Pending admin approval.");
      navigate("/organizer/events");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="organizer" />
      <div className="flex">
        <DashboardSidebar variant="organizer" />
        <main className="flex-1 p-6 md:p-8 max-w-3xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Create New Event</h1>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  placeholder="Give your event a catchy title" 
                  className="mt-1.5 h-11" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your event..." 
                  className="mt-1.5 min-h-[120px]" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {['Tech', 'Music', 'Workshops', 'Sports', 'Networking', 'Art'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input 
                    id="maxAttendees" 
                    type="number" 
                    placeholder="100" 
                    className="mt-1.5 h-11" 
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="mt-1.5 h-11" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    className="mt-1.5 h-11" 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Event venue or address" 
                  className="mt-1.5 h-11" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Event Banner</Label>
                <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click or drag to upload an image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 h-11" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit for Approval"}
                </Button>
                <Button variant="outline" className="h-11" type="button" onClick={() => navigate("/organizer/events")}>
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Your event will be reviewed by an admin before publishing.</p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
