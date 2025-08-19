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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  demoPatients,
  demoDoctors,
  searchPatients,
  getPatientById,
  getDoctorById,
  type Patient,
  type Doctor,
} from "~/lib/demo-data";
import { toast } from "sonner";

export function meta() {
  return [
    { title: "Book Appointment - Clinic Management" },
    { name: "description", content: "Schedule a new patient appointment" },
  ];
}

interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  paymentAmount: string;
  paymentMethod: string;
  notes: string;
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get("patientId");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: preSelectedPatientId || "",
    doctorId: "",
    date: "",
    time: "",
    paymentAmount: "5000",
    paymentMethod: "cash",
    notes: "",
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

  useEffect(() => {
    // Initialize patient search
    if (searchQuery.trim() === "") {
      setFilteredPatients(demoPatients.slice(0, 5));
    } else {
      setFilteredPatients(searchPatients(searchQuery));
    }
  }, [searchQuery]);

  const handleInputChange = (
    field: keyof AppointmentFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.patientId) errors.push("Please select a patient");
    if (!formData.doctorId) errors.push("Please select a doctor");
    if (!formData.date) errors.push("Please select a date");
    if (!formData.time) errors.push("Please select a time");
    if (!formData.paymentAmount || Number(formData.paymentAmount) <= 0) {
      errors.push("Please enter a valid payment amount");
    }

    // Check if date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.push("Cannot book appointments for past dates");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const patient = getPatientById(formData.patientId);
      const doctor = getDoctorById(formData.doctorId);

      // In a real app, this would make API calls to:
      // 1. Create the appointment
      // 2. Process the payment
      // 3. Send notifications

      toast.success(
        `Appointment booked successfully for ${patient?.name} with ${doctor?.name}`
      );

      // Navigate to appointments list
      setTimeout(() => {
        navigate("/appointments");
      }, 1000);
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = getPatientById(formData.patientId);
  const selectedDoctor = getDoctorById(formData.doctorId);

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Select Patient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!formData.patientId ? (
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
                            handleInputChange("patientId", patient.id)
                          }
                        >
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-gray-600">
                              {patient.phone}
                            </p>
                            <p className="text-xs text-gray-500">
                              Age: {patient.age}
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
                        <p className="font-medium">{selectedPatient?.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedPatient?.phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          Age: {selectedPatient?.age}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInputChange("patientId", "")}
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
                    value={formData.doctorId}
                    onValueChange={(value) =>
                      handleInputChange("doctorId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
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
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        handleInputChange("time", value)
                      }
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
                      value={formData.paymentAmount}
                      onChange={(e) =>
                        handleInputChange("paymentAmount", e.target.value)
                      }
                      min="0"
                      step="500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        handleInputChange("paymentMethod", value)
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
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isSubmitting || !formData.patientId || !formData.doctorId
              }
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
                  <p className="font-medium">{selectedPatient.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.phone}
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

              {formData.date && formData.time ? (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {new Date(formData.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">{formData.time}</p>
                </div>
              ) : (
                <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                  No date/time selected
                </div>
              )}

              {formData.paymentAmount ? (
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium">
                    ₦{Number(formData.paymentAmount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {formData.paymentMethod}
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
