import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import EventListing from "./pages/EventListing";
import EventDetails from "./pages/EventDetails";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import OrganizerEvents from "./pages/OrganizerEvents";
import Participants from "./pages/Participants";
import AdminDashboard from "./pages/AdminDashboard";
import EventApprovals from "./pages/EventApprovals";
import UserManagement from "./pages/UserManagement";
import OrganizerManagement from "./pages/OrganizerManagement";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/create" element={<CreateEvent />} />
          <Route path="/organizer/events" element={<OrganizerEvents />} />
          <Route path="/organizer/participants" element={<Participants />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<EventApprovals />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/organizers" element={<OrganizerManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
