import { useState } from "react";
import { Link } from "react-router";
import { Search, Plus, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  demoPatients,
  searchPatients,
  getAppointmentsByPatient,
  type Patient,
} from "~/lib/demo-data";

export function meta() {
  return [
    { title: "Patients - Clinic Management" },
    { name: "description", content: "Manage patient records and information" },
  ];
}

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(demoPatients);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPatients(demoPatients);
    } else {
      setFilteredPatients(searchPatients(query));
    }
  };

  const getPatientAppointmentCount = (patientId: string) => {
    return getAppointmentsByPatient(patientId).length;
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Management
          </h1>
          <p className="text-gray-600">
            Manage patient records and information
          </p>
        </div>
        <Link to="/patients/register">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Register New Patient
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {demoPatients.length}
              </p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {
                  demoPatients.filter((p) => {
                    const today = new Date();
                    const regDate = new Date(p.registrationDate);
                    const diffTime = Math.abs(
                      today.getTime() - regDate.getTime()
                    );
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 30;
                  }).length
                }
              </p>
              <p className="text-sm text-gray-600">New This Month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredPatients.length}
              </p>
              <p className="text-sm text-gray-600">Search Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
        </CardHeader>
        <CardContent className="gap-6 flex-col flex">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        {patient.medicalHistory && (
                          <p className="text-xs text-gray-500 mt-1">
                            Medical History: {patient.medicalHistory}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {patient.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.age} years</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(
                          patient.registrationDate
                        ).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">
                        {getPatientAppointmentCount(patient.id)} appointments
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/appointments/book?patientId=${patient.id}`}>
                          <Button size="sm" variant="outline">
                            Book Appointment
                          </Button>
                        </Link>
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? (
                <>
                  No patients found matching "{searchQuery}".{" "}
                  <Link
                    to="/patients/register"
                    className="text-blue-600 hover:underline"
                  >
                    Register new patient
                  </Link>
                </>
              ) : (
                <>
                  No patients registered yet.{" "}
                  <Link
                    to="/patients/register"
                    className="text-blue-600 hover:underline"
                  >
                    Register the first patient
                  </Link>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
