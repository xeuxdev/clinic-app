// Auth Types
export interface RegisterUserPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "doctor" | "attendant";
}

export interface RegisterPatientPayload {
  email: string;
  password: string;
  phone_number: string;
  full_name: string;
  date_of_birth: string;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  medical_condition?: string;
  current_medication?: string;
  known_allergies?: string;
  role: "patient";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RequestPasswordResetPayload {
  email: string;
}

export interface ChangePasswordPayload {
  new_password: string;
}

export interface User {
  id: string;
  account_id: string;
  full_name: string;
  phone_number: string;
  date_of_birth?: string;
  blood_group?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  medical_condition?: string;
  current_medication?: string;
  known_allergies?: string;
  profile_picture?: string;
  email?: string;
  role: "doctor" | "attendant";
  created_at?: string;
  updated_at?: string;
}

export interface Account {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: "doctor" | "receptionist" | "patient";
}

export interface Profile {
  id: string;
  account_id: string;
  full_name: string;
  phone_number: string;
  date_of_birth?: string;
  blood_group?: string;
  medical_condition?: string;
  current_medication?: string;
  known_allergies?: string;
}

// Response Types
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface RegisterResponse extends ApiResponse {
  user: User;
}

export interface LoginResponse extends ApiResponse {
  user: User;
}

export interface DoctorReceptionistResponse extends ApiResponse {
  accounts: Account[];
  profiles: Profile[];
}

// Appointment Types
export interface AddAppointmentPayload {
  email: string;
  profile_id: number;
  appointment_date: string;
  doctor_id: number;
  note?: string;
}

export interface AddAppointmentResponse {
  success: true;
  message: string;
  appointment: Appointment;
}

export interface RescheduleAppointmentPayload {
  new_date: string;
}

export interface Appointment {
  id: number;
  profile_id: number;
  doctor_id: number;
  appointment_date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  patient_name: string;
  patient_phone: string;
  patient_dob: string | null;
  patient_medical_condition: string | null;
  patient_current_medication: string | null;
  patient_known_allergies: string | null;
  patient_email: string | null;
  doctor_name: string;
  doctor_email: string;
  status: "booked" | "in_progress" | "cancelled" | "completed" | "rescheduled";
  paymentstatus: "paid" | "pending";
}

export interface AppointmentResponse extends ApiResponse {
  appointment: Appointment;
}

export interface AppointmentsListResponse extends ApiResponse {
  appointments: Appointment[];
}

export interface AppointmentStatusResponse extends ApiResponse {
  data: Appointment;
}

export type SaveConsultationPayload = {
  appointment_id: number;
  notes: string;
  prescriptions: string;
  recommendations: string;
};

export type SaveConsultationResponse = ApiResponse & {};

export interface Patient {
  account_id: number;
  email: string;
  role: "patient";
  id: number;
  full_name: string;
  phone_number: string;
  date_of_birth: string | null;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  medical_condition: string | null;
  current_medication: string | null;
  known_allergies: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export type GetPatientsResponse = {
  success: boolean;
  patients: Patient[];
};

export type GetConsultationNotesResponse = {
  success: boolean;
  consultation: {
    id: number;
    appointment_id: number;
    notes: string;
    prescriptions: string;
    recommendations: string;
  };
  appointmentInfo: Appointment;
  doctorInfo: {
    profile: Profile;
    details: Array<{
      id: number;
      account_id: number;
      specialization: string;
      license_number: string;
      years_of_experience: number;
      created_at: string;
    }>;
  };
  patientInfo: Patient;
};

export type SearchPatientResponse = {
  success: boolean;
  results: Patient[];
};

export interface Doctor {
  id: number;
  account_id: number;
  full_name: string;
  phone_number: string;
  date_of_birth: string | null;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  medical_condition: string | null;
  current_medication: string | null;
  known_allergies: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
  details: {
    specialization: string;
    experience: number;
    license_number: number;
    years_of_experience: number;
    created_at: string;
  };
}

export type GetDoctorsResponse = {
  success: boolean;
  doctors: Doctor[];
};

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
}
