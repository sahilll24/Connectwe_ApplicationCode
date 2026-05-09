import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { EventCard } from "@/components/EventCard";
import { StatsCard } from "@/components/StatsCard";
import { userAPI } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Calendar, MapPin, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userAPI.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="user" />
        <div className="flex">
          <DashboardSidebar variant="user" />
          <main className="flex-1 p-6 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { upcomingEvents: 0, eventsAttended: 0, communities: 0, connections: 0 };
  const recommendedEvents = dashboardData?.recommendedEvents || [];
  const nearbyEvents = dashboardData?.nearbyEvents || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="user" />
      <div className="flex">
        <DashboardSidebar variant="user" />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="mt-1 text-muted-foreground">Here's what's happening in your community.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Upcoming Events" value={stats.upcomingEvents} icon={Calendar} />
            <StatsCard title="Events Attended" value={stats.eventsAttended} icon={Star} />
            <StatsCard title="Communities" value={stats.communities} icon={MapPin} />
            <StatsCard title="Connections" value={stats.connections} icon={TrendingUp} trend="12% this month" trendUp />
          </div>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4">Recommended for You</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedEvents.length > 0 ? (
                recommendedEvents.map((e: any) => (
                  <EventCard key={e._id} event={e} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-3">No recommended events available.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-4">Nearby Events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyEvents.length > 0 ? (
                nearbyEvents.map((e: any) => (
                  <EventCard key={e._id} event={e} />
                ))
              ) : (
                <p className="text-muted-foreground col-span-3">No nearby events available.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
