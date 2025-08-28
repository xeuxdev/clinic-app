import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileText,
  Pill,
  Play,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import { z } from "zod";
import {
  useCompleteAppointment,
  useGetAppointmentById,
  useSaveConsultation,
  useStartAppointment,
} from "~/api/appointments";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  calculateAge,
  formatDate,
  formatTime,
  showErrorToast,
} from "~/lib/utils";

export function meta() {
  return [
    { title: "Patient Consultation - Clinic Management" },
    {
      name: "description",
      content: "Conduct patient consultation and manage medical records",
    },
  ];
}

const consultationSchema = z.object({
  notes: z
    .string()
    .min(1, "Clinical notes are required")
    .min(10, "Clinical notes must be at least 10 characters"),
  recommendations: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function PatientConsultation() {
  const { id } = useParams();

  const { mutateAsync: startAppointment, isPending: isStarting } =
    useStartAppointment();
  const { mutateAsync: completeAppointment, isPending: isCompleting } =
    useCompleteAppointment();
  const { mutateAsync: saveConsultation, isPending: isSaving } =
    useSaveConsultation();

  const [status, setStatus] = useState<
    "booked" | "in_progress" | "completed" | "cancelled" | "rescheduled"
  >("booked");

  const [hasLeftNotes, setHasLeftNotes] = useState(false);

  // Fetch appointment from API
  const { data: appointmentInfo, isLoading } = useGetAppointmentById(id!);

  // use react-hook-form for notes and recommendations
  const form = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      notes: "",
      recommendations: "",
    },
  });

  const watchedNotes = form.watch("notes");

  // keep prescriptions in local state for add/remove UI
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-600">Loading appointment...</div>
      </div>
    );
  }

  if (!appointmentInfo) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Appointment Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested appointment could not be found.
          </p>
          <Link to="/doctor">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const patient = {
    name: appointmentInfo.appointment.patient_name,
    age: calculateAge(appointmentInfo.appointment.patient_dob),
    phone: appointmentInfo.appointment.patient_phone,
    email: appointmentInfo.appointment.patient_email,
    dateOfBirth: appointmentInfo.appointment.patient_dob,
    medicalCondition: appointmentInfo.appointment.patient_medical_condition,
    currentMedication: appointmentInfo.appointment.patient_current_medication,
    knownAllergies: appointmentInfo.appointment.patient_known_allergies,
  };

  const handleStartConsultation = () => {
    startAppointment(appointmentInfo.appointment.id).then(() => {
      setStatus("in_progress");
    });
  };

  const handleAddPrescription = () => {
    if (currentPrescription.trim()) {
      setPrescriptions((prev) => [...prev, currentPrescription.trim()]);
      setCurrentPrescription("");
    }
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveNotes = (data: ConsultationFormData) => {
    const payload = {
      appointment_id: appointmentInfo.appointment.id,
      notes: data.notes,
      prescriptions: prescriptions.join("\n"),
      recommendations: data.recommendations || "",
    };

    saveConsultation(payload).then(() => {
      setHasLeftNotes(true);
    });
  };

  const handleCompleteConsultation = async () => {
    if (!hasLeftNotes) {
      showErrorToast("please leave notes before completing the consultation");
      return;
    }
    completeAppointment(appointmentInfo.appointment.id).then(() => {
      setStatus("completed");
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/doctor">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Consultation
          </h1>
          <p className="text-gray-600">
            {formatDate(appointmentInfo.appointment.appointment_date)}•{" "}
            {formatTime(appointmentInfo.appointment.appointment_date)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={status}>{status}</Badge>

          {status === "booked" && (
            <Button onClick={handleStartConsultation} disabled={isStarting}>
              <Play className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
          )}

          {status === "in_progress" && (
            <Button
              onClick={handleCompleteConsultation}
              disabled={isCompleting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCompleting ? (
                "Completing..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Consultation
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{patient?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">
                  {patient?.dateOfBirth
                    ? formatDate(patient.dateOfBirth)
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{patient?.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">
                  {patient?.email || "Not provided"}
                </p>
              </div>

              {patient?.medicalCondition && (
                <div>
                  <p className="text-sm text-gray-600">Medical Condition</p>
                  <p className="font-medium text-sm bg-orange-50 p-2 rounded border">
                    {patient.medicalCondition}
                  </p>
                </div>
              )}

              {patient?.currentMedication && (
                <div>
                  <p className="text-sm text-gray-600">Current Medication</p>
                  <p className="font-medium text-sm bg-blue-50 p-2 rounded border">
                    {patient.currentMedication}
                  </p>
                </div>
              )}

              {patient?.knownAllergies && (
                <div>
                  <p className="text-sm text-gray-600">Known Allergies</p>
                  <p className="font-medium text-sm bg-red-50 p-2 rounded border">
                    {patient.knownAllergies}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Consultation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveNotes)}>
              {/* Consultation Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Consultation Notes
                    </span>
                    <Button
                      type="submit"
                      disabled={
                        isCompleting || isStarting || !form.formState.isValid
                      }
                      size="sm"
                      variant="outline"
                    >
                      {isCompleting || isStarting ? "Saving..." : "Save Notes"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Clinical Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter patient examination findings, symptoms, diagnosis, and observations..."
                              rows={8}
                              disabled={
                                status === "booked" || status === "completed"
                              }
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            Include symptoms, examination findings, diagnosis,
                            and treatment plan
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add Prescription */}
                    {status === "in_progress" && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Paracetamol 500mg twice daily"
                          value={currentPrescription}
                          onChange={(e) =>
                            setCurrentPrescription(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddPrescription();
                            }
                          }}
                        />
                        <Button
                          onClick={handleAddPrescription}
                          disabled={!currentPrescription.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    )}

                    {/* Prescription List */}
                    <div className="space-y-2">
                      {prescriptions.map((prescription, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        >
                          <span className="font-medium">{prescription}</span>
                          {status === "in_progress" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemovePrescription(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}

                      {prescriptions.length === 0 && (
                        <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                          No prescriptions added yet
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations & Follow-up</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="recommendations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Recommendations</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter follow-up instructions, lifestyle recommendations, next appointment schedule..."
                            rows={4}
                            disabled={
                              status === "booked" || status === "completed"
                            }
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500">
                          Include follow-up schedule, lifestyle changes, and any
                          additional recommendations
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>

          {/* Action Buttons */}
          {status !== "completed" && (
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleCompleteConsultation}
                disabled={
                  status === "booked" ||
                  !watchedNotes?.trim() ||
                  isCompleting ||
                  isStarting ||
                  !hasLeftNotes
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {isCompleting || isStarting ? (
                  "Completing..."
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Consultation
                  </>
                )}
              </Button>
            </div>
          )}

          {status === "completed" && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Consultation Completed</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Session completed at{" "}
                  {formatTime(
                    appointmentInfo.appointment.updated_at || new Date()
                  )}
                  . updated.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
