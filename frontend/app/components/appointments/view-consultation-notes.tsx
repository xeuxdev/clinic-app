import { FileText, PrinterIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useViewPatientsNotes } from "~/api/patients";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUser } from "~/context/user-context";
import { generateConsultationPDF } from "~/lib/utils";
import { AttendantDetailView } from "./attendant-detail-view";
import { ConsultationNotesTab } from "./consultation-notes-tab";
import { PatientInfoTab } from "./patient-info-tab";

// Zod schema for consultation notes form
const consultationNotesSchema = z.object({
  notes: z.string().min(1, "Notes are required"),
  prescriptions: z.string().optional(),
  recommendations: z.string().optional(),
});

type ConsultationNotesFormData = z.infer<typeof consultationNotesSchema>;

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
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const {
    data: consultationData,
    isLoading,
    error,
  } = useViewPatientsNotes(appointmentId, isOpen);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setIsEditing(false);
      setActiveTab("details");
    }
  };

  const handleTabChange = (newTab: string) => {
    // Reset editing state when switching tabs
    setIsEditing(false);
    setActiveTab(newTab);
  };

  const handlePrintPDF = () => {
    if (consultationData) {
      generateConsultationPDF(consultationData);
    }
  };

  const isDoctor = user?.role === "doctor";
  const isAttendant = user?.role === "attendant";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 pt-2">
              <FileText className="w-5 h-5" />
              Consultation Details
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintPDF}
              disabled={!consultationData}
              className="flex items-center gap-2"
            >
              <PrinterIcon className="w-4 h-4" />
              Print PDF
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading consultation details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">
                Failed to load consultation details
              </p>
              <p className="text-sm">Please try again later</p>
            </div>
          </div>
        ) : consultationData ? (
          <>
            {/* Doctor View: Tabs for Details and Notes */}
            {isDoctor && (
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">
                    Patient & Appointment Details
                  </TabsTrigger>
                  <TabsTrigger value="notes">Consultation Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <PatientInfoTab consultationData={consultationData} />
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                  <ConsultationNotesTab
                    key={`notes-${appointmentId}-${
                      consultationData?.consultation?.id || "new"
                    }`}
                    consultationData={consultationData}
                    appointmentId={appointmentId}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                  />
                </TabsContent>
              </Tabs>
            )}

            {/* Attendant View: Full Details */}
            {isAttendant && (
              <div className="mt-6">
                <AttendantDetailView consultationData={consultationData} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No consultation data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
