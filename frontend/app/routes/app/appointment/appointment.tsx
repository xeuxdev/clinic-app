import { Search, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// Mock data for doctors
const availableDoctors = [
  {
    id: 1,
    name: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    image: "/doctor.webp",
    rating: 4,
    totalRating: 5,
  },
  {
    id: 2,
    name: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    image: "/doctor.webp",
    rating: 4,
    totalRating: 5,
  },
  {
    id: 3,
    name: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    image: "/doctor.webp",
    rating: 4,
    totalRating: 5,
  },
  {
    id: 4,
    name: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    image: "/doctor.webp",
    rating: 4,
    totalRating: 5,
  },
  {
    id: 5,
    name: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    image: "/doctor.webp",
    rating: 4,
    totalRating: 5,
  },
  {
    id: 6,
    name: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    image: "/doctor.webp",
    rating: 4,
    totalRating: 5,
  },
];

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Cardiologist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Urologist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Urologist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
];

// Mock data for past appointments
const pastAppointments = [
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Cardiologist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Urologist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Urologist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
  {
    doctorName: "Dr. Jane Doe",
    specialization: "Weight Management Specialist",
    date: "30/07/2025",
    time: "4:30 pm",
  },
];

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("past");

  const renderStars = (rating: number, totalRating: number) => {
    return (
      <div className="flex items-center gap-0 w-[100px] h-5">
        {[...Array(totalRating)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? "text-[#FFB800] fill-[#FFB800]"
                : "text-[#FFB800] fill-none"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10" />
      </div>

      {/* Available Doctors Section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Available Doctors
            </h2>
            <Button variant="ghost" className="text-primary">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-hidden border border-[#D9D9D9] rounded-lg max-h-[169px]"
              >
                <CardContent className="p-0 flex items-center py-[14px] pr-0 pl-3 gap-[14px] h-full">
                  <div className="flex-shrink-0 w-[127px] h-[141px] rounded-[4px] overflow-hidden bg-gray-100">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='127' height='141' viewBox='0 0 127 141'%3E%3Crect width='127' height='141' fill='%23f3f4f6'/%3E%3Cpath d='M63.5 35c13.2 0 24 10.8 24 24s-10.8 24-24 24-24-10.8-24-24 10.8-24 24-24zm0 60c17.6 0 32 14.4 32 32v10H31.5v-10c0-17.6 14.4-32 32-32z' fill='%239ca3af'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-start p-0 gap-[11px] w-[221px] h-[133px]">
                    <div className="flex flex-col items-start p-0 gap-[10px] w-[221px] h-[78px]">
                      <div className="flex flex-col justify-center items-start p-0 gap-1 w-[221px] h-12">
                        <div className="w-[102px] h-[25px]">
                          <h3 className="font-semibold text-lg leading-[25px] tracking-[-0.03em] text-[#4D4D4D] m-0">
                            {doctor.name}
                          </h3>
                        </div>

                        <div className="flex flex-row justify-center items-center p-0 gap-[10px] w-[221px] h-[19px]">
                          <p className="font-normal text-sm leading-[19px] tracking-[-0.03em] text-[#4D4D4D] w-[218px] h-[19px] m-0">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {renderStars(doctor.rating, doctor.totalRating)}
                      </div>
                    </div>

                    <Button>Book Appointment</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tables */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Tab-style Headers */}
            <div className="flex gap-8 border-b border-border">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`text-lg font-medium pb-2 transition-colors ${
                  activeTab === "upcoming"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upcoming Appointment
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`text-lg font-medium pb-2 transition-colors ${
                  activeTab === "past"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Past Appointment
              </button>
            </div>

            {/* Single Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border">
                    <TableHead className="text-muted-foreground font-medium">
                      Doctor Name
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Specialization
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeTab === "upcoming"
                    ? upcomingAppointments
                    : pastAppointments
                  ).map((appointment, index) => (
                    <TableRow
                      key={index}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <TableCell className="font-medium text-foreground py-4">
                        {appointment.doctorName}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-4">
                        {appointment.specialization}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-4">
                        {appointment.date}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-4">
                        {appointment.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
