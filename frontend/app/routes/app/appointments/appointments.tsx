import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  PlayIcon,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useListAppointments } from "~/api/appointments";
import type { Appointment as ApiAppointment } from "~/api/types";
import { ViewConsultationNotesModal } from "~/components/appointments/view-consultation-notes";
import { RescheduleAppointmentModal } from "~/components/appointments/reschedule-appointment-modal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useUser } from "~/context/user-context";

export function meta() {
  return [
    { title: "Appointments - Clinic Management" },
    {
      name: "description",
      content: "Manage appointment schedules and bookings",
    },
  ];
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<ApiAppointment | null>(null);

  const { user } = useUser();

  // Determine if selected date is today
  const today = new Date().toISOString().split("T")[0];
  const isToday = selectedDate === today;

  // Map frontend status to backend status
  const getBackendStatus = (frontendStatus: string) => {
    const statusMap: Record<string, string> = {
      scheduled: "booked",
      rescheduled: "rescheduled",
      "in-progress": "in_progress",
      completed: "completed",
      cancelled: "cancelled",
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  // React Query hook with filters
  const appointmentsQuery = useListAppointments({
    date: isToday ? "today" : selectedDate,
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? getBackendStatus(statusFilter) : undefined,
    role: user?.role!,
  });

  // Use API data directly
  const sourceAppointments = appointmentsQuery?.data?.appointments || [];

  const filteredAppointments = sourceAppointments.filter((appointment) =>
    user?.role === "doctor"
      ? String(user.userId) === String(appointment.doctor_id)
      : true
  );

  const getStatusCounts = () => {
    // sourceAppointments is already filtered by date from backend
    return {
      total: sourceAppointments.length,
      scheduled: sourceAppointments.filter(
        (a) => a.status === "booked" || a.status === "rescheduled"
      ).length,
      inProgress: sourceAppointments.filter((a) => a.status === "in_progress")
        .length,
      completed: sourceAppointments.filter((a) => a.status === "completed")
        .length,
      cancelled: sourceAppointments.filter((a) => a.status === "cancelled")
        .length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Management
          </h1>
          <p className="text-gray-600">
            Schedule and manage patient appointments
          </p>
        </div>
        {user?.role === "attendant" && (
          <Link to="/appointments/book">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {statusCounts.total}
            </p>
            <p className="text-xs text-gray-600">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {statusCounts.scheduled}
            </p>
            <p className="text-xs text-gray-600">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {statusCounts.inProgress}
            </p>
            <p className="text-xs text-gray-600">In Progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {statusCounts.completed}
            </p>
            <p className="text-xs text-gray-600">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {statusCounts.cancelled}
            </p>
            <p className="text-xs text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="rescheduled">Re-Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, doctor, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Appointments for{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
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
                  <TableHead>Doctor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  // Use API fields directly
                  const patientName = appointment.patient_name || "Unknown";
                  const patientPhone = appointment.patient_phone || "";
                  const patientEmail = appointment.patient_email || "";
                  const doctorName = appointment.doctor_name || "Unknown";
                  const dateObj = new Date(appointment.appointment_date);
                  const time = dateObj.toTimeString().slice(0, 5);

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
                          <p className="font-medium">{patientName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doctorName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{patientPhone}</p>
                          <p className="text-gray-500">{patientEmail}</p>
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
                            <RescheduleAppointmentModal
                              appointmentId={appointment.id}
                              trigger={
                                <Button size="sm" variant="outline">
                                  Reschedule
                                </Button>
                              }
                            />
                          )}

                          {user?.role === "doctor" && (
                            <Link to={`/doctor/consultation/${appointment.id}`}>
                              <Button
                                size="sm"
                                disabled={appointment.status !== "booked"}
                              >
                                <PlayIcon className="w-3 h-3 mr-1" />
                                Start
                              </Button>
                            </Link>
                          )}

                          {user?.role === "attendant" &&
                            (appointment.paymentstatus === "pending" ? (
                              <Link to={`/payments/${appointment.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-50 hover:bg-green-100 border-green-200"
                                >
                                  <CreditCard className="w-4 h-4 mr-1" />
                                  Pay
                                </Button>
                              </Link>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-600"
                              >
                                Paid
                              </Badge>
                            ))}

                          {appointment.status === "completed" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsOpen(true);
                                }}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                View Notes
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? `No appointments found matching "${searchQuery}" for ${new Date(
                    selectedDate
                  ).toLocaleDateString()}`
                : `No appointments scheduled for ${new Date(
                    selectedDate
                  ).toLocaleDateString()}`}

              {user?.role === "attendant" && (
                <div className="mt-2">
                  <Link to="/appointments/book">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Book New Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ViewConsultationNotesModal
        appointmentId={selectedAppointment?.id!}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}
