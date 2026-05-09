import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, User, X, LogOut, Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, getUser } from "@/lib/auth";
import { toast } from "sonner";

interface NavbarProps {
  variant?: "public" | "user" | "organizer" | "admin";
}

export function Navbar({ variant = "public" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const isActive = (path: string) => location.pathname === path;

  const dashboardPath =
    variant === "admin" ? "/admin" : variant === "organizer" ? "/organizer" : "/dashboard";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">C</span>
          </div>
          <span className="font-heading font-bold text-xl text-foreground">ConnectWe</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {variant === "public" ? (
            <>
              <Link to="/events" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("/events") ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                Events
              </Link>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(dashboardPath) ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                Dashboard
              </Link>
              <Link to="/events" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("/events") ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                Events
              </Link>
              {variant === "user" && (
                <Link to="/my-events" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("/my-events") ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  My Events
                </Link>
              )}
              {variant === "organizer" && (
                <Link to="/organizer/events" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("/organizer/events") ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  My Events
                </Link>
              )}
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">3</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img 
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover" 
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-events" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> My Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-2 animate-fade-in">
          {variant === "public" ? (
            <>
              <Link to="/events" className="block px-4 py-2 text-sm rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>Events</Link>
              <Link to="/login" className="block px-4 py-2 text-sm rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="block" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} className="block px-4 py-2 text-sm rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/events" className="block px-4 py-2 text-sm rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>Events</Link>
              <Link to="/my-events" className="block px-4 py-2 text-sm rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>My Events</Link>
              <Link to="/profile" className="block px-4 py-2 text-sm rounded-lg hover:bg-muted" onClick={() => setMobileOpen(false)}>Profile</Link>
              <button className="block w-full text-left px-4 py-2 text-sm rounded-lg text-destructive hover:bg-muted" onClick={() => { setMobileOpen(false); handleLogout(); }}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
