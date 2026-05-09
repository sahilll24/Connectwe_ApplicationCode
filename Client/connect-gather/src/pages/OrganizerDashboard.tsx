import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { EventCard } from "@/components/EventCard";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { organizerAPI } from "@/lib/api";
import { Calendar, Users, TrendingUp, PlusCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function OrganizerDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await organizerAPI.getDashboard();
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
        <Navbar variant="organizer" />
        <div className="flex">
          <DashboardSidebar variant="organizer" />
          <main className="flex-1 p-6 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { totalEvents: 0, eventsThisMonth: 0, totalRegistrations: 0, registrationsThisMonth: 0, avgAttendance: 0 };
  const monthlyRegistrations = dashboardData?.monthlyRegistrations || [];
  const recentEvents = dashboardData?.recentEvents || [];

  const chartData = monthlyRegistrations.map((item: any) => ({
    month: item._id,
    registrations: item.registrations,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="organizer" />
      <div className="flex">
        <DashboardSidebar variant="organizer" />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">Organizer Dashboard</h1>
              <p className="mt-1 text-muted-foreground">Manage your events and track performance.</p>
            </div>
            <Link to="/organizer/create">
              <Button><PlusCircle className="h-4 w-4 mr-2" /> Create Event</Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} trend={`${stats.eventsThisMonth} this month`} trendUp />
            <StatsCard title="Total Registrations" value={stats.totalRegistrations} icon={Users} trend="18% vs last month" trendUp />
            {/* <StatsCard title="Avg. Attendance" value={`${stats.avgAttendance}%`} icon={TrendingUp} /> */}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-8">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Registration Trends
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.length > 0 ? chartData : [{ month: 'Jan', registrations: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className="font-heading text-xl font-semibold mb-4">Recent Events</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.length > 0 ? (
              recentEvents.map((e: any) => (
                <EventCard key={e._id} event={e} showStatus showActions onEdit={() => {}} onDelete={() => {}} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-3">No events created yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
