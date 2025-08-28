import { FileText, Save } from "lucide-react";
import { useSaveConsultation } from "~/api/appointments";
import { useViewPatientsNotes } from "~/api/patients";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { useUser } from "~/context/user-context";
import { displayErrorMessage, showSuccessToast } from "~/lib/utils";
import { useState } from "react";

interface ViewConsultationNotesModalProps {
  appointmentId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewConsultationNotesModal({
  appointmentId,
  isOpen,
  onOpenChange,
}: ViewConsultationNotesModalProps) {
  const { user } = useUser();
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, error } = useViewPatientsNotes(appointmentId);
  const saveMutation = useSaveConsultation();

  const isEditable = user?.role === "doctor";

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        appointment_id: appointmentId,
        notes,
        prescriptions,
        recommendations,
      });
      setIsEditing(false);
      showSuccessToast("Notes saved successfully!");
    } catch (error) {
      displayErrorMessage(error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Consultation Notes
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Failed to load consultation notes
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              {isEditing ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter consultation notes..."
                  rows={4}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap">
                  {notes || "No notes available"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prescriptions
              </label>
              {isEditing ? (
                <Textarea
                  value={prescriptions}
                  onChange={(e) => setPrescriptions(e.target.value)}
                  placeholder="Enter prescriptions..."
                  rows={3}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md min-h-[80px] whitespace-pre-wrap">
                  {prescriptions || "No prescriptions"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Recommendations
              </label>
              {isEditing ? (
                <Textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Enter recommendations..."
                  rows={3}
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md min-h-[80px] whitespace-pre-wrap">
                  {recommendations || "No recommendations"}
                </div>
              )}
            </div>

            {isEditable && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={saveMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Notes</Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
