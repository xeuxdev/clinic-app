import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { usePatientRegister } from "~/api/auth";
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

export function meta() {
  return [
    { title: "Register Patient - Clinic Management" },
    { name: "description", content: "Register a new patient in the system" },
  ];
}

const patientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  dateOfBirth: z
    .string()
    .min(1, "Date of Birth is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Please enter a valid date"),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().optional(),
  bloodGroup: z.enum(
    ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const,
    {
      message: "Blood group is required",
    }
  ),
  currentMedication: z.string().min(1, "Current medication is required"),
  knownAllergies: z.string().min(1, "Known allergies is required"),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function RegisterPatient() {
  const navigate = useNavigate();

  const { mutateAsync } = usePatientRegister();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      address: "",
      medicalHistory: "",
      bloodGroup: "O+",
      currentMedication: "",
      knownAllergies: "",
    },
  });

  const handleRegisterPatient = async (data: PatientFormData) => {
    const generateTempPassword = () =>
      Math.random().toString(36).slice(-8) + "A1!";

    const payload = {
      full_name: data.name,
      email: data.email,
      password: generateTempPassword(),
      phone_number: data.phone,
      date_of_birth: data.dateOfBirth,
      blood_group: data.bloodGroup,
      medical_condition: data.medicalHistory || undefined,
      current_medication: data.currentMedication,
      known_allergies: data.knownAllergies,
      role: "patient" as const,
    };

    await mutateAsync(payload).then(() => {
      navigate("/patients");
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/patients">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Register New Patient
          </h1>
          <p className="text-gray-600">Add a new patient to the system</p>
        </div>
      </div>

      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegisterPatient)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter patient's full name"
                              className="pl-10"
                              {...field}
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Date of Birth</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="date"
                              placeholder="Select date of birth"
                              className="pl-10 w-full"
                              {...field}
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="tel"
                                placeholder="+234-XXX-XXX-XXXX"
                                className="pl-10"
                                {...field}
                              />
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder="patient@example.com"
                                className="pl-10"
                                {...field}
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter complete address"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Medical History */}
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Medical History (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any relevant medical history, allergies, or conditions"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Include any known allergies, previous surgeries, chronic
                        conditions, or current medications
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Medication */}
                <FormField
                  control={form.control}
                  name="currentMedication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Current Medication
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter current medications if any"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Known Allergies */}
                <FormField
                  control={form.control}
                  name="knownAllergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Known Allergies
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter known allergies if any"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex-1"
                  >
                    {form.formState.isSubmitting ? (
                      "Registering..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Register Patient
                      </>
                    )}
                  </Button>

                  <Link to="/patients" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

        {/* Quick Actions After Registration */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              After registering the patient, you can:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/appointments/book">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book an Appointment
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/patients">
                  <User className="w-4 h-4 mr-2" />
                  View Patient List
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
