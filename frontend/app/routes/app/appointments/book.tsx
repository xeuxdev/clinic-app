import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CreditCard,
  Save,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type Patient } from "~/api/types";
import { useListPatients, useSearchPatients } from "~/api/patients";
import { useListDoctors } from "~/api/doctors";

// Local doctor shape (API may return accounts/profiles; keep minimal fields used here)
type Doctor = {
  id: string | number;
  name?: string;
  specialization?: string;
  phone?: string;
};

const DEFAULT_FEE = 5000;

function getDoctorFee(specialization?: string | undefined) {
  if (!specialization) return DEFAULT_FEE;
  const map: Record<string, number> = {
    "General Medicine": 5000,
    Cardiology: 12000,
    Pediatrics: 7000,
    Orthopedics: 9000,
    Dermatology: 6000,
    // fallback for unknown
  };
  return map[specialization] ?? DEFAULT_FEE;
}

function getAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return undefined;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return undefined;
  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}
import { toast } from "sonner";
import { useAddAppointment } from "~/api/appointments";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function meta() {
  return [
    { title: "Book Appointment - Clinic Management" },
    { name: "description", content: "Schedule a new patient appointment" },
  ];
}

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z
    .string()
    .min(1, "Please select a date")
    .refine((d) => {
      const selected = new Date(d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Cannot book appointments for past dates"),
  time: z.string().min(1, "Please select a time"),
  paymentAmount: z.number().gt(0, "Please enter a valid payment amount"),
  paymentMethod: z.enum(["cash", "card", "insurance"]),
  note: z.string().optional(),
});

// Time slots
const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get("patientId");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { mutateAsync: addAppointment, isPending } = useAddAppointment();

  // API hooks
  const { data: patients } = useListPatients();
  const { data: searchedPatients } = useSearchPatients(searchQuery);
  const { data: doctors } = useListDoctors();

  // Normalize doctors response: accept either an array or { doctors: [] }
  const doctorsList: any[] = Array.isArray(doctors)
    ? doctors
    : (doctors && (doctors.doctors ?? [])) || [];

  // Map API doctor objects to a simple shape used by the UI
  const normalizedDoctors: Doctor[] = doctorsList.map((d: any) => ({
    id: d.id,
    name: d.full_name ?? d.name,
    specialization: d.details?.specialization ?? d.specialization,
    phone: d.phone_number ?? d.phone,
  }));

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: preSelectedPatientId || "",
      doctorId: "",
      date: "",
      time: "",
      paymentAmount: 5000,
      paymentMethod: "cash",
      note: "",
    },
  });

  const { handleSubmit, setValue, watch, formState } = form;
  const watched = watch();
  const isSubmitting = isPending || formState.isSubmitting;

  useEffect(() => {
    // Initialize patient search: if query empty show first 5 patients, else show search results
    const next =
      searchQuery.trim() === ""
        ? (patients ?? []).slice(0, 5)
        : searchedPatients ?? [];

    // Only update state if the list actually changed (by id) to avoid update loops
    const same =
      next.length === filteredPatients.length &&
      next.every((p, i) => String(p.id) === String(filteredPatients[i]?.id));

    if (!same) {
      setFilteredPatients(next);
    }
  }, [searchQuery, patients, searchedPatients, filteredPatients]);

  // When a pre-selected patientId is present in the URL, pick that patient once patients load
  useEffect(() => {
    if (!preSelectedPatientId) return;
    if (!patients || patients.length === 0) return;

    const match = (patients ?? []).find(
      (p: Patient) => String(p.id) === String(preSelectedPatientId)
    );
    if (match) {
      const alreadySelected =
        selectedPatient && String(selectedPatient.id) === String(match.id);
      const filteredIsMatch =
        filteredPatients.length === 1 &&
        String(filteredPatients[0].id) === String(match.id);

      if (!alreadySelected) setSelectedPatient(match);
      if (String(watched.patientId) !== String(match.id))
        setValue("patientId", String(match.id));
      if (!filteredIsMatch) setFilteredPatients([match]);
    }
  }, [preSelectedPatientId, patients, setValue]);

  // Sync selectedPatient when patientId form value changes (manual selection)
  useEffect(() => {
    const pid = watched.patientId;
    if (!pid) {
      setSelectedPatient(null);
      return;
    }
    const found = (patients ?? []).find(
      (p: Patient) => String(p.id) === String(pid)
    );
    if (found) setSelectedPatient(found);
  }, [watched.patientId, patients]);

  // Sync selectedDoctor when doctorId form value changes
  useEffect(() => {
    const did = watched.doctorId;
    if (!did) {
      setSelectedDoctor(null);
      return;
    }
    const found = normalizedDoctors.find((d) => String(d.id) === String(did));
    if (found) {
      setSelectedDoctor(found as Doctor);

      // If the user hasn't changed the fee (still default) or it's falsy, update it to doctor's fee
      const fee = getDoctorFee(found.specialization);
      const current = watched.paymentAmount ?? DEFAULT_FEE;
      if (!current || Number(current) === DEFAULT_FEE) {
        setValue("paymentAmount", fee);
      }
    }
  }, [watched.doctorId, doctors]);

  // on valid submit
  const onSubmit = async (values: AppointmentFormValues) => {
    if (!selectedPatient || !selectedDoctor) {
      toast.error("Invalid patient or doctor selected");
      return;
    }

    const appointmentDate = new Date(
      `${values.date}T${values.time}:00`
    ).toISOString();

    const payload = {
      email: selectedPatient.email,
      profile_id: Number(values.patientId),
      appointment_date: appointmentDate,
      doctor_id: Number(values.doctorId),
      notes: values.note || undefined,
    };

    await addAppointment(payload).then(() => {
      navigate("/appointments");
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/appointments">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Book New Appointment
          </h1>
          <p className="text-gray-600">Schedule an appointment for a patient</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Select Patient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!watched.patientId ? (
                  <>
                    <div className="space-y-2">
                      <Label>Search for existing patient</Label>
                      <Input
                        placeholder="Search by name, phone, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            setValue("patientId", String(patient.id))
                          }
                        >
                          <div>
                            <p className="font-medium">{patient.full_name}</p>
                            <p className="text-sm text-gray-600">
                              {patient.phone_number}
                            </p>
                            <p className="text-xs text-gray-500">
                              Age: {getAge(patient.date_of_birth) ?? "-"}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="text-center pt-2">
                      <Link to="/patients/register">
                        <Button variant="outline" size="sm">
                          <User className="w-4 h-4 mr-2" />
                          Register New Patient
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {selectedPatient?.full_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedPatient?.phone_number}
                        </p>
                        <p className="text-xs text-gray-500">
                          Age: {getAge(selectedPatient?.date_of_birth) ?? "-"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValue("patientId", "")}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Select Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Available Doctors</Label>
                  <Select
                    value={watched.doctorId}
                    onValueChange={(value) => setValue("doctorId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {normalizedDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={String(doctor.id)}>
                          {doctor.name ?? String(doctor.id)} -{" "}
                          {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDoctor && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="font-medium">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor.specialization}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedDoctor.phone}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={watched.date}
                      onChange={(e) => setValue("date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select
                      value={watched.time}
                      onValueChange={(value) => setValue("time", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Consultation Fee (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={String(watched.paymentAmount ?? "")}
                      onChange={(e) =>
                        setValue("paymentAmount", Number(e.target.value))
                      }
                      min="0"
                      step="500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={watched.paymentMethod}
                      onValueChange={(value) =>
                        setValue(
                          "paymentMethod",
                          value as "cash" | "card" | "insurance"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    value={watched.note ?? ""}
                    onChange={(e) => setValue("note", e.target.value)}
                    placeholder="Add any notes or instructions for the appointment"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !watched.patientId || !watched.doctorId}
              className="w-full"
            >
              {isSubmitting ? (
                "Booking Appointment..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Book Appointment
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Appointment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPatient ? (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-medium">{selectedPatient.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.phone_number}
                  </p>
                </div>
              ) : (
                <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  No patient selected
                </div>
              )}

              {selectedDoctor ? (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{selectedDoctor.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedDoctor.specialization}
                  </p>
                </div>
              ) : (
                <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  No doctor selected
                </div>
              )}

              {watched.date && watched.time ? (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {new Date(watched.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">{watched.time}</p>
                </div>
              ) : (
                <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  No date/time selected
                </div>
              )}

              {watched.paymentAmount ? (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium">
                    ₦{Number(watched.paymentAmount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {watched.paymentMethod}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Check doctor availability before booking</p>
              <p>• Collect payment at time of booking when possible</p>
              <p>• Confirm patient contact information</p>
              <p>• Allow 30 minutes between appointments</p>
              <p>• Send appointment reminders to patients</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
