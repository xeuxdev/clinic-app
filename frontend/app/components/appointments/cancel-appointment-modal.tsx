import React, { useState } from "react";
import { useCancelAppointment } from "~/api/appointments";
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
import { AlertTriangle } from "lucide-react";

interface CancelAppointmentModalProps {
  appointmentId: string | number;
  trigger: React.ReactNode;
}

export function CancelAppointmentModal({
  appointmentId,
  trigger,
}: CancelAppointmentModalProps) {
  const [open, setOpen] = useState(false);

  const cancelMutation = useCancelAppointment();

  const handleCancel = () => {
    cancelMutation.mutate(appointmentId, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Cancel Appointment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Warning:</p>
              <p>
                Cancelling this appointment will permanently remove it from the
                schedule.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Keep Appointment
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
