// Demo data for the clinic management system

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  address: string;
  medicalHistory?: string;
  email: string;
  registrationDate: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "partial";
  notes?: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  notes: string;
  prescriptions: string[];
  recommendations: string;
  status: "in-progress" | "completed";
  startTime?: string;
  endTime?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  appointmentId: string;
  amount: number;
  date: string;
  method: "cash" | "card" | "insurance";
  status: "completed" | "pending" | "failed";
}

// Demo patients data
export const demoPatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+234-801-234-5678",
    age: 35,
    address: "123 Main Street, Lagos",
    email: "john.smith@email.com",
    registrationDate: "2024-01-15",
    medicalHistory: "Hypertension, Diabetes",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+234-802-345-6789",
    age: 28,
    address: "456 Oak Avenue, Abuja",
    email: "sarah.johnson@email.com",
    registrationDate: "2024-02-20",
    medicalHistory: "Allergic to penicillin",
  },
  {
    id: "3",
    name: "Michael Davis",
    phone: "+234-803-456-7890",
    age: 42,
    address: "789 Pine Road, Kano",
    email: "michael.davis@email.com",
    registrationDate: "2024-01-30",
    medicalHistory: "Previous surgery on left knee",
  },
  {
    id: "4",
    name: "Emily Wilson",
    phone: "+234-804-567-8901",
    age: 31,
    address: "321 Elm Street, Port Harcourt",
    email: "emily.wilson@email.com",
    registrationDate: "2024-03-05",
    medicalHistory: "No known allergies",
  },
  {
    id: "5",
    name: "David Brown",
    phone: "+234-805-678-9012",
    age: 55,
    address: "654 Birch Lane, Ibadan",
    email: "david.brown@email.com",
    registrationDate: "2024-02-12",
    medicalHistory: "High cholesterol, Heart condition",
  },
];

// Demo doctors data
export const demoDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Amina Hassan",
    specialization: "General Medicine",
    email: "dr.hassan@clinic.com",
    phone: "+234-801-111-2222",
    avatar: "/doctor.webp",
  },
  {
    id: "2",
    name: "Dr. Chuka Okafor",
    specialization: "Cardiology",
    email: "dr.okafor@clinic.com",
    phone: "+234-802-222-3333",
    avatar: "/doctor.webp",
  },
  {
    id: "3",
    name: "Dr. Fatima Bello",
    specialization: "Pediatrics",
    email: "dr.bello@clinic.com",
    phone: "+234-803-333-4444",
    avatar: "/doctor.webp",
  },
  {
    id: "4",
    name: "Dr. Ibrahim Yusuf",
    specialization: "Orthopedics",
    email: "dr.yusuf@clinic.com",
    phone: "+234-804-444-5555",
    avatar: "/doctor.webp",
  },
  {
    id: "5",
    name: "Dr. Grace Adebayo",
    specialization: "Dermatology",
    email: "dr.adebayo@clinic.com",
    phone: "+234-805-555-6666",
    avatar: "/doctor.webp",
  },
];

// Demo appointments data (today's date)
export const demoAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    date: "2024-08-18",
    time: "09:00",
    status: "scheduled",
    paymentStatus: "paid",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "2",
    date: "2024-08-18",
    time: "10:30",
    status: "in-progress",
    paymentStatus: "paid",
  },
  {
    id: "3",
    patientId: "3",
    doctorId: "1",
    date: "2024-08-18",
    time: "14:00",
    status: "scheduled",
    paymentStatus: "pending",
  },
  {
    id: "4",
    patientId: "4",
    doctorId: "3",
    date: "2024-08-18",
    time: "15:30",
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "5",
    patientId: "5",
    doctorId: "4",
    date: "2024-08-18",
    time: "16:00",
    status: "scheduled",
    paymentStatus: "paid",
  },
  // Tomorrow's appointments
  {
    id: "6",
    patientId: "1",
    doctorId: "2",
    date: "2024-08-19",
    time: "09:30",
    status: "scheduled",
    paymentStatus: "pending",
  },
  {
    id: "7",
    patientId: "3",
    doctorId: "5",
    date: "2024-08-19",
    time: "11:00",
    status: "scheduled",
    paymentStatus: "paid",
  },
];

// Demo consultations data
export const demoConsultations: Consultation[] = [
  {
    id: "1",
    appointmentId: "2",
    notes:
      "Patient complaints of chest pain. Blood pressure slightly elevated. Recommended further tests.",
    prescriptions: ["Lisinopril 10mg daily", "Aspirin 81mg daily"],
    recommendations:
      "Follow up in 2 weeks. Reduce salt intake. Light exercise recommended.",
    status: "in-progress",
    startTime: "10:30",
  },
  {
    id: "2",
    appointmentId: "4",
    notes:
      "Regular checkup. Patient is recovering well from previous treatment.",
    prescriptions: ["Vitamin D supplement", "Continue current medication"],
    recommendations:
      "Continue current treatment plan. Schedule follow-up in 1 month.",
    status: "completed",
    startTime: "15:30",
    endTime: "16:00",
  },
];

// Demo payments data
export const demoPayments: Payment[] = [
  {
    id: "1",
    patientId: "1",
    appointmentId: "1",
    amount: 5000,
    date: "2024-08-18",
    method: "cash",
    status: "completed",
  },
  {
    id: "2",
    patientId: "2",
    appointmentId: "2",
    amount: 7500,
    date: "2024-08-18",
    method: "card",
    status: "completed",
  },
  {
    id: "3",
    patientId: "4",
    appointmentId: "4",
    amount: 4000,
    date: "2024-08-18",
    method: "insurance",
    status: "completed",
  },
  {
    id: "4",
    patientId: "5",
    appointmentId: "5",
    amount: 6000,
    date: "2024-08-18",
    method: "cash",
    status: "completed",
  },
];

// Helper functions to get related data
export const getPatientById = (id: string) =>
  demoPatients.find((p) => p.id === id);
export const getDoctorById = (id: string) =>
  demoDoctors.find((d) => d.id === id);
export const getAppointmentById = (id: string) =>
  demoAppointments.find((a) => a.id === id);
export const getConsultationByAppointmentId = (appointmentId: string) =>
  demoConsultations.find((c) => c.appointmentId === appointmentId);

export const getAppointmentsByDate = (date: string) =>
  demoAppointments.filter((a) => a.date === date);

export const getAppointmentsByDoctor = (doctorId: string, date?: string) =>
  demoAppointments.filter(
    (a) => a.doctorId === doctorId && (!date || a.date === date)
  );

export const getAppointmentsByPatient = (patientId: string) =>
  demoAppointments.filter((a) => a.patientId === patientId);

export const searchPatients = (query: string) =>
  demoPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.email.toLowerCase().includes(query.toLowerCase())
  );

export const getTodaysAppointments = () => {
  const today = new Date().toISOString().split("T")[0];
  return getAppointmentsByDate(today);
};

export const getAppointmentWithDetails = (appointmentId: string) => {
  const appointment = getAppointmentById(appointmentId);
  if (!appointment) return null;

  return {
    appointment,
    patient: getPatientById(appointment.patientId),
    doctor: getDoctorById(appointment.doctorId),
    consultation: getConsultationByAppointmentId(appointmentId),
  };
};
