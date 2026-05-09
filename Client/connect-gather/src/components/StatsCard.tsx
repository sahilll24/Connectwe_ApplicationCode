import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6 shadow-card", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-heading font-bold text-card-foreground">{value}</p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trendUp ? "text-success" : "text-destructive")}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent-foreground" />
        </div>
      </div>
    </div>
  );
}
