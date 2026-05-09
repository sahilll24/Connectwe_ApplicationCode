import { CalendarDays, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: any;
  showStatus?: boolean;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors: Record<string, string> = {
  approved: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  rejected: "bg-destructive text-destructive-foreground",
};

export function EventCard({ event, showStatus, showActions, onEdit, onDelete }: EventCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground font-medium text-xs">
            {event.category}
          </Badge>
        </div>
        {showStatus && (
          <div className="absolute top-3 right-3">
            <Badge className={`${statusColors[event.status]} text-xs font-medium capitalize`}>
              {event.status}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <Link to={`/events/${event._id || event.id}`}>
          <h3 className="font-heading font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h3>
        </Link>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{typeof event.date === 'string' ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : event.date} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{event.attendees}/{event.maxAttendees} attending</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={event.organizer?.avatar || event.organizerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
              alt={event.organizer?.name || event.organizer} 
              className="w-6 h-6 rounded-full object-cover" 
            />
            <span className="text-xs text-muted-foreground">{event.organizer?.name || event.organizer}</span>
          </div>
          {showActions ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
            </div>
          ) : (
            <Link to={`/events/${event._id || event.id}`}>
              <Button size="sm">Register</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
