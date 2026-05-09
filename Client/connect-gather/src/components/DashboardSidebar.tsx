import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, PlusCircle, BarChart3,
  UserCheck, ShieldCheck, FileText, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const userItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Events", icon: Calendar, path: "/events" },
  { label: "My Events", icon: Calendar, path: "/my-events" },
  { label: "Profile", icon: Users, path: "/profile" },
];

const organizerItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/organizer" },
  { label: "Create Event", icon: PlusCircle, path: "/organizer/create" },
  { label: "My Events", icon: Calendar, path: "/organizer/events" },
  { label: "Participants", icon: Users, path: "/organizer/participants" },
  { label: "Analytics", icon: BarChart3, path: "/organizer" },
];

const adminItems: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Event Approvals", icon: ShieldCheck, path: "/admin/approvals" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Organizers", icon: UserCheck, path: "/admin/organizers" },
  { label: "Reports", icon: FileText, path: "/admin/reports" }
  // { label: "Settings", icon: Settings, path: "/admin/settings" },
];

interface DashboardSidebarProps {
  variant: "user" | "organizer" | "admin";
}

export function DashboardSidebar({ variant }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items = variant === "admin" ? adminItems : variant === "organizer" ? organizerItems : userItems;

  return (
    <aside className={cn(
      "hidden lg:flex flex-col border-r border-border bg-sidebar h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex-1 py-4 px-2 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-foreground/50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
