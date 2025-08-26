export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register-user",
    PATIENT_REGISTER: "/auth/patient/register",
    CHANGE_PASSWORD: "/auth/change-password",
    REQUEST_PASSWORD_RESET: "/auth/request-reset",
  },
  APPOINTMENTS: {
    ADD: "/appointments/add",
    LIST: "/appointments",
    START: (id: string | number) => `/appointments/start/${id}`,
    RESCHEDULE: (id: string | number) => `/appointments/reschedule/${id}`,
    CANCEL: (id: string | number) => `/appointments/cancel/${id}`,
    COMPLETE: (id: string | number) => `/appointments/complete/${id}`,
  },
  DOCTORS: {
    LIST: "/doctors",
    GET_BY_ID: (id: string | number) => `/doctors/${id}`,
    ADD: "/doctors",
    UPDATE: (id: string | number) => `/doctors/${id}`,
    DELETE: (id: string | number) => `/doctors/${id}`,
  },
};
