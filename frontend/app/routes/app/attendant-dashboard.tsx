import { Calendar, Clock, CreditCard, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useListTodaysAppointments } from "~/api/appointments";
import { useListPatients } from "~/api/patients";
import type { Patient } from "~/api/types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export function meta() {
  return [
    { title: "Attendant Dashboard - Clinic Management" },
    {
      name: "description",
      content: "Front desk operations and patient management",
    },
  ];
}

export default function AttendantDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  const { data: patients } = useListPatients();
  // `useListPatients` returns an array of patients (or undefined while loading)
  const patientsList: Patient[] = patients ?? [];

  const { data: todaysAppointmentsData } = useListTodaysAppointments();
  // API returns an object with `appointments` property per `TodaysAppointmentResponse`
  const todaysAppointments = todaysAppointmentsData?.appointments ?? [];

  const totalPatients = patientsList.length;
  // derive total doctors from todays appointments (unique doctor ids) as a fallback
  const totalDoctors = Array.from(
    new Set(todaysAppointments.map((a) => a.doctor_id))
  ).length;
  const pendingPayments = 0; // payment info not available on the current API Appointment shape

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // results are derived in the effect below
  };

  // populate search results from fetched patients
  useEffect(() => {
    if (!patientsList || patientsList.length === 0) {
      setSearchResults([]);
      return;
    }

    if (!searchQuery || searchQuery.trim() === "") {
      setSearchResults(patientsList.slice(0, 5));
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const filtered = patientsList.filter((p) => {
      // patient shape from API uses full_name and phone_number
      const name = (p.full_name ?? "").toLowerCase();
      const phone = (p.phone_number ?? "").toLowerCase();
      const email = (p.email ?? "").toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q);
    });

    setSearchResults(filtered.slice(0, 20));
  }, [patientsList, searchQuery]);

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    // normalize status (API may use underscores)
    const normalized = status.replace("_", "-");
    const styles: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    const label =
      normalized.charAt(0).toUpperCase() +
      normalized.slice(1).replace("-", " ");

    return <Badge className={styles[normalized] ?? ""}>{label}</Badge>;
  };

  const calculateAge = (dob?: string | null) => {
    if (!dob) return "—";
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return "—";
    const diff = Date.now() - birth.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendant Dashboard
          </h1>
          <p className="text-gray-600">
            Manage patients, appointments, and payments
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/patients/register">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Patient
            </Button>
          </Link>
          <Link to="/appointments/book">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalPatients}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todaysAppointments.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Available Doctors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalDoctors}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Payments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingPayments}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Patient Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Patient Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between flex-wrap p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{patient.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {patient.phone_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        Age: {calculateAge(patient.date_of_birth)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/appointments/book?patientId=${patient.id}`}>
                        <Button size="sm" variant="outline">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No patients found.{" "}
                  <Link
                    to="/patients/register"
                    className="text-blue-600 hover:underline"
                  >
                    Register new patient
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center flex-wrap gap-2">
                <Calendar className="w-5 h-5" />
                Today's Appointments
              </span>
              <Link to="/appointments">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {todaysAppointments.map((appointment) => {
                const patient =
                  patientsList.find((p) => p.id === appointment.profile_id) ||
                  null;

                // doctor name is not available here; show doctor id as fallback
                const doctorLabel = appointment.doctor_id
                  ? `Dr. #${appointment.doctor_id}`
                  : "";

                const appointmentTime = appointment.appointment_date ?? "";

                return (
                  <div
                    key={appointment.appointment_id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {patient?.full_name ?? "Unknown"}
                        </p>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {appointment.doctor_name} • {appointmentTime}
                      </p>
                      {/* API appointment shape doesn't include paymentStatus; omit payment badge */}
                    </div>
                  </div>
                );
              })}

              {todaysAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No appointments scheduled for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/patients">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>Manage Patients</span>
              </Button>
            </Link>

            <Link to="/appointments">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span>View Appointments</span>
              </Button>
            </Link>

            <Link to="/payments">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <CreditCard className="w-6 h-6" />
                <span>Process Payments</span>
              </Button>
            </Link>

            <Link to="/doctor">
              <Button variant="outline" className="w-full h-16 flex-col gap-2">
                <Clock className="w-6 h-6" />
                <span>Doctor Dashboard</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
