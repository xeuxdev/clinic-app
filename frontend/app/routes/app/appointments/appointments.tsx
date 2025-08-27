import { Calendar, Clock, Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useListAppointments, useSearchAppointments } from "~/api/appointments";
import type { Appointment as ApiAppointment } from "~/api/types";
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
import type { Appointment } from "~/lib/demo-data";

type MappedAppointment = {
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
  doctor_name?: string;
  doctor_email?: string;
  id: string;
  patientId?: string;
  doctorId?: string;
  date: string;
  time: string;
  status: Appointment["status"];
  paymentStatus: Appointment["paymentStatus"];
  notes?: string;
};

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

  // React Query hooks (list + search)
  const listQuery = useListAppointments();
  const searchQueryResult = useSearchAppointments(searchQuery);

  // Transform API booking shape to the local demo Appointment shape
  const transformBooking = (b: Partial<ApiAppointment>): MappedAppointment => {
    const dateObj = b.appointment_date
      ? new Date(b.appointment_date)
      : new Date();
    const date = dateObj.toISOString().split("T")[0];
    const time = dateObj.toTimeString().slice(0, 5);

    const statusMap: Record<string, Appointment["status"]> = {
      booked: "scheduled",
      in_progress: "in-progress",
      completed: "completed",
      cancelled: "cancelled",
      rescheduled: "scheduled",
    };

    const mapped: MappedAppointment = {
      id: String(b.id ?? ""),
      patientId: String(b.profile_id ?? ""),
      doctorId: String(b.doctor_id ?? ""),
      date,
      time,
      status:
        b.status && statusMap[b.status] ? statusMap[b.status] : "scheduled",
      paymentStatus: "paid",
      notes: (b.note ?? "") as string,
    };

    // attach API-provided display fields as metadata so rendering can fall back to them
    if (b.patient_name) mapped.patient_name = b.patient_name;
    if (b.patient_phone) mapped.patient_phone = b.patient_phone;
    if (b.patient_email) mapped.patient_email = b.patient_email;
    if (b.doctor_name) mapped.doctor_name = b.doctor_name;
    if (b.doctor_email) mapped.doctor_email = b.doctor_email;

    return mapped;
  };

  // Prefer search results when a query is present, otherwise use list
  const apiBookings = searchQuery
    ? searchQueryResult.data?.bookings
    : listQuery.data?.bookings;

  // Build source appointments (map API bookings to local shape when present)
  // If the API hasn't returned yet, use an empty list — everything depends on the API now
  const sourceAppointments: MappedAppointment[] = Array.isArray(apiBookings)
    ? apiBookings.map(transformBooking)
    : [];

  // Filter appointments based on selected criteria
  const filteredAppointments = sourceAppointments.filter((appointment) => {
    const matchesDate = appointment.date === selectedDate;
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    let matchesSearch = true;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      matchesSearch =
        !!appointment.patient_name?.toLowerCase().includes(searchLower) ||
        !!appointment.doctor_name?.toLowerCase().includes(searchLower) ||
        !!appointment.patient_phone?.includes(searchQuery) ||
        appointment.time.includes(searchQuery);
    }

    return matchesDate && matchesStatus && matchesSearch;
  });

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
      <Badge className={styles[status]} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusCounts = () => {
    const dayAppointments = sourceAppointments.filter(
      (a) => a.date === selectedDate
    );
    return {
      total: dayAppointments.length,
      scheduled: dayAppointments.filter((a) => a.status === "scheduled").length,
      inProgress: dayAppointments.filter((a) => a.status === "in-progress")
        .length,
      completed: dayAppointments.filter((a) => a.status === "completed").length,
      cancelled: dayAppointments.filter((a) => a.status === "cancelled").length,
      pendingPayment: dayAppointments.filter(
        (a) => a.paymentStatus === "pending"
      ).length,
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
        <Link to="/appointments/book">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {statusCounts.pendingPayment}
            </p>
            <p className="text-xs text-gray-600">Payment Due</p>
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
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
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  // Use API-provided fields only (no demo lookups)
                  const mappedAppt = appointment as MappedAppointment;
                  const patientName = mappedAppt.patient_name ?? "Unknown";
                  const patientAge = null;
                  const patientPhone = mappedAppt.patient_phone ?? "";
                  const patientEmail = mappedAppt.patient_email ?? "";

                  const doctorName = mappedAppt.doctor_name ?? "Unknown";
                  const doctorSpec = "";

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
                          <p className="font-medium">{patientName}</p>
                          <p className="text-sm text-gray-500">
                            {patientAge ? `Age: ${patientAge}` : null}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doctorName}</p>
                          <p className="text-sm text-gray-500">{doctorSpec}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{patientPhone}</p>
                          <p className="text-gray-500">{patientEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentBadge(appointment.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {appointment.paymentStatus === "pending" && (
                            <Link
                              to={`/payments?appointmentId=${appointment.id}`}
                            >
                              <Button size="sm" variant="outline">
                                Collect Payment
                              </Button>
                            </Link>
                          )}

                          {appointment.status === "scheduled" && (
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                          )}

                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
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
              <div className="mt-2">
                <Link to="/appointments/book">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
