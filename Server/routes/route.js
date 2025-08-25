import express from 'express';
import { changePassword, patientRegister, requestPasswordResetLink, userLogin, userRegister } from '../controller/auth.controller.js';
import { addAppointment, cancelAppointment, completeAppointment, listAppointment, rescheduleAppointment, startAppointment } from '../controller/appointment.controller.js';
import { verifySession } from '../middleware/verifySession.js';
import { verifyRole } from '../middleware/verifyRole.js';
import { addDoctor_receptionist, get_doctor_receptionist } from '../controller/Cdoctor.controller.js';
export const authRoute = express.Router();
authRoute.post('/register-patient',verifySession,verifyRole,patientRegister)
authRoute.post('/register-user',userRegister)
authRoute.post('/login', userLogin)
authRoute.post('/request_password_reset',requestPasswordResetLink);
authRoute.post('/change_password',changePassword)

export const appointmentRoute = express.Router();
appointmentRoute.post('/appointment/add-appointment',verifySession, verifyRole,addAppointment);
appointmentRoute.get('/appointment/get-appointments',verifySession, verifyRole, listAppointment);
appointmentRoute.post('/appointment/cancel/:appointment_id',verifySession, verifyRole,cancelAppointment);
appointmentRoute.post('/appointment/in_progress/:appointment_id',verifySession, verifyRole,startAppointment);
appointmentRoute.post('/appointment/reschedule/:appointment_id',verifySession, verifyRole,rescheduleAppointment);
appointmentRoute.post('/appointment/complete/:appointment_id',verifySession, verifyRole, completeAppointment)

export const doctor_receptionistRoute = express.Router();
doctor_receptionistRoute.post('/doctor_receptionist/register',verifySession,verifyRole, addDoctor_receptionist)
doctor_receptionistRoute.get('/doctor_receptionist/get_doctor_receptionist/role',verifySession,verifyRole,get_doctor_receptionist)

