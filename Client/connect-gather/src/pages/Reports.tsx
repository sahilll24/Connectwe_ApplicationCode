import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, Users, Calendar, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Reports() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyActiveUsers: 0,
    eventsThisMonth: 0,
    pageViews: 0,
    engagementRate: 0,
  });
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [popularEvents, setPopularEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getReports();
      const reports = response.data.reports;
      
      // Set stats
      setStats({
        monthlyActiveUsers: reports.monthlyActiveUsers || 0,
        eventsThisMonth: reports.eventsThisMonth || 0,
        pageViews: reports.pageViews || 0,
        engagementRate: reports.engagementRate || 0,
      });

      // Transform engagement data for charts
      const userEngagement = reports.userEngagement || [];
      const activeUsers = reports.activeUsers || [];
      
      // Merge user engagement and active users data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const mergedData = months.map((month) => {
        const engagement = userEngagement.find((e: any) => e._id === month);
        const active = activeUsers.find((a: any) => a._id === month);
        return {
          month,
          active: active?.count || 0,
          new: engagement?.new || 0,
        };
      }).filter((d: any) => d.active > 0 || d.new > 0);
      
      setEngagementData(mergedData);
      
      // Set popular events
      setPopularEvents(reports.popularEvents || []);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="admin" />
      <div className="flex">
        <DashboardSidebar variant="admin" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Reports & Analytics</h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard 
                  title="Monthly Active Users" 
                  value={formatNumber(stats.monthlyActiveUsers)} 
                  icon={Users} 
                  trend="22% vs last month" 
                  trendUp 
                />
                <StatsCard 
                  title="Events This Month" 
                  value={stats.eventsThisMonth} 
                  icon={Calendar} 
                  trend="15% increase" 
                  trendUp 
                />
                {/* <StatsCard 
                  title="Page Views" 
                  value={formatNumber(stats.pageViews)} 
                  icon={Eye} 
                  trend="8% increase" 
                  trendUp 
                />
                <StatsCard 
                  title="Engagement Rate" 
                  value={`${stats.engagementRate}%`} 
                  icon={TrendingUp} 
                  trend="5% increase" 
                  trendUp 
                /> */}
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-heading text-lg font-semibold mb-4">User Engagement</h2>
                  {engagementData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Line type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="new" stroke="hsl(var(--info))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No engagement data available
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <h2 className="font-heading text-lg font-semibold mb-4">Most Popular Events</h2>
                  {popularEvents.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={popularEvents} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                      No popular events data available
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
