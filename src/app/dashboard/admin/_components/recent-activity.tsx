import { UserPlus, PackageCheck } from "lucide-react";
import type { ActivityItem } from "../_action/admin.action";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No recent activity yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => {
        const Icon = item.type === "user" ? UserPlus : PackageCheck;
        return (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                item.type === "user"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400",
              )}
            >
              <Icon className="size-4" />
            </div>
            <p className="flex-1 text-sm">{item.message}</p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(item.timestamp)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
