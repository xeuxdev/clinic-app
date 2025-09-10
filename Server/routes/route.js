import express from "express";
import {
  addAppointment,
  cancelAppointment,
  completeAppointment,
  getAppointmentById,
  getAppointments,
  payForAppointment,
  rescheduleAppointment,
  saveConsultation,
  startAppointment,
} from "../controller/appointment.controller.js";
import {
  patientRegister,
  userLogin,
  userRegister,
} from "../controller/auth.controller.js";
import {
  getConsultationById,
  getDoctorById,
  getDoctors,
  getPatients,
  searchPatients,
} from "../controller/patient.controller.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifySession } from "../middleware/verifySession.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const authRoute = express.Router();
authRoute.post("/register-patient", verifySession, verifyRole, patientRegister);
authRoute.post("/register-user", userRegister);
authRoute.post("/login", userLogin);
// authRoute.post("/request_password_reset", requestPasswordResetLink);
// authRoute.post("/change_password/reset_password_token", changePassword);

export const appointmentRoute = express.Router();
appointmentRoute.post(
  "/appointment/add-appointment",
  verifySession,
  verifyRole,
  addAppointment
);
appointmentRoute.get(
  "/appointment/get-appointments",
  verifySession,
  verifyRole,
  getAppointments
);

appointmentRoute.get(
  "/appointment/:id",
  verifySession,
  verifyRole,
  getAppointmentById
);

appointmentRoute.put(
  "/appointment/cancel/:appointment_id",
  verifySession,
  verifyRole,
  cancelAppointment
);
appointmentRoute.put(
  "/appointment/start/:id",
  verifySession,
  verifyRole,
  startAppointment
);
appointmentRoute.put(
  "/appointment/reschedule/:appointment_id",
  verifySession,
  verifyRole,
  rescheduleAppointment
);

appointmentRoute.put(
  "/appointment/complete/:appointment_id",
  verifySession,
  verifyRole,
  completeAppointment
);

appointmentRoute.put(
  "/appointment/pay/:appointment_id",
  verifySession,
  verifyRole,
  payForAppointment
);

appointmentRoute.post(
  "/appointment/consultation",
  verifySession,
  verifyRole,
  saveConsultation
);

// Patient related routes
export const patientRoute = express.Router();
patientRoute.get("/patients", verifySession, verifyRole, getPatients);
patientRoute.get("/patients/search", verifySession, verifyRole, searchPatients);
patientRoute.get(
  "/patients/consultation/:id",
  verifySession,
  verifyRole,
  getConsultationById
);
patientRoute.get("/doctors", verifySession, verifyRole, getDoctors);
patientRoute.get("/doctors/:id", verifySession, verifyRole, getDoctorById);
