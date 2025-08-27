import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Clock,
  Save,
  FileText,
  Pill,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { useGetAppointmentById } from "~/api/appointments";
import type { Appointment } from "~/api/types";
import { toast } from "sonner";
import { calculateAge, formatDate } from "~/lib/utils";

export function meta() {
  return [
    { title: "Patient Consultation - Clinic Management" },
    {
      name: "description",
      content: "Conduct patient consultation and manage medical records",
    },
  ];
}

interface ConsultationFormData {
  notes: string;
  prescriptions: string[];
  recommendations: string;
  currentPrescription: string;
}

export default function PatientConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultationStatus, setConsultationStatus] = useState<
    "not-started" | "in-progress" | "completed"
  >("not-started");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<ConsultationFormData>({
    notes: "",
    prescriptions: [],
    recommendations: "",
    currentPrescription: "",
  });

  // Fetch appointment from API
  const appointmentQuery = useGetAppointmentById(id!);
  const apiAppointment: Appointment | undefined =
    appointmentQuery.data?.appointment;

  useEffect(() => {
    if (!apiAppointment) return;
    // derive consultation status from appointment status
    if (apiAppointment.status === "in_progress")
      setConsultationStatus("in-progress");
    else if (apiAppointment.status === "completed")
      setConsultationStatus("completed");
    else setConsultationStatus("not-started");
  }, [apiAppointment]);

  if (appointmentQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-600">Loading appointment...</div>
      </div>
    );
  }

  if (!apiAppointment) {
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

  // Map API appointment to local shapes used by the UI
  const appointment = apiAppointment;
  const apptDate = new Date(appointment.appointment_date);
  const patient = {
    name: appointment.patient_name,
    age: calculateAge(appointment.patient_dob),
    phone: appointment.patient_phone,
    email: appointment.patient_email,
    address: "N/A",
    medicalHistory: undefined,
  } as const;
  const doctor = {
    name: appointment.doctor_name ?? "Doctor",
  };

  const handleStartConsultation = () => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setStartTime(timeString);
    setConsultationStatus("in-progress");
    toast.success("Consultation started");
  };

  const handleAddPrescription = () => {
    if (formData.currentPrescription.trim()) {
      setFormData((prev) => ({
        ...prev,
        prescriptions: [...prev.prescriptions, prev.currentPrescription.trim()],
        currentPrescription: "",
      }));
    }
  };

  const handleRemovePrescription = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);

    try {
      // Simulate API call to save consultation notes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Notes saved successfully");
    } catch (error) {
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteConsultation = async () => {
    if (!formData.notes.trim()) {
      toast.error("Please add consultation notes before completing");
      return;
    }

    setIsSaving(true);

    try {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      setEndTime(timeString);
      setConsultationStatus("completed");

      // Simulate API call to complete consultation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Consultation completed successfully!");

      // Navigate back to doctor dashboard after a delay
      setTimeout(() => {
        navigate("/doctor");
      }, 1000);
    } catch (error) {
      toast.error("Failed to complete consultation");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    const styles = {
      "not-started": "bg-gray-100 text-gray-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
    };

    const labels = {
      "not-started": "Not Started",
      "in-progress": "In Progress",
      completed: "Completed",
    };

    return (
      <Badge className={styles[consultationStatus]}>
        {labels[consultationStatus]}
      </Badge>
    );
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
            {apptDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • {apptDate.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {consultationStatus === "not-started" && (
            <Button
              onClick={handleStartConsultation}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
          )}
          {consultationStatus === "in-progress" && (
            <Button
              onClick={handleCompleteConsultation}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
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
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{patient?.age} years</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{patient?.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{patient?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{patient?.address}</p>
              </div>

              {patient?.medicalHistory && (
                <div>
                  <p className="text-sm text-gray-600">Medical History</p>
                  <p className="font-medium text-sm bg-orange-50 p-2 rounded border">
                    {patient.medicalHistory}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Session Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {startTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Started:</span>
                    <span className="font-medium">{startTime}</span>
                  </div>
                )}

                {endTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ended:</span>
                    <span className="font-medium">{endTime}</span>
                  </div>
                )}

                {!startTime && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Consultation not started yet
                  </p>
                )}

                {startTime &&
                  !endTime &&
                  consultationStatus === "in-progress" && (
                    <div className="text-center py-2">
                      <div className="text-lg font-medium text-green-600">
                        🔴 Session Active
                      </div>
                      <p className="text-xs text-gray-500">
                        Started at {startTime}
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Consultation Notes
                </span>
                <Button
                  onClick={handleSaveNotes}
                  disabled={isSaving || consultationStatus === "not-started"}
                  size="sm"
                  variant="outline"
                >
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes *</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter patient examination findings, symptoms, diagnosis, and observations..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={8}
                    disabled={
                      consultationStatus === "not-started" ||
                      consultationStatus === "completed"
                    }
                  />
                  <p className="text-xs text-gray-500">
                    Include symptoms, examination findings, diagnosis, and
                    treatment plan
                  </p>
                </div>
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
                {consultationStatus === "in-progress" && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Paracetamol 500mg twice daily"
                      value={formData.currentPrescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentPrescription: e.target.value,
                        }))
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
                      disabled={!formData.currentPrescription.trim()}
                    >
                      Add
                    </Button>
                  </div>
                )}

                {/* Prescription List */}
                <div className="space-y-2">
                  {formData.prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="font-medium">{prescription}</span>
                      {consultationStatus === "in-progress" && (
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

                  {formData.prescriptions.length === 0 && (
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
              <div className="space-y-2">
                <Label htmlFor="recommendations">
                  Treatment Recommendations
                </Label>
                <Textarea
                  id="recommendations"
                  placeholder="Enter follow-up instructions, lifestyle recommendations, next appointment schedule..."
                  value={formData.recommendations}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recommendations: e.target.value,
                    }))
                  }
                  rows={4}
                  disabled={
                    consultationStatus === "not-started" ||
                    consultationStatus === "completed"
                  }
                />
                <p className="text-xs text-gray-500">
                  Include follow-up schedule, lifestyle changes, and any
                  additional recommendations
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {consultationStatus !== "completed" && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                disabled={consultationStatus === "not-started"}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              <Button
                onClick={handleCompleteConsultation}
                disabled={
                  consultationStatus === "not-started" ||
                  !formData.notes.trim() ||
                  isSaving
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
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

          {consultationStatus === "completed" && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Consultation Completed</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Session completed at {endTime}. Patient record has been
                  updated.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
