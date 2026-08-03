"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "@/store/auth-store";
import { createRental } from "@/app/dashboard/customer/_action/rental.action";
import { toast } from "sonner";

export function RentNowDialog({ gearId }: { gearId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, isAuthenticated } = useAuthStore();

  const handleConfirm = async () => {
    if (!isAuthenticated || !accessToken) {
      toast.error("Please login to rent gear");
      router.push("/login");
      return;
    }

    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoading(true);
    try {
      await createRental(
        {
          gearItemId: gearId,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        },
        accessToken,
      );

      toast.success("Rental request placed successfully!");
      setOpen(false);
      router.push("/dashboard/customer/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create rental",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg">Rent Now</Button>} />
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Select Rental Dates</DialogTitle>
        </DialogHeader>

        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          disabled={{ before: new Date() }}
          numberOfMonths={1}
          className="mx-auto"
        />

        <p className="text-center text-sm text-muted-foreground">
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "PPP")} → {format(dateRange.to, "PPP")}
              </>
            ) : (
              <>Select an end date</>
            )
          ) : (
            <>Select a start date</>
          )}
        </p>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={!dateRange?.from || !dateRange?.to || isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? "Placing Order..." : "Confirm Rental"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
