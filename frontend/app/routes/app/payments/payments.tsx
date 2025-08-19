import { useState } from "react";
import { Link } from "react-router";
import {
  CreditCard,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
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
import {
  demoAppointments,
  demoPayments,
  getPatientById,
  getDoctorById,
  type Payment,
} from "~/lib/demo-data";
import { toast } from "sonner";

export function meta() {
  return [
    { title: "Payments - Clinic Management" },
    {
      name: "description",
      content: "Process payments and manage payment records",
    },
  ];
}

export default function PaymentsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );

  // Get pending payments for today
  const todaysAppointments = demoAppointments.filter(
    (a) => a.date === selectedDate
  );
  const pendingPayments = todaysAppointments.filter(
    (a) => a.paymentStatus === "pending"
  );

  // Filter payments based on criteria
  const filteredPayments = demoPayments.filter((payment) => {
    const matchesDate = payment.date === selectedDate;
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    let matchesSearch = true;
    if (searchQuery) {
      const patient = getPatientById(payment.patientId);
      const searchLower = searchQuery.toLowerCase();
      matchesSearch =
        patient?.name.toLowerCase().includes(searchLower) ||
        patient?.phone.includes(searchQuery) ||
        payment.amount.toString().includes(searchQuery);
    }

    return matchesDate && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Payment["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getMethodBadge = (method: Payment["method"]) => {
    const styles = {
      cash: "bg-blue-100 text-blue-800",
      card: "bg-purple-100 text-purple-800",
      insurance: "bg-green-100 text-green-800",
    };

    return (
      <Badge variant="outline" className={styles[method]}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    );
  };

  const handleProcessPayment = async (
    appointmentId: string,
    amount: number,
    method: string
  ) => {
    setProcessingPayment(appointmentId);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would:
      // 1. Process the payment with payment gateway
      // 2. Update appointment payment status
      // 3. Create payment record
      // 4. Generate receipt

      toast.success(
        `Payment of ₦${amount.toLocaleString()} processed successfully!`
      );
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setProcessingPayment(null);
    }
  };

  const getTodaysStats = () => {
    const todaysPayments = demoPayments.filter((p) => p.date === selectedDate);
    const totalCollected = todaysPayments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = pendingPayments.reduce((sum, a) => sum + 5000, 0); // Assuming 5000 per consultation

    return {
      totalCollected,
      pendingAmount,
      completedPayments: todaysPayments.filter((p) => p.status === "completed")
        .length,
      pendingCount: pendingPayments.length,
    };
  };

  const stats = getTodaysStats();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
          <p className="text-gray-600">
            Process payments and manage payment records
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
                  Total Collected Today
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₦{stats.totalCollected.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Amount
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  ₦{stats.pendingAmount.toLocaleString()}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Payments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completedPayments}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
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
                <p className="text-2xl font-bold text-red-600">
                  {stats.pendingCount}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingPayments.map((appointment) => {
                const patient = getPatientById(appointment.patientId);
                const doctor = getDoctorById(appointment.doctorId);
                const isProcessing = processingPayment === appointment.id;

                return (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{patient?.name}</p>
                        <p className="text-sm text-gray-600">
                          {doctor?.name} • {appointment.time}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        ₦5,000
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleProcessPayment(appointment.id, 5000, "cash")
                        }
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? "Processing..." : "Collect Cash"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleProcessPayment(appointment.id, 5000, "card")
                        }
                        disabled={isProcessing}
                      >
                        Card Payment
                      </Button>
                    </div>
                  </div>
                );
              })}

              {pendingPayments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  All payments collected for today!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Filters & Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Records for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const patient = getPatientById(payment.patientId);

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient?.name}</p>
                          <p className="text-sm text-gray-500">
                            {patient?.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ₦{payment.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>{getMethodBadge(payment.method)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {new Date(payment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Receipt
                          </Button>
                          {payment.status === "failed" && (
                            <Button size="sm" variant="outline">
                              Retry
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

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payment records found for{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
