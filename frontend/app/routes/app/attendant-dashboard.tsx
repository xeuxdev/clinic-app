import { Calendar, Clock, CreditCard, Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  demoDoctors,
  demoPatients,
  getDoctorById,
  getPatientById,
  getTodaysAppointments,
  searchPatients,
  type Appointment,
} from "~/lib/demo-data";

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
  const [searchResults, setSearchResults] = useState(demoPatients.slice(0, 5));

  const todaysAppointments = getTodaysAppointments();
  const totalPatients = demoPatients.length;
  const totalDoctors = demoDoctors.length;
  const pendingPayments = todaysAppointments.filter(
    (a) => a.paymentStatus === "pending"
  ).length;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults(demoPatients.slice(0, 5));
    } else {
      setSearchResults(searchPatients(query));
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getPaymentBadge = (status: Appointment["paymentStatus"]) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      partial: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.phone}</p>
                      <p className="text-xs text-gray-500">
                        Age: {patient.age}
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
                const patient = getPatientById(appointment.patientId);
                const doctor = getDoctorById(appointment.doctorId);

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{patient?.name}</p>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {doctor?.name} • {appointment.time}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getPaymentBadge(appointment.paymentStatus)}
                      </div>
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
