import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { eventsAPI } from "@/lib/api";
import { toast } from "sonner";

export default function EventListing() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, categoriesRes] = await Promise.all([
          eventsAPI.getAll(),
          eventsAPI.getCategories(),
        ]);
        setEvents(eventsRes.data.events);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await eventsAPI.getAll({ search: searchQuery });
      setEvents(response.data.events);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = activeCategory === "All"
    ? events
    : events.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="user" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold mb-6">Browse Events</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              className="pl-10 h-11" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" className="h-11" onClick={handleSearch}>
            <Filter className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          <Badge
            variant={activeCategory === "All" ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5"
            onClick={() => setActiveCategory("All")}
          >
            All
          </Badge>
          {categories.map((c) => (
            <Badge
              key={c.name}
              variant={activeCategory === c.name ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5"
              onClick={() => setActiveCategory(c.name)}
            >
              {c.icon} {c.name}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No events found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
