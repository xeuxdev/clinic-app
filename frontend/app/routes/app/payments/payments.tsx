import { useParams } from "react-router";
import {
  CreditCard,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  useGetAppointmentById,
  usePayForAppointment,
} from "~/api/appointments";
import { Skeleton } from "~/components/ui/skeleton";

export function meta() {
  return [
    { title: "Payment - Clinic Management" },
    {
      name: "description",
      content: "Process payment for appointment",
    },
  ];
}

export default function PaymentsPage() {
  const { appointmentId } = useParams();

  // Fetch appointment details
  const appointmentQuery = useGetAppointmentById(appointmentId!);
  const payMutation = usePayForAppointment();

  const appointment = appointmentQuery.data?.appointment;

  const handlePayment = () => {
    if (appointmentId) {
      payMutation.mutate(appointmentId);
    }
  };

  if (appointmentQuery.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Link to="/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (appointmentQuery.isError) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Link to="/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load appointment details.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Link to="/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Appointment not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/appointments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Process Payment</h1>
          <p className="text-gray-600">
            Payment for appointment #{appointment.id}
          </p>
        </div>
      </div>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Patient Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {appointment.patient_name || "Unknown"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {appointment.patient_phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {appointment.patient_email || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Appointment Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Doctor:</span>{" "}
                  {appointment.doctor_name || "Unknown"}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {new Date(appointment.appointment_date).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge className={appointment.status}>
                    {appointment.status}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          {appointment.note && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{appointment.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Section */}
      {!payMutation.isSuccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Consultation Fee</p>
                <p className="text-2xl font-bold text-green-600">₦5,000</p>
              </div>
              <Button
                onClick={handlePayment}
                disabled={payMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {payMutation.isPending ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Section */}
      {payMutation.isSuccess && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2 text-green-800">
              Payment Successful!
            </h2>
            <p className="text-green-600 mb-4">
              Your payment has been processed successfully.
            </p>
            <Link to="/appointments">
              <Button>Back to Appointments</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
