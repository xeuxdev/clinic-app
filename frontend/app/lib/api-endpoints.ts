export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER_USER: "/auth/register-user",
    REGISTER_PATIENT: "/auth/register-patient",
    CHANGE_PASSWORD: "/auth/change_password/",
    REQUEST_PASSWORD_RESET: "/auth/request_password_reset",
  },
  APPOINTMENTS: {
    ADD: "/appointment/add-appointment",
    LIST: "/appointment/get-appointments",
    GET_BY_ID: (id: string | number) => `/appointment/${id}`,
    TODAY: "/appointment/today",
    SEARCH: (query: string) => `/appointment/search?q=${query}`,
    START: (id: string | number) => `/appointment/in_progress/${id}`,
    RESCHEDULE: (id: string | number) => `/appointment/reschedule/${id}`,
    CANCEL: (id: string | number) => `/appointment/cancel/${id}`,
    COMPLETE: (id: string | number) => `/appointment/complete/${id}`,
  },
  PATIENTS: {
    GET_ALL: "/patients",
    SEARCH: (query: string) => `/patients/search?q=${query}`,
  },
  DOCTORS: {
    GET_DOCTORS: "/doctors",
    GET_BY_ID: (id: string) => `/doctors/${id}`,
    REGISTER: "/doctor_receptionist/register",
    LIST_BY_ROLE: (role: "doctor" | "receptionist") =>
      `/doctor_receptionist/get_doctor_receptionist/${role}`,
  },
};
