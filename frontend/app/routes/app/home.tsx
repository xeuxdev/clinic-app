import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(8); // Default selected date

  // Calendar functions
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Filter appointments for selected date
  const appointments = [
    {
      name: "Dr. Janet Doe",
      specialty: "Ophthalmologist",
      time: "10:30 am",
      day: "Tue",
      date: 8,
    },
    {
      name: "Dr. Michael Smith",
      specialty: "Cardiologist",
      time: "2:15 pm",
      day: "Tue",
      date: 8,
    },
    {
      name: "Dr. Sarah Johnson",
      specialty: "Dermatologist",
      time: "4:30 pm",
      day: "Wed",
      date: 9,
    },
  ];

  const selectedDateAppointments = appointments.filter(
    (apt) => apt.date === selectedDate
  );

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-5 p-5">
      <div className="flex-1">
        {/* Consult with a doctor section */}
        <Card className="mb-6">
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex-1 p-2 sm:p-4 text-center lg:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Consult with a doctor anytime, anywhere
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Get expert medical advice and care from the comfort of your
                  home.
                </p>
                <Button className="w-full sm:w-auto">Book Appointment</Button>
              </div>
              <div className="w-full lg:w-64 h-48 lg:h-full">
                <img
                  src="/hero-home.svg"
                  alt="Medical consultation illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Statistics */}
        <Card className="mb-6">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Health Statistics
            </CardTitle>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64 w-full">
              <img
                src="/placeholder.svg?height=256&width=600"
                alt="Health statistics chart"
                className="w-full h-full object-contain"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="mb-6 lg:mb-0">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Reports
            </CardTitle>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">
                      Reports Name
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      Prescribed By
                    </TableHead>
                    <TableHead className="min-w-[100px]">Tested On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">Diabetes Test</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        Dr James Doe
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        21/07/25
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-80">
        {/* Find a Service */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Find a Service
            </CardTitle>
            <p className="text-sm text-gray-600">Choose a Category</p>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {[
                {
                  name: "Endocrinology",
                  count: "100 Available",
                  color: "bg-pink-100",
                  icon: "🩺",
                },
                {
                  name: "Cardiology",
                  count: "85 Available",
                  color: "bg-green-100",
                  icon: "💊",
                },
                {
                  name: "Laboratory",
                  count: "120 Available",
                  color: "bg-yellow-100",
                  icon: "🔬",
                },
                {
                  name: "Ophthalmology",
                  count: "60 Available",
                  color: "bg-blue-100",
                  icon: "👁️",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-white cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center text-lg flex-shrink-0`}
                    >
                      {service.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{service.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {service.count}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar & Appointments */}
        <Card className="mb-6 py-3 gap-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Schedule</p>
              <CardTitle className="text-lg font-semibold">
                {getMonthName(currentDate)}
              </CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 px-3">
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm mb-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-1 sm:p-2 text-gray-500 font-medium">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </div>
              ))}
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`p-1 sm:p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                    day === selectedDate
                      ? "bg-primary text-white hover:bg-primary/90"
                      : ""
                  } ${
                    day === null ? "cursor-default hover:bg-transparent" : ""
                  }`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day || ""}
                </div>
              ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-3">
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No appointments for {selectedDate}</p>
                </div>
              ) : (
                selectedDateAppointments.map((appointment, i) => (
                  <div
                    key={i}
                    className="bg-primary text-white rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 text-center px-4 py-5">
                        <p className="text-sm opacity-90 font-medium">
                          {appointment.day}
                        </p>
                        <p className="text-2xl font-bold">{appointment.date}</p>
                      </div>
                      <div className="flex-1 px-4 py-4">
                        <p className="font-semibold text-base">
                          {appointment.name}
                        </p>
                        <p className="text-sm opacity-90 mb-2">
                          {appointment.specialty}
                        </p>
                        <span className="inline-block px-2 py-1 rounded bg-white/20 text-xs font-medium">
                          {appointment.time}
                        </span>
                      </div>
                      <div className="px-4">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
