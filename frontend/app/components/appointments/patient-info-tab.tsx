import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  HeartIcon,
  PillIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { formatDate, formatTime, calculateAge, cn } from "~/lib/utils";
import type { GetConsultationNotesResponse } from "~/api/types";

interface PatientInfoTabProps {
  consultationData: GetConsultationNotesResponse;
}

export function PatientInfoTab({ consultationData }: PatientInfoTabProps) {
  const { appointmentInfo, doctorInfo, patientInfo } = consultationData;

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Appointment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">
                  {formatDate(appointmentInfo.appointment_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <ClockIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">
                  {formatTime(appointmentInfo.appointment_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Badge
                className={cn("text-sm font-medium", appointmentInfo.status)}
              >
                {appointmentInfo.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <Badge
                  className={cn(
                    "text-sm font-medium",
                    getPaymentStatusColor(appointmentInfo.paymentstatus)
                  )}
                >
                  {appointmentInfo.paymentstatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          {appointmentInfo.note && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Appointment Note</p>
              <p className="text-sm text-gray-800">{appointmentInfo.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-green-600" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-semibold text-lg">{patientInfo.full_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Age</p>
                  <p className="font-semibold">
                    {calculateAge(patientInfo.date_of_birth)} years
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                  <p className="font-semibold">
                    {patientInfo.blood_group || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                <p className="font-semibold">
                  {patientInfo.date_of_birth
                    ? formatDate(patientInfo.date_of_birth)
                    : "Not specified"}
                </p>
              </div>
            </div>

            {/* Contact & Medical Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <PhoneIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{patientInfo.phone_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MailIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{patientInfo.email}</p>
                </div>
              </div>

              {patientInfo.medical_condition && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <HeartIcon className="w-4 h-4 text-red-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Medical Condition</p>
                    <p className="font-medium text-red-700">
                      {patientInfo.medical_condition}
                    </p>
                  </div>
                </div>
              )}

              {patientInfo.current_medication && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <PillIcon className="w-4 h-4 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Current Medication</p>
                    <p className="font-medium text-blue-700">
                      {patientInfo.current_medication}
                    </p>
                  </div>
                </div>
              )}

              {patientInfo.known_allergies && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangleIcon className="w-4 h-4 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Known Allergies</p>
                    <p className="font-medium text-orange-700">
                      {patientInfo.known_allergies}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Doctor Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Doctor Name</p>
                <p className="font-semibold text-lg">
                  {doctorInfo.profile.full_name}
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <PhoneIcon className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">
                    {doctorInfo.profile.phone_number}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {doctorInfo.details.length > 0 && (
                <>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Specialization</p>
                    <p className="font-semibold">
                      {doctorInfo.details[0].specialization}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Experience</p>
                      <p className="font-semibold">
                        {doctorInfo.details[0].years_of_experience} years
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">License #</p>
                      <p className="font-semibold">
                        {doctorInfo.details[0].license_number}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
