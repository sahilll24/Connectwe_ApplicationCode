import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StatsCard } from "@/components/StatsCard";
import { adminAPI } from "@/lib/api";
import { Calendar, Users, UserCheck, ShieldCheck, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const COLORS = [
  "hsl(252, 85%, 60%)",
  "hsl(217, 91%, 60%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 80%, 55%)",
];

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminAPI.getDashboard();
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
        <Navbar variant="admin" />
        <div className="flex">
          <DashboardSidebar variant="admin" />
          <main className="flex-1 p-6 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { totalUsers: 0, totalOrganizers: 0, totalEvents: 0, pendingApprovals: 0 };
  const monthlyGrowth = dashboardData?.monthlyGrowth || { users: [], events: [] };
  const eventsByCategory = dashboardData?.eventsByCategory || [];

  // Format data for charts
  const barData = monthlyGrowth.users.map((u: any, index: number) => ({
    month: u._id?.slice(-2) || ['Jan', 'Feb', 'Mar', 'Apr'][index],
    users: u.count,
    events: monthlyGrowth.events[index]?.count || 0,
  }));

  const pieData = eventsByCategory.map((cat: any) => ({
    name: cat.name,
    value: cat.value,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="admin" />
      <div className="flex">
        <DashboardSidebar variant="admin" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} trend="12% this month" trendUp />
            <StatsCard title="Organizers" value={stats.totalOrganizers} icon={UserCheck} trend="8 new" trendUp />
            <StatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} />
            <StatsCard title="Pending Approvals" value={stats.pendingApprovals} icon={ShieldCheck} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold mb-4">Growth Overview</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData.length > 0 ? barData : [{ month: 'Jan', users: 0, events: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="events" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-lg font-semibold mb-4">Events by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie 
                    data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }]} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={90} 
                    dataKey="value" 
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                    labelLine={false} 
                    fontSize={11}
                  >
                    {pieData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
