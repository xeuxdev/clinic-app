import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Play,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  getAppointmentsByDoctor,
  getDoctorById,
  getPatientById,
  type Appointment,
} from "~/lib/demo-data";

export function meta() {
  return [
    { title: "Doctor Dashboard - Clinic Management" },
    {
      name: "description",
      content: "View appointments and manage consultations",
    },
  ];
}

export default function DoctorDashboard() {
  const [selectedDoctorId, setSelectedDoctorId] = useState("1"); // Default to first doctor

  const today = new Date().toISOString().split("T")[0];
  const doctorAppointments = getAppointmentsByDoctor(selectedDoctorId, today);
  const selectedDoctor = getDoctorById(selectedDoctorId);

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

  const getNextAppointment = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return doctorAppointments
      .filter((a) => a.status === "scheduled" && a.time >= currentTime)
      .sort((a, b) => a.time.localeCompare(b.time))[0];
  };

  const getDashboardStats = () => {
    return {
      total: doctorAppointments.length,
      scheduled: doctorAppointments.filter((a) => a.status === "scheduled")
        .length,
      inProgress: doctorAppointments.filter((a) => a.status === "in-progress")
        .length,
      completed: doctorAppointments.filter((a) => a.status === "completed")
        .length,
      nextAppointment: getNextAppointment(),
    };
  };

  const stats = getDashboardStats();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {selectedDoctor?.name} • {selectedDoctor?.specialization}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.scheduled}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.inProgress}
                </p>
              </div>
              <Play className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Schedule -{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => {
                        const patient = getPatientById(appointment.patientId);

                        return (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {appointment.time}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{patient?.name}</p>
                                {patient?.medicalHistory && (
                                  <p className="text-xs text-gray-500">
                                    History: {patient.medicalHistory}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {patient?.age} years
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{patient?.phone}</p>
                                <p className="text-gray-500">
                                  {patient?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(appointment.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {appointment.status === "scheduled" && (
                                  <Link
                                    to={`/doctor/consultation/${appointment.id}`}
                                  >
                                    <Button size="sm">
                                      <Play className="w-3 h-3 mr-1" />
                                      Start
                                    </Button>
                                  </Link>
                                )}

                                {appointment.status === "in-progress" && (
                                  <Link
                                    to={`/doctor/consultation/${appointment.id}`}
                                  >
                                    <Button
                                      size="sm"
                                      className="bg-yellow-600 hover:bg-yellow-700"
                                    >
                                      <FileText className="w-3 h-3 mr-1" />
                                      Continue
                                    </Button>
                                  </Link>
                                )}

                                {appointment.status === "completed" && (
                                  <Button size="sm" variant="outline">
                                    <FileText className="w-3 h-3 mr-1" />
                                    View Notes
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

              {doctorAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments scheduled for today</p>
                  <p className="text-sm">Enjoy your free time!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Appointment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.nextAppointment ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {stats.nextAppointment.time}
                      </span>
                    </div>
                    <p className="font-medium">
                      {getPatientById(stats.nextAppointment.patientId)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Age:{" "}
                      {getPatientById(stats.nextAppointment.patientId)?.age}
                    </p>
                  </div>

                  <Link to={`/doctor/consultation/${stats.nextAppointment.id}`}>
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Consultation
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>All done for today!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Appointments</span>
                <Badge variant="outline">{stats.total}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <Badge className="bg-green-100 text-green-800">
                  {stats.completed}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {stats.scheduled + stats.inProgress}
                </Badge>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">
                    {stats.total > 0
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.total > 0
                          ? (stats.completed / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
