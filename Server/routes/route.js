import express from 'express';
import { changePassword, patientRegister, requestPasswordResetLink, userLogin, userRegister } from '../controller/auth.controller';
import { addAppointment, cancelAppointment, completeAppointment, listAppointment, rescheduleAppointment, startAppointment } from '../controller/appointment.controller';
import { verifySession } from '../middleware/verifySession';
import { verifyRole } from '../middleware/verifyRole';
export const authRoute = express.Router();
authRoute.post('/register-patient',verifySession(),verifyRole,patientRegister)
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


