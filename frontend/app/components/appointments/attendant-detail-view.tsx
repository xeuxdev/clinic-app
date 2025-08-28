import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  HeartIcon,
  PillIcon,
  AlertTriangleIcon,
  FileTextIcon,
  ScrollTextIcon,
  ClipboardListIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { formatDate, formatTime, calculateAge, cn } from "~/lib/utils";
import type { GetConsultationNotesResponse } from "~/api/types";

interface AttendantDetailViewProps {
  consultationData: GetConsultationNotesResponse;
}

export function AttendantDetailView({
  consultationData,
}: AttendantDetailViewProps) {
  const { appointmentInfo, doctorInfo, patientInfo, consultation } =
    consultationData;

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
      {/* Header with Appointment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Consultation Summary Report
          </CardTitle>
          <div className="text-center text-sm text-gray-600">
            Generated on {formatDate(new Date().toISOString())} at{" "}
            {formatTime(new Date().toISOString())}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
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
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge
                  className={cn("text-sm font-medium", appointmentInfo.status)}
                >
                  {appointmentInfo.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Payment</p>
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
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Appointment Note:
              </p>
              <p className="text-sm text-gray-800">{appointmentInfo.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-green-600" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Full Name</p>
                <p className="text-lg font-bold text-gray-900">
                  {patientInfo.full_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Age</p>
                  <p className="font-semibold text-gray-900">
                    {calculateAge(patientInfo.date_of_birth)} years
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Blood Group
                  </p>
                  <p className="font-semibold text-gray-900">
                    {patientInfo.blood_group || "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Date of Birth
                </p>
                <p className="font-semibold text-gray-900">
                  {patientInfo.date_of_birth
                    ? formatDate(patientInfo.date_of_birth)
                    : "Not specified"}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Phone</p>
                    <p className="font-medium text-gray-900">
                      {patientInfo.phone_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <p className="font-medium text-gray-900">
                      {patientInfo.email}
                    </p>
                  </div>
                </div>
              </div>

              {(patientInfo.medical_condition ||
                patientInfo.current_medication ||
                patientInfo.known_allergies) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">
                      Medical History
                    </h4>

                    {patientInfo.medical_condition && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <HeartIcon className="w-4 h-4 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Medical Condition
                          </p>
                          <p className="text-sm text-red-700">
                            {patientInfo.medical_condition}
                          </p>
                        </div>
                      </div>
                    )}

                    {patientInfo.current_medication && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <PillIcon className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Current Medication
                          </p>
                          <p className="text-sm text-blue-700">
                            {patientInfo.current_medication}
                          </p>
                        </div>
                      </div>
                    )}

                    {patientInfo.known_allergies && (
                      <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <AlertTriangleIcon className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Known Allergies
                          </p>
                          <p className="text-sm text-orange-700">
                            {patientInfo.known_allergies}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
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
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Doctor Name
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {doctorInfo.profile.full_name}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Phone</p>
                <p className="font-semibold text-gray-900">
                  {doctorInfo.profile.phone_number}
                </p>
              </div>

              {doctorInfo.details.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">
                      Professional Details
                    </h4>

                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Specialization
                      </p>
                      <p className="font-semibold text-blue-700">
                        {doctorInfo.details[0].specialization}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Experience
                        </p>
                        <p className="font-semibold text-gray-900">
                          {doctorInfo.details[0].years_of_experience} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          License #
                        </p>
                        <p className="font-semibold text-gray-900">
                          {doctorInfo.details[0].license_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-purple-600" />
            Consultation Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ScrollTextIcon className="w-4 h-4 text-gray-600" />
                <p className="font-semibold text-gray-800">
                  Consultation Notes
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg min-h-[120px]">
                <p className="whitespace-pre-wrap text-gray-700">
                  {consultation?.notes || "No consultation notes available"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <PillIcon className="w-4 h-4 text-gray-600" />
                <p className="font-semibold text-gray-800">Prescriptions</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg min-h-[100px]">
                <p className="whitespace-pre-wrap text-gray-700">
                  {consultation?.prescriptions || "No prescriptions provided"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardListIcon className="w-4 h-4 text-gray-600" />
                <p className="font-semibold text-gray-800">Recommendations</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg min-h-[100px]">
                <p className="whitespace-pre-wrap text-gray-700">
                  {consultation?.recommendations ||
                    "No recommendations provided"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
