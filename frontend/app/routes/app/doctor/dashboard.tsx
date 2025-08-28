import { Calendar, CheckCircle, Clock, FileText, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useListAppointments } from "~/api/appointments";
import type { Appointment } from "~/api/types";
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
import { ViewConsultationNotesModal } from "~/components/appointments/view-consultation-notes";
import { RescheduleAppointmentModal } from "~/components/appointments/reschedule-appointment-modal";
import { CancelAppointmentModal } from "~/components/appointments/cancel-appointment-modal";
import { useUser } from "~/context/user-context";
import { calculateAge } from "~/lib/utils";

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
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );

  // Default selected doctor comes from the logged in user when available.
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(
    () => user?.accountId ?? null
  );

  useEffect(() => {
    if (user?.role === "doctor" && user.accountId) {
      setSelectedDoctorId(user.accountId);
    }
  }, [user]);

  // Fetch today's appointments from the API. We'll filter client-side by doctor id.
  const todaysQuery = useListAppointments({ date: "today", role: "doctor" });
  const allTodaysAppointments: Appointment[] =
    todaysQuery.data?.appointments ?? [];

  const doctorAppointments = useMemo(() => {
    if (!selectedDoctorId) return allTodaysAppointments;
    const did = Number(selectedDoctorId);
    return allTodaysAppointments.filter((a) => a.doctor_id === did);
  }, [allTodaysAppointments, selectedDoctorId]);

  // Selected doctor display name falls back to the user full name for doctors.
  const selectedDoctorName =
    user?.role === "doctor" ? user?.fullName : undefined;

  const getNextAppointment = () => {
    const now = new Date();
    return doctorAppointments
      .filter((a) => {
        // consider only upcoming bookings
        const dt = new Date(a.appointment_date);
        return (
          (a.status === "booked" || a.status === "in_progress") && dt > now
        );
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime()
      )[0];
  };

  const stats = useMemo(() => {
    const total = doctorAppointments.length;
    const scheduled = doctorAppointments.filter(
      (a) => a.status === "booked"
    ).length;
    const inProgress = doctorAppointments.filter(
      (a) => a.status === "in_progress"
    ).length;
    const completed = doctorAppointments.filter(
      (a) => a.status === "completed"
    ).length;
    const nextAppointment = getNextAppointment();
    return { total, scheduled, inProgress, completed, nextAppointment };
  }, [doctorAppointments]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {selectedDoctorName ?? "Doctor"}
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
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(a.appointment_date).getTime() -
                          new Date(b.appointment_date).getTime()
                      )
                      .map((appointment) => {
                        const time = new Date(
                          appointment.appointment_date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{time}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {appointment.patient_name}
                                </p>
                                {appointment.note && (
                                  <p className="text-xs text-gray-500">
                                    Note: {appointment.note}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {calculateAge(appointment.patient_dob)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{appointment.patient_phone}</p>
                                <p className="text-gray-500">
                                  {appointment.patient_email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={appointment.status}>
                                {appointment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {appointment.status === "booked" && (
                                  <>
                                    <Link
                                      to={`/doctor/consultation/${appointment.id}`}
                                    >
                                      <Button size="sm">
                                        <Play className="w-3 h-3 mr-1" />
                                        Start
                                      </Button>
                                    </Link>
                                    <RescheduleAppointmentModal
                                      appointmentId={appointment.id}
                                      trigger={
                                        <Button size="sm" variant="outline">
                                          Reschedule
                                        </Button>
                                      }
                                    />
                                    <CancelAppointmentModal
                                      appointmentId={appointment.id}
                                      trigger={
                                        <Button size="sm" variant="destructive">
                                          Cancel
                                        </Button>
                                      }
                                    />
                                  </>
                                )}

                                {appointment.status === "in_progress" && (
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
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedAppointment(appointment.id);
                                      setIsOpen(true);
                                    }}
                                  >
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

                <ViewConsultationNotesModal
                  appointmentId={selectedAppointment!}
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                />
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
          {/* Next Appointment (only shown when there is an upcoming appointment) */}
          {stats.nextAppointment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {new Date(
                          stats.nextAppointment.appointment_date
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="font-medium">
                      {stats.nextAppointment.patient_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Contact:{" "}
                      {stats.nextAppointment.patient_phone ??
                        stats.nextAppointment.patient_email}
                    </p>
                  </div>

                  <Link to={`/doctor/consultation/${stats.nextAppointment.id}`}>
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Consultation
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

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
