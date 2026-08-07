import {
  Check,
  ClipboardList,
  CreditCard,
  PackageCheck,
  RotateCcw,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RentalOrder } from "../_action/rental.action";

const steps: { key: RentalOrder["status"]; label: string; icon: LucideIcon }[] =
  [
    { key: "PLACED", label: "Placed", icon: ClipboardList },
    { key: "CONFIRMED", label: "Confirmed", icon: Check },
    { key: "PAID", label: "Paid", icon: CreditCard },
    { key: "PICKED_UP", label: "Picked Up", icon: PackageCheck },
    { key: "RETURNED", label: "Returned", icon: RotateCcw },
  ];

interface OrderStatusTrackerProps {
  status: RentalOrder["status"];
  variant?: "compact" | "detailed";
}

export function OrderStatusTracker({
  status,
  variant = "compact",
}: OrderStatusTrackerProps) {
  if (status === "CANCELLED") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive",
          variant === "compact" ? "px-3 py-1.5 text-xs" : "px-4 py-3 text-sm",
        )}
      >
        <X className={variant === "compact" ? "size-3.5" : "size-4"} />
        This order was cancelled
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  if (variant === "compact") {
    return (
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          return (
            <div
              key={step.key}
              className="flex flex-1 items-center last:flex-none"
            >
              <div
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  done ? "bg-primary" : "bg-border",
                )}
                title={step.label}
              />
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i < currentIndex ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;
        return (
          <div
            key={step.key}
            className="flex flex-1 flex-col items-center last:flex-none"
          >
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/15",
                )}
              >
                <Icon className="size-4" />
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i < currentIndex ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
            <p
              className={cn(
                "mt-2 text-center text-xs font-medium",
                done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
