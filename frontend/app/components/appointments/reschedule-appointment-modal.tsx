import React, { useState } from "react";
import { useRescheduleAppointment } from "~/api/appointments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface RescheduleAppointmentModalProps {
  appointmentId: string | number;
  trigger: React.ReactNode;
}

export function RescheduleAppointmentModal({
  appointmentId,
  trigger,
}: RescheduleAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [newDateTime, setNewDateTime] = useState("");

  const rescheduleMutation = useRescheduleAppointment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateTime) return;

    rescheduleMutation.mutate(
      {
        appointmentId,
        payload: { new_date: newDateTime },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setNewDateTime("");
        },
      }
    );
  };

  const currentDateTime = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time for the appointment. Only future dates are allowed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="datetime" className="text-right">
                Date & Time
              </Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                min={currentDateTime}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rescheduleMutation.isPending || !newDateTime}
            >
              {rescheduleMutation.isPending ? "Rescheduling..." : "Reschedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
