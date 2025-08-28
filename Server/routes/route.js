import express from "express";
import {
  addAppointment,
  cancelAppointment,
  completeAppointment,
  getAppointmentById,
  listAppointment,
  rescheduleAppointment,
  saveConsultation,
  searchAppointments,
  startAppointment,
  todaysAppointments,
} from "../controller/appointment.controller.js";
import {
  patientRegister,
  userLogin,
  userRegister,
} from "../controller/auth.controller.js";
import {
  getDoctorById,
  getDoctors,
  getPatients,
  searchPatients,
} from "../controller/patient.controller.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifySession } from "../middleware/verifySession.js";

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
  listAppointment
);

appointmentRoute.get(
  "/appointment/:id",
  verifySession,
  verifyRole,
  getAppointmentById
);

// Today's appointments
appointmentRoute.get(
  "/appointment/today",
  verifySession,
  verifyRole,
  todaysAppointments
);
appointmentRoute.get(
  "/appointment/search",
  verifySession,
  verifyRole,
  searchAppointments
);
appointmentRoute.post(
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
appointmentRoute.post(
  "/appointment/reschedule/:appointment_id",
  verifySession,
  verifyRole,
  rescheduleAppointment
);

appointmentRoute.post(
  "/appointment/consultation",
  verifySession,
  verifyRole,
  saveConsultation
);

appointmentRoute.put(
  "/appointment/complete/:appointment_id",
  verifySession,
  verifyRole,
  completeAppointment
);

// Patient related routes
export const patientRoute = express.Router();
patientRoute.get("/patients", verifySession, verifyRole, getPatients);
patientRoute.get("/patients/search", verifySession, verifyRole, searchPatients);
patientRoute.get("/doctors", verifySession, verifyRole, getDoctors);
patientRoute.get("/doctors/:id", verifySession, verifyRole, getDoctorById);
